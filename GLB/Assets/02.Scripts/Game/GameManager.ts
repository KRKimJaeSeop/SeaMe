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

    private wfs1: WaitForSeconds = new WaitForSeconds(1);
    private wfs3: WaitForSeconds = new WaitForSeconds(3);

    public dome: GameObject;
    //public GameResetEvent: UnityEvent;

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

        //  this.GameResetEvent = new UnityEvent();
        //  this.GameResetEvent.AddListener(() => this.ResetGameManager());

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
                    let currentHare = this.RandomSeaHare();
                    // let currentHare = Resources.Load("SeaHare_0") as GameObject;
                    // currentHare = GameObject.Instantiate(currentHare) as GameObject;
                    currentHare.transform.SetParent(currentPlayers.transform.GetChild(0));
                    currentHare.transform.localPosition = Vector3.zero;
                    currentHare.transform.rotation = Quaternion.Euler(0, 0, 0);
                }
            }
        });


        //유저 수 충족. 카운트다운 시작
        if (this.UserList.length == this.worldSettings["roomPlayerCapacity"]) {


            if (this.SurvivorList.length == 0) {
                this.StartCoroutine(this.StartGame());
            }
        }
        else {
            GameManager.instance.UI.MainNotification
                (`Waiting for other Players... \n ${this.UserList.length} / ${this.worldSettings["roomPlayerCapacity"]}`, 9999);
        }
    }

    public RandomSeaHare(): GameObject {

        let randomNum = Math.floor(Math.random() * (5 - 0 + 1));

        switch (randomNum) {
            case 0:
                let currentHare0 = Resources.Load("SeaHare_0") as GameObject;
                return GameObject.Instantiate(currentHare0) as GameObject;
                break;
            case 1:
                let currentHare1 = Resources.Load("SeaHare_1") as GameObject;
                return GameObject.Instantiate(currentHare1) as GameObject;
                break;
            case 2:
                let currentHare2 = Resources.Load("SeaHare_2") as GameObject;
                return GameObject.Instantiate(currentHare2) as GameObject;
                break;
            case 3:
                let currentHare3 = Resources.Load("SeaHare_3") as GameObject;
                return GameObject.Instantiate(currentHare3) as GameObject;
                break;
            case 4:
                let currentHare4 = Resources.Load("SeaHare_4") as GameObject;
                return GameObject.Instantiate(currentHare4) as GameObject;
                break;
            case 5:
                let currentHare5 = Resources.Load("SeaHare_5") as GameObject;
                return GameObject.Instantiate(currentHare5) as GameObject;
                break;
            default:
                let currentHareDefalut = Resources.Load("SeaHare_0") as GameObject;
                return GameObject.Instantiate(currentHare0) as GameObject;
                break;
        }
    }

    public RemovePlayer(sessionId: string) {
        for (let i = 0; i < this.UserList.length; i++) {
            if (this.UserList[i] === sessionId) {
                this.UserList.splice(i, 1);
                i--;
            }
        }
        this.RemoveSurvivorList(sessionId);

    }

    public RemoveSurvivorList(sessionId: string) {
        Debug.Log("RemoveSurvivorList::함수 진입");
        //제거하지말고, 그대로 게임 종료시키기
        for (let i = 0; i < this.SurvivorList.length; i++) {
            if (this.SurvivorList[i] == sessionId) {
                this.SurvivorList.splice(i, 1);
                i--;
            }
        }
        if (!this.IsAbleDie()) {
            Debug.Log("RemoveSurvivorList::Send Winner");
            //지우고 나서, 남은유저가 1명 이하일 때 
            MultiplayManager.instance.room.Send("Winner", this.SurvivorList[0]);
            Debug.Log("RemoveSurvivorList::멀티로 보내기 진입");
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
        this.dome.GetComponent<Dome>().StartDome();

        //위치 스폰
        for (let index = 0; index < this.UserList.Length; index++) {
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
        if (ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.id == this.UserList[0]) {
            MultiplayManager.instance.room.Send("GameStart", `0`);
        }

        this.SurvivorList.splice(0, this.SurvivorList.length)
        //생존자 리스트 추가
        for (let index = 0; index < this.UserList.Length; index++) {
            this.SurvivorList.push(this.UserList[index]);
        }

        ZepetoChat.SetActiveChatUI(false);
    }

    public ResetGame() {
        Debug.Log(`ResetGame Coroutine::Start `);
        this.StartCoroutine(this.FinishGame());
    }

    public IsAbleDie(): bool {
        if (this.SurvivorList.length > 1) {
            return true;
        }
        else {
            return false;
        }
    }

    // 남은유저가 1명 이하일때 바로 시작되는 코루틴
    *FinishGame() {

        yield this.wfs3;
        //자기장 이동 정지, 채팅UI 활성화
        this.dome.GetComponent<Dome>().EndDome();
        ZepetoChat.SetActiveChatUI(true);
        //승리 플레이어 닉네임 UI표시
        let _winner = "";
        if (this.SurvivorList[0] == null) {
            _winner = "X";
        }
        else {
            _winner = ZepetoPlayers.instance.GetPlayer(this.SurvivorList[0]).name;
        }
        GameManager.instance.UI.MainNotification(`game finish`, 3);
        GameManager.instance.UI.SubNotification(`Winner : ${_winner}`, 6);
        yield this.wfs3;

        //곧 시작합니다
        GameManager.instance.UI.MainNotification(`will be start`, 3);
        yield this.wfs3;

        //텔레포트
        const localCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        localCharacter.Teleport(new Vector3(150, 11, 0), Quaternion.identity);
        //생존자 수 0으로 세팅
        this.SurvivorList.splice(0, this.SurvivorList.length)
        //브금틀기
        GameManager.instance.Sound.PlayBGM(GameManager.instance.Sound.AREA_WAITROOM);
        GameManager.instance.UI.SetBlackImage(false);

        //생존자 수가 0일때 게임시작?
        if (this.UserList.Length == this.worldSettings["roomPlayerCapacity"]) {
            this.StartCoroutine(this.StartGame());
        }
        else {
            GameManager.instance.UI.MainNotification
                (`Waiting for other Players... \n ${this.UserList.length} / ${this.worldSettings["roomPlayerCapacity"]}`, 99999);
        }

    }

}
