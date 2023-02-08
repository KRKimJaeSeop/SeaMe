import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { CharacterState, SpawnInfo, ZepetoPlayer, ZepetoPlayers } from "ZEPETO.Character.Controller"
import { Physics, GameObject, RaycastHit, Input, Camera, Debug, WaitForSeconds, Vector3, Ray, LayerMask, Color, Quaternion, HumanBodyBones } from 'UnityEngine';
import { List$1 } from 'System.Collections.Generic';

export default class GameManager extends ZepetoScriptBehaviour {

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
    }
 

}
