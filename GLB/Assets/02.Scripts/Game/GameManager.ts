import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { CharacterState, SpawnInfo, ZepetoPlayer, ZepetoPlayers } from "ZEPETO.Character.Controller"
import { Physics, GameObject, RaycastHit, Input, Camera, Debug, WaitForSeconds, Vector3, Ray, LayerMask, Color, Quaternion, HumanBodyBones, Resources } from 'UnityEngine';
import { RawImage, Text } from "UnityEngine.UI";
import { List$1 } from 'System.Collections.Generic';
import PlayerController from '../Character/PlayerController';

export default class GameManager extends ZepetoScriptBehaviour {

    @SerializeField()
    private testText: Text

    public UserList: string[];

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

    public SetPlayers(userName: string) {
        this.UserList.push(userName);
        Debug.Log("시작");
        if (!GameObject.Find(userName).GetComponent<PlayerController>().isHaveSeaHare) {
            //플레이어 추가. 모든 플레이어를 검색하고, 그 플레이어의 하위에 달팽이가 있는지 검색. 없다면 달팽이를 추가해준다.
            //플레이어 하위에 달팽이가 있는가?

            this.UserList.forEach(element => {
                Debug.Log("찾았다");
                let currentPlayers = GameObject.Find(element);

                if (currentPlayers != null) {
                    if (!currentPlayers.GetComponent<PlayerController>().isHaveSeaHare) {
                        Debug.Log("여기다");
                        let currentHare = Resources.Load("SeaHare_0") as GameObject;
                        currentHare = GameObject.Instantiate(currentHare) as GameObject;
                        currentHare.transform.SetParent(currentPlayers.transform.GetChild(0));
                        currentHare.transform.localPosition = Vector3.zero;
                    }
                }


            });
        }
    }

    public RemovePlayer(userName: string) {
        for (let i = 0; i < this.UserList.length; i++) {
            if (this.UserList[i] === userName) {
                this.UserList.splice(i, 1);
                i--;
            }
        }
    }

}
