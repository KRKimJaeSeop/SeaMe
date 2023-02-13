import { ZepetoScriptableObject, ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { CharacterState, SpawnInfo, ZepetoPlayer, ZepetoPlayers } from "ZEPETO.Character.Controller"
import { Physics, GameObject, RaycastHit, Input, Camera, Debug, WaitForSeconds, Vector3, Ray, LayerMask, Color, Quaternion, HumanBodyBones, Resources, Transform } from 'UnityEngine';
import { RawImage, Text } from "UnityEngine.UI";
import { List$1 } from 'System.Collections.Generic';
import PlayerController from '../Character/PlayerController';
import Dome from '../Game/Dome';
import MultiplayManager from '../../MultiplaySync/Common/MultiplayManager';
import WorldSettingScript from '../Table/WorldSettingScript';

export default class GameManager extends ZepetoScriptBehaviour {

    @SerializeField()
    private testText: Text
    public worldSettings: ZepetoScriptableObject<WorldSettingScript>;


    public UserList: string[];
    public SpawnPositionList: Transform[];

    public dome: GameObject;


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
    }

    public SetTestText(setText: string) {
        this.testText.text = setText;
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

        //추가 후 
        if (this.UserList.length == this.worldSettings["roomPlayerCapacity"]) {
            this.StartCoroutine(this.StartGame());
        }
        else{
            this.SetTestText(`Waiting for other Players... \n ${this.UserList.length} / ${this.worldSettings["roomPlayerCapacity"]}`);

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
    
    public GetUserSpawnPosition(sessionId: string): Vector3 {

        this.StartCoroutine(this.dome.GetComponent<Dome>().DomeScaleControll());
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
            this.SetTestText(`The game will begin shortly..[${count}]`);
            yield new WaitForSeconds(1);
        }

        MultiplayManager.instance.room.Send("GameStart", `0`);
        this.SetTestText(`Game Start!`);
    }


}
