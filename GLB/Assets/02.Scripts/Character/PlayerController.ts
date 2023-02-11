import { ZepetoScriptableObject, ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Physics, RaycastHit, Input, Camera, Debug, WaitForSeconds, Coroutine, HumanBodyBones, Vector3, Ray, LayerMask, Color, Quaternion, WaitUntil, Collider, Resources, GameObject } from 'UnityEngine';
import { ZepetoCamera, ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Room } from 'ZEPETO.Multiplay';
import CharacterSettingScript from '../Table/CharacterSettingScript';
import MultiplayManager from '../../MultiplaySync/Common/MultiplayManager';
import { ZepetoWorldHelper, ZepetoWorldMultiplay } from 'ZEPETO.World';
import { StyleInt } from 'UnityEngine.UIElements';
import GameManager from '../Game/GameManager';
import PlayerSync from '../../MultiplaySync/Player/PlayerSync';
import SeaHareObject from './SeaHareObject';

export default class PlayerController extends ZepetoScriptBehaviour {

    public playerValue: ZepetoScriptableObject<CharacterSettingScript>;

    public userID: string;
    public sessionID: string = "";

    public AttackID: string = "";

    private PlayerObject: GameObject;
    private AttackCoroutine: Coroutine = null;

    private DeathDomeCountdown: Coroutine = null;
    private DeathDomeHP: number;

    @SerializeField()
    private isGamePlaying: bool = false;

    public isHaveSeaHare: bool = false;

    //#region [초기 세팅]


    public SetCharacter() {
        //일단 다 끄기
        this.transform.GetChild(0).GetChild(0).gameObject.SetActive(false);
        this.transform.GetChild(0).GetChild(1).gameObject.SetActive(false);
        //자기 자신일때
        if (this.transform.GetComponent<PlayerSync>()?.isLocal) {
             
            this.SetOtherCharacter();

            this.AddMessageHandler();

            this.StartCoroutine(this.ShootRay());

            this.PlayerValueSetting();
        //    MultiplayManager.instance.Instantiate("SeaHare_0", this.sessionID, Vector3.zero, Quaternion.identity);
        }
    }
    
    public SetOtherCharacter() {

        // 자기 자신이 아닐때
        if (!this.transform.GetComponent<PlayerSync>()?.isLocal) {

            //모든 플레이어한테 달팽이 생성..
           // MultiplayManager.instance.Instantiate("SeaHare_0", this.sessionID, Vector3.zero, Quaternion.identity);
        }
    }

    //[메세지 핸들러 등록]
    private AddMessageHandler() {

        //게임 시작시 플레이어 세팅 수신

        // 게임 오버 수신

        MultiplayManager.instance.room.AddMessageHandler("GameOver", (message) => {
            Debug.Log(message);
            if (message == this.sessionID) {
                GameManager.instance.SetTestText("Status::NONE");
                this.gameObject.SetActive(false);
            }
        });

        // 생성시
        MultiplayManager.instance.room.AddMessageHandler("Instantiate", (message: string) => {

            Debug.Log(message);
        });

    }

    //게임 입장시 플레이어의 수치를 조정한다.
    private PlayerValueSetting() {
        ZepetoPlayers.instance.ZepetoCamera.camera.transform.GetComponent<Camera>().farClipPlane = this.playerValue["cameraDistance"];
        ZepetoPlayers.instance.characterData.jumpPower = this.playerValue["playerJumpPower"];
        ZepetoPlayers.instance.characterData.runSpeed = this.playerValue["playerMoveSpeed"];
    }

    //#endregion

    //#region [레이 발사 /공격 / 피격]

    //항상 카메라가 바라보는 방향으로 Ray를 발사한다.
    *ShootRay() {
        Debug.Log("[ShootRay]");
        // 레이 세팅
        let ref = $ref<RaycastHit>();
        let layerMask = 1 << LayerMask.NameToLayer("Player");

        //부딫힌게 나 자신인지 체크해야함.
        while (true) {
            let ray: Ray = new Ray(
                ZepetoPlayers.instance.ZepetoCamera.camera.transform.position,
                ZepetoPlayers.instance.ZepetoCamera.camera.transform.forward);


            //OnEnter
            if (Physics.Raycast(ray, ref, this.playerValue["playerAttackDistance"], layerMask)) {
                let hitInfo = $unref(ref);

                //원래는 !=인데 테스트동안은 ==로 한다.
                if (hitInfo.collider.gameObject.GetComponent<SeaHareObject>()?.sessionID != this.sessionID) {
                    GameManager.instance.SetTestText(`Status::HIT::${hitInfo.collider.gameObject.GetComponent<SeaHareObject>()?.sessionID}`);
                    //이미 돌아가고있다면 중복호출X
                    if (this.AttackCoroutine == null) {
                        this.AttackID = `${hitInfo.collider.gameObject.GetComponent<SeaHareObject>()?.sessionID}`;
                        this.AttackCoroutine = this.StartCoroutine(this.Attack());
                    }
                }
            }
            //OnExit
            else if (this.AttackCoroutine != null) {
                Debug.Log("Attack::Escape");
                GameManager.instance.SetTestText("Status::NONE");
                this.AttackID = "";
                this.StopCoroutine(this.AttackCoroutine);
                this.AttackCoroutine = null;
            }
            yield new WaitForSeconds(0.05);
            Debug.DrawRay(ZepetoPlayers.instance.ZepetoCamera.camera.transform.position, ray.direction, Color.red);
        }

    }

    //공격
    *Attack() {
        for (let index = 0; index < this.playerValue["playerAttackTime"]; index++) {
            Debug.Log(index);
            yield new WaitForSeconds(1);
        }
        this.StopCoroutine(this.AttackCoroutine);
        this.AttackCoroutine = null;
        // 상대방 게임오버를 서버로 전달한다.
        MultiplayManager.instance.room.Send("Kill", `${this.AttackID}`);
        Debug.Log("Attack::KILL");
    }

    //게임오버
    public GameOver() {
        this.gameObject.SetActive(false);
    }

    //#endregion

    //#region [자기장 충돌 처리]
    OnTriggerEnter(coll: Collider) {
        if (coll.CompareTag("Dome")) {
            //처음 게임 진입시
            if (this.isGamePlaying == false) {
                GameManager.instance.SetTestText("GAME START");
                console.log("GAMESTART::");
                this.isGamePlaying = true;
            }
            //게임 진행중, 자기장 밖에서 안으로 들어올 때
            else {

            }
        }
    }
    OnTriggerExit(coll: Collider) {
        if (coll.CompareTag("Dome")) {
            console.log("StartCorutine");
            MultiplayManager.instance.room.Send("Kill", `${this.sessionID}`);
        }
    }
    //#endregion

}