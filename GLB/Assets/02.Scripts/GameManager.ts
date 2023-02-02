import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Physics, GameObject, RaycastHit, Input, Camera, Debug, WaitForSeconds, Ray, LayerMask, Color, Quaternion } from 'UnityEngine';

export default class GameManager extends ZepetoScriptBehaviour {

    private static Instance: GameManager;

    public static GetInstance(): GameManager {

        if (GameManager.Instance == null) {
            Debug.Log("[Generate GameManager]");
            var _obj = new GameObject("GameManager");
            GameObject.DontDestroyOnLoad(_obj);
            GameManager.Instance = _obj.AddComponent<GameManager>();
        }
        return GameManager.Instance;
    }

    public intTest: number;


}