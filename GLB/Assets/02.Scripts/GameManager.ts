import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { CharacterState, SpawnInfo, ZepetoPlayer, ZepetoPlayers } from "ZEPETO.Character.Controller"
import { Physics, GameObject, RaycastHit, Input, Camera, Debug, WaitForSeconds,Vector3, Ray, LayerMask, Color, Quaternion,HumanBodyBones } from 'UnityEngine';

export default class GameManager extends ZepetoScriptBehaviour {

    //@SerializeField()
    public customCharacter: GameObject

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




    Start(){
        this.StartCoroutine(this.TestRoutine());
    }


    *TestRoutine() {

        yield new WaitForSeconds(3);

        // 로컬 캐릭터
        let _character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;

        // 본 위치
        let tempTransform = _character.character.Context.transform;// ZepetoAnimator.GetBoneTransform(UnityEngine.HumanBodyBones.);
        let tempVector = new Vector3(tempTransform.position.x, tempTransform.position.y, tempTransform.position.z);

        // 캐릭터 off
        _character.character.ZepetoAnimator.GetBoneTransform(HumanBodyBones.Hips).gameObject.SetActive(false);
        _character.character.Context.transform.GetChild(0).gameObject.SetActive(false);

        // Instantiate한 프리팹
        let _gameObject = GameObject.Instantiate(this.customCharacter, tempTransform) as GameObject;

        _gameObject.transform.SetParent(tempTransform);

    }


}