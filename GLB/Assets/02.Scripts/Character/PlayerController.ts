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

    private DamagedCount: number = 0;

    public isHaveSeaHare: bool = false;

    //#region [초기 세팅]


    public SetCharacter() {
        //일단 다 끄기
        this.transform.GetChild(0).GetChild(0).gameObject.SetActive(false);
        this.transform.GetChild(0).GetChild(1).gameObject.SetActive(false);


        //자기 자신일때
        if (this.transform.GetComponent<PlayerSync>()?.isLocal) {
            this.AddMessageHandler();
            this.PlayerValueSetting();
        }

        //게임오버인 플레이어 전체에게 게임오브젝트 해제
        MultiplayManager.instance.room.AddMessageHandler("GameOver", (message) => {
            Debug.Log(message);

            if (message == this.sessionID) {
                this.gameObject.SetActive(false);
            }
        });
    }

    *TestTele() {
        if (this.transform.GetComponent<PlayerSync>()?.isLocal) {
            const localCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
            localCharacter.Teleport(GameManager.instance.GetUserSpawnPosition(this.sessionID), Quaternion.identity);
        }

    }

    //[메세지 핸들러 등록]
    private AddMessageHandler() {
        // 게임 시작시 플레이어 세팅 수신
        MultiplayManager.instance.room.AddMessageHandler("tpToStadium", (message) => {
            this.StartCoroutine(this.TestTele());
        });

        // 피격시 이펙트
        MultiplayManager.instance.room.AddMessageHandler("Damaged", (message) => {
            Debug.Log(message);
            if (message == this.sessionID) {
                this.DamagedCount++;
                GameManager.instance.UI.SubNotification("아얏", 0.2);


                //   GameManager.instance.Damaged(this.DamagedCount/3);
            }
        });

        // 게임 오버시 관전모드 시작
        MultiplayManager.instance.room.AddMessageHandler("StartObserver", (message) => {
            Debug.Log(message);
            if (message == this.sessionID) {
                //  GameManager.instance.SetTestText("GameOver");
            }
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

        if (this.transform.GetComponent<PlayerSync>()?.isLocal) {

            //내 로컬에서 보이는 나 자신의 레이어만 끄기.
            Debug.Log("[ShootRay]");
            // 레이 세팅
            let ref = $ref<RaycastHit>();
            let layerMask = 1 << LayerMask.NameToLayer("Player");

            //계속 레이 발사
            while (true) {
                let ray: Ray = new Ray(
                    ZepetoPlayers.instance.ZepetoCamera.camera.transform.position,
                    ZepetoPlayers.instance.ZepetoCamera.camera.transform.forward);


                //OnEnter
                if (Physics.Raycast(ray, ref, this.playerValue["playerAttackDistance"], layerMask)) {
                    let hitInfo = $unref(ref);
                    let seaHare = hitInfo.collider.gameObject.GetComponent<SeaHareObject>();
                    //    GameManager.instance.SetTestText(`Status::HIT::${seaHare?.sessionID}`);

                    //이미 돌아가고있다면 중복호출X
                    if (this.AttackCoroutine == null) {
                        this.AttackID = `${seaHare?.sessionID}`;
                        this.AttackCoroutine = this.StartCoroutine(this.Attack(seaHare, seaHare?.sessionID));
                    }
                }
                //OnExit
                else if (this.AttackCoroutine != null) {
                    Debug.Log("Attack::Escape");
                    this.AttackID = "";
                    this.StopCoroutine(this.AttackCoroutine);
                    this.AttackCoroutine = null;
                }
                yield new WaitForSeconds(0.05);
                Debug.DrawRay(ZepetoPlayers.instance.ZepetoCamera.camera.transform.position, ray.direction, Color.red);
            }
        }
    }

    //공격
    *Attack(seaHare: SeaHareObject, id: string) {
        for (let index = 0; index < this.playerValue["playerAttackTime"]; index++) {
            Debug.Log(index);
            MultiplayManager.instance.room.Send("Hit", `${id}`);
            yield new WaitForSeconds(1);
        }
        this.StopCoroutine(this.AttackCoroutine);
        this.AttackCoroutine = null;
        // 상대방 게임오버를 서버로 전달한다.
        MultiplayManager.instance.room.Send("Kill", `${this.AttackID}`);
        Debug.Log("Attack::KILL");
    }



    //게임오버, 관전모드로 이동
    public GameOver() {
        this.gameObject.SetActive(false);
    }

    //#endregion

    //#region [충돌 처리]
    OnTriggerEnter(coll: Collider) {
        if (this.transform.GetComponent<PlayerSync>()?.isLocal) {

            // 자기장 진입시 레이 활성화
            if (coll.gameObject.CompareTag("Dome")) {
                this.StartCoroutine(this.ShootRay());
            }

            //장애물과 부딫히면 액션
            if (coll.gameObject.CompareTag("Obstracle")) {
                console.log("HIT!!!!");
            }
            if (coll.gameObject.CompareTag("JumpZone")) {
                ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.additionalJumpPower = 15;
                ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.Jump();
            }

        }
    }
    OnTriggerExit(coll: Collider) {
        //돔 나가면 게임오버
        if (this.transform.GetComponent<PlayerSync>()?.isLocal) {
            if (coll.gameObject.CompareTag("Dome")) {
                console.log("StartCorutine");
                MultiplayManager.instance.room.Send("Kill", `${this.sessionID}`);
            }

        }
        //점프존 벗어나면 점프파워 원상복구
        if (coll.gameObject.CompareTag("JumpZone")) {
            ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.additionalJumpPower = 0;
        }
    }
    //#endregion

}