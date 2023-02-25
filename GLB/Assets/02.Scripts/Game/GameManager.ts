import { ZepetoScriptableObject, ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { CharacterState, SpawnInfo, ZepetoPlayer, ZepetoPlayers } from "ZEPETO.Character.Controller"
import { Physics, GameObject, RaycastHit, Input, Camera, Debug, WaitForSeconds, Vector3, Ray, LayerMask, Color, Quaternion, HumanBodyBones, Resources, Transform, Coroutine } from 'UnityEngine';
import { RawImage, Text, Image } from "UnityEngine.UI";
import { List$1 } from 'System.Collections.Generic';
import PlayerController from '../Character/PlayerController';
import Dome from '../Game/Dome';
import MultiplayManager from '../../MultiplaySync/Common/MultiplayManager';
import WorldSettingScript from '../Table/WorldSettingScript';
import { ZepetoChat, MessageType, UserMessage } from 'ZEPETO.Chat';
import SeaHareObject from '../Character/SeaHareObject';
import SoundManager from './SoundManager';
import UIManager from './UIManager';
import { UnityEvent } from 'UnityEngine.Events';

export default class GameManager extends ZepetoScriptBehaviour {

    //월드 세팅
    @SerializeField()
    private worldSettings: ZepetoScriptableObject<WorldSettingScript>;
    //ui매니저
    @SerializeField()
    private uiManager: GameObject;
    public UI: UIManager;
    //사운드 매니저
    @SerializeField()
    private sound: GameObject;
    public Sound: SoundManager;

    public UserList: string[];
    public SurvivorList: string[];

    public SpawnPositionList: Transform[];
    private DomeCorouine: Coroutine = null;


    public dome: GameObject;
    private GameResetEvent: UnityEvent;

    /* Singleton */
    private static m_instance: GameManager = null;
    public static get instance(): GameManager {
        if (this.m_instance === null) {
            this.m_instance = GameObject.FindObjectOfType<GameManager>();
            if (this.m_instance === null) {
                this.m_instance = new GameObject(GameManager.name).AddComponent<GameManager>();
            }
        }
        return this.m_instance;
    }

    private Awake() {
        Debug.LogWarning(`==========================`);
        if (GameManager.m_instance !== null && GameManager.m_instance !== this) {
            GameObject.Destroy(this.gameObject);
        } else {
            GameManager.m_instance = this;
            GameObject.DontDestroyOnLoad(this.gameObject);
        }
        if (this.UserList[0] == "empty") {
            this.UserList.shift();
        }

        this.UI = this.uiManager.GetComponent<UIManager>();
        this.Sound = this.sound.GetComponent<SoundManager>();

        this.GameResetEvent = new UnityEvent();
        this.GameResetEvent.AddListener(() => this.ResetGameManager());
    }


    public SetPlayers(sessionId: string) {


        this.UserList.push(sessionId);

        this.UserList.forEach(element => {
            Debug.Log(`SetPlayers:: Enter forEach${element}`);
            //오브젝트를 리스트에 있는 게임오브젝트를 찾는다.
            let currentPlayers = GameObject.Find(element);
            Debug.Log(`${currentPlayers}}`);
            //찾은 오브젝트가 널이 아니라면
            if (currentPlayers != null) {

                //찾은 오브젝트가 달팽이를 가지고있다고 뜨지 않으면
                if (!currentPlayers.GetComponent<PlayerController>().isHaveSeaHare) {
                    let currentHare = Resources.Load("SeaHare_0") as GameObject;
                    currentHare = GameObject.Instantiate(currentHare) as GameObject;
                    currentHare.transform.SetParent(currentPlayers.transform.GetChild(0));
                    currentHare.transform.localPosition = Vector3.zero;
                    currentHare.transform.rotation = Quaternion.Euler(0, 0, 0);
                }
            }
        });


        //유저 수 충족. 카운트다운 시작
        if (this.UserList.length == this.worldSettings["roomPlayerCapacity"]) {
            this.StartCoroutine(this.StartGame());
        }
        else {
            GameManager.instance.UI.MainNotification
                (`Waiting for other Players... \n ${this.UserList.length} / ${this.worldSettings["roomPlayerCapacity"]}`, 200);
        }
    }

    public RemovePlayer(sessionId: string) {
        for (let i = 0; i < this.UserList.length; i++) {
            if (this.UserList[i] === sessionId) {
                this.UserList.splice(i, 1);
                i--;
            }
        }
    }

    public RemoveSurvivorList(sessionId: string) {
        for (let i = 0; i < this.SurvivorList.length; i++) {
            if (this.SurvivorList[i] == sessionId) {
                this.SurvivorList.splice(i, 1);
                i--;

            }
        }
        //지우고 나서, 남은유저가 1명 이하일 때 
        if (this.SurvivorList.length <= 1) {
            this.StartCoroutine(this.FinishGame());
        }
    }

    public GetUserSpawnPosition(sessionId: string): Vector3 {

        //정렬후 스폰
        this.UserList.sort((a, b) => {

            let aValue = a.toUpperCase();
            let bValue = b.toUpperCase();
            if (aValue < bValue) {
                return -1;
            } else if (aValue > bValue) {
                return 1;
            }
            return 0;
        });

        if (this.DomeCorouine != null) {
            this.StopCoroutine(this.DomeCorouine);
            this.DomeCorouine = null;
        }
        //돔 시작
        this.DomeCorouine =
            this.StartCoroutine(this.dome.GetComponent<Dome>().DomeScaleControll());


        //위치 스폰
        for (let index = 0; index < this.UserList.Length; index++) {
            this.SurvivorList.push(sessionId);
            if (this.UserList[index] == sessionId) {
                return this.SpawnPositionList[index].position;
            }
        }
        return this.SpawnPositionList[5].position;
    }

    *StartGame() {

        let count = this.worldSettings["countdownBeforeGameStart"];
        while (count > 0) {
            count--;
            GameManager.instance.UI.MainNotification(`The game will begin shortly..[${count}]`, 0.9);
            yield new WaitForSeconds(1);
        }

        MultiplayManager.instance.room.Send("GameStart", `0`);
        ZepetoChat.SetActiveChatUI(false);

    }

    //승리
    *FinishGame() {
        GameManager.instance.UI.MainNotification("Victory!");
        GameManager.instance.UI.GameWinEffect(3);
        ZepetoChat.SetActiveChatUI(true);
        this.GameResetEvent.Invoke();
    }

    ResetGameManager() {
        if (this.UserList.length == this.worldSettings["roomPlayerCapacity"]) {
            this.StartCoroutine(this.StartGame());
        }
        else {
            GameManager.instance.UI.MainNotification
                (`Waiting for other Players... \n ${this.UserList.length} / ${this.worldSettings["roomPlayerCapacity"]}`, 200);
        }
    }


}
