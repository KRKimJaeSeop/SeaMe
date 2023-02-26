import { ZepetoScriptableObject, ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Physics, RaycastHit, Input, Camera, Debug, WaitForSeconds, Coroutine, HumanBodyBones, Vector3, Ray, LayerMask, Color, Quaternion, WaitUntil, Collider, Resources, GameObject, CameraClearFlags, Color32, Material, Renderer } from 'UnityEngine';
import { CharacterJumpState, ZepetoCamera, ZepetoCharacter, ZepetoCharacterCreator, ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Room } from 'ZEPETO.Multiplay';
import CharacterSettingScript from '../Table/CharacterSettingScript';
import MultiplayManager from '../../MultiplaySync/Common/MultiplayManager';
import { ZepetoWorldHelper, ZepetoWorldMultiplay } from 'ZEPETO.World';
import { StyleInt } from 'UnityEngine.UIElements';
import GameManager from '../Game/GameManager';
import PlayerSync from '../../MultiplaySync/Player/PlayerSync';
import SeaHareObject from './SeaHareObject';
import { ZepetoChat } from 'ZEPETO.Chat';

export default class PlayerController extends ZepetoScriptBehaviour {

    public playerValue: ZepetoScriptableObject<CharacterSettingScript>;

    public userID: string;
    public sessionID: string = "";

    public AttackID: string = "";

    private PlayerObject: GameObject;
    private ShootCoroutine: Coroutine = null;
    private AttackCoroutine: Coroutine = null;
    private WalkCoroutine: Coroutine = null;

    private DamagedCount: number = 0;

    public isHaveSeaHare: bool = false;
    private isEnterOctopusZone: bool = false;

    private wfs005: WaitForSeconds = new WaitForSeconds(0.5);
    private wfs1: WaitForSeconds = new WaitForSeconds(1);
    private wfs03: WaitForSeconds = new WaitForSeconds(0.3);
    private wfs5: WaitForSeconds = new WaitForSeconds(5);

    private _ray: Ray;

    private sync: PlayerSync;
    //#region [초기 세팅]

    public SetCharacter() {
        GameManager.instance.Sound.PlayBGM(GameManager.instance.Sound.AREA_WAITROOM);
        GameManager.instance.UI.SetBlackImage(false);

        //일단 다 끄기
        this.transform.GetChild(0).GetChild(0).gameObject.SetActive(false);
        this.transform.GetChild(0).GetChild(1).gameObject.SetActive(false);



        this.sync = this.transform.GetComponent<PlayerSync>();
        //자기 자신일때
        if (this.sync?.isLocal) {
            this.AddMessageHandler();
            this.PlayerValueSetting();
        }

        //게임오버인 플레이어 전체에게 게임오브젝트 해제
        MultiplayManager.instance.room.AddMessageHandler("GameOver", (message: string) => {
            Debug.Log(message);
            GameManager.instance.RemoveSurvivorList(message);

            // let _winner = ZepetoPlayers.instance.GetPlayer(message).name;
            GameManager.instance.UI.SubNotification(`${message} someone bubbled away..`);//${_winner}
            GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.WAITROOM_SPAWN);
        });
    }

    *TestTele() {
        const localCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        localCharacter.Teleport(GameManager.instance.GetUserSpawnPosition(this.sessionID), Quaternion.identity);
    }

    *SetGuide() {
        GameManager.instance.UI.SetGuideImage(true);
        yield this.wfs5;
        GameManager.instance.UI.SetGuideImage(false);
    }

    //[메세지 핸들러 등록]
    private AddMessageHandler() {
        // 게임 시작시 플레이어 세팅 수신
        MultiplayManager.instance.room.AddMessageHandler("tpToStadium", (message) => {
            if (this.sync.isLocal) {
                this.StartCoroutine(this.TestTele());
                this.StartCoroutine(this.SetGuide());
                GameManager.instance.Sound.PlayBGM(GameManager.instance.Sound.AREA_1_2);
            }
        });

        // 피격시 이펙트
        MultiplayManager.instance.room.AddMessageHandler("Damaged", (message) => {
            Debug.Log(message);
            if (message == this.sessionID) {
                this.DamagedCount++;
                //GameManager.instance.UI.SubNotification("Ouch!", 0.2);       //아얏
                GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.CHAR_DAMAGED_OTHER);
                GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.CHAR_DAMAGED_OBSTRACLE);
                GameManager.instance.UI.ShotDamagedEffect();
            }
        });
        // 게임 오버시 대기실로 이동
        MultiplayManager.instance.room.AddMessageHandler("StartObserver", (message) => {
            if (message == this.sessionID) {
                Debug.Log(`Get StartObserver ::${message}`);
                GameManager.instance.UI.MainNotification("Game Over.. ", 100);       //게임오버..         
                const localCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
                localCharacter.Teleport(new Vector3(150, 11, 0), Quaternion.identity);
                GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.CHAR_DIE);
                Debug.Log(`브금틀기`);
                GameManager.instance.Sound.PlayBGM(GameManager.instance.Sound.AREA_WAITROOM);
                GameManager.instance.UI.SetBlackImage(false);
                ZepetoChat.SetActiveChatUI(true);

            }
        });

        // 최후의 1인 ID을 받는다.
        // 받은 ID가 내꺼라면, 전체에게 게임초기화 하라고 시킨다.
        MultiplayManager.instance.room.AddMessageHandler("WinnerID", (message) => {

            if (message == this.sessionID) {
                GameManager.instance.UI.MainNotification("Victory!", 3);
                GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.UI_WIN);
                GameManager.instance.UI.GameWinEffect();
            }
            else {
                GameManager.instance.UI.MainNotification("Game Over", 3);
                GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.UI_LOSE);

                GameManager.instance.UI.GameLoseEffect();

            }
            Debug.Log(`Send ReadyGameReset ::${message}`);
            MultiplayManager.instance.room.Send("ReadyGameReset", `0`);


        });

        // 게임 초기화
        MultiplayManager.instance.room.AddMessageHandler("GameReset", (message) => {
            Debug.Log(`Get GameReset ::${message}`);
            //최종적으로 게임매니저,게임 초기화.
            GameManager.instance.ResetGame();
        });

    }

    //게임 입장시 플레이어의 수치를 조정한다.
    private PlayerValueSetting() {
        ZepetoPlayers.instance.ZepetoCamera.camera.transform.GetComponent<Camera>().farClipPlane = this.playerValue["cameraDistance"];
        ZepetoPlayers.instance.ZepetoCamera.camera.transform.GetComponent<Camera>().clearFlags = CameraClearFlags.SolidColor;
        ZepetoPlayers.instance.ZepetoCamera.camera.transform.GetComponent<Camera>().backgroundColor = new Color(0, 0.01176471, 0.06666667, 1);
        ZepetoPlayers.instance.characterData.jumpPower = this.playerValue["playerJumpPower"];
        ZepetoPlayers.instance.characterData.runSpeed = this.playerValue["playerMoveSpeed"];
    }

    //#endregion

    //#region [레이 발사 /공격 / 피격]

    //항상 카메라가 바라보는 방향으로 Ray를 발사한다.
    *ShootRay() {

        if (this.sync?.isLocal) {

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
                    if (this.AttackCoroutine == null && seaHare != null) {

                        this.AttackID = `${seaHare?.sessionID}`;
                        this.AttackCoroutine = this.StartCoroutine(this.Attack(seaHare, seaHare?.sessionID));
                    }
                }
                //OnExit
                else if (this.AttackCoroutine != null) {
                    Debug.Log("Attack::Escape");
                    ZepetoPlayers.instance.GetPlayer(this.AttackID).character.gameObject.transform.GetChild(0).GetChild(4).GetChild(1).gameObject.
                        GetComponent<Renderer>().material.color = Color.white;

                    this.AttackID = "";
                    this.StopCoroutine(this.AttackCoroutine);
                    this.AttackCoroutine = null;
                }
                yield this.wfs005;
            }
        }
    }

    //공격
    *Attack(seaHare: SeaHareObject, id: string) {
        for (let index = 0; index < this.playerValue["playerAttackTime"]; index++) {
            seaHare.transform.GetChild(1).GetComponent<Renderer>().material.color = Color.red;
            GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.CHAR_DAMAGED_OTHER);
            MultiplayManager.instance.room.Send("Hit", `${id}`);
            yield this.wfs005;
            seaHare.transform.GetChild(1).GetComponent<Renderer>().material.color = Color.white;

            yield this.wfs005;
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

    //#region [충돌 처리] : 트리거 충돌 시 1회 호출
    OnTriggerEnter(coll: Collider) {
        if (this.sync?.isLocal) {

            // 자기장 진입시 레이 활성화
            if (coll.gameObject.CompareTag("Dome")) {
                this.ShootCoroutine = this.StartCoroutine(this.ShootRay());
                GameManager.instance.UI.SetBlackImage(true);
                GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.WAITROOM_GOMAP);
            }
            // 3구역 진입시
            if (coll.gameObject.CompareTag("Area3")) {
                console.log("HIT!!!!");
                GameManager.instance.Sound.PlayBGM(GameManager.instance.Sound.AREA_3);
            }
            //장애물과 부딫히면 액션
            if (coll.gameObject.CompareTag("Obstracle")) {
                console.log("HIT!!!!");
                this.StartCoroutine(this.OnTriggerObstracle());
                GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.CHAR_DAMAGED_OBSTRACLE);
            }
            //문어랑 닿으면 잉크뿌림
            if (coll.gameObject.CompareTag("Octopus")) {
                console.log("Ink HIT!!!!");
                this.isEnterOctopusZone = true;
                GameManager.instance.UI.ShotInkEffect();
                GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.MAP_OCTO);
                //this.StartCoroutine(this.OnTriggerOctopus(10));
            }
            //버블점프존 액션
            if (coll.gameObject.CompareTag("JumpZone")) {
                ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.additionalJumpPower = 15;
                ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.Jump();
                GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.CHAR_SUPERJUMP);
            }

        }
    }
    OnTriggerExit(coll: Collider) {
        if (this.sync?.isLocal) {
            //돔 나가면 게임오버
            if (coll.gameObject.CompareTag("Dome")) {
                console.log("StartCorutine");
                //  ZepetoPlayers.instance.ZepetoCamera.camera.transform.GetChild(0).gameObject.SetActive(false);
                this.StopCoroutine(this.ShootCoroutine);
                if (GameManager.instance.IsAbleDie()) {
                    MultiplayManager.instance.room.Send("Kill", `${this.sessionID}`);
                }
            }
            //문어존에 나가면 액션 중지
            if (coll.gameObject.CompareTag("Octopus")) {
                console.log("Get out of the Octopus Zone.");
                this.isEnterOctopusZone = false;
            }
        }

        //점프존 벗어나면 점프파워 원상복구
        if (coll.gameObject.CompareTag("JumpZone")) {
            ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.additionalJumpPower = 0;
        }
    }

    //장애물 충돌 시
    *OnTriggerObstracle() {

        ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.additionalRunSpeed = -3;

        for (let index = 0; index < 2; index++) {
            GameManager.instance.UI.ShotDamagedEffect();
            yield this.wfs1;

        }

        ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.additionalRunSpeed = 0;
    }


    Update() {

        if (!this.sync)
            return;
        if (ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.characterController.isGrounded) {
            if (ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.tryJump) {
                GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.CHAR_JUMP);
            }
        }
        if (ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.characterController.isGrounded) {
            if (ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.tryMove) {
                if (this.WalkCoroutine == null) {
                    this.WalkCoroutine = this.StartCoroutine(this.WalkStep());
                }
            }

        }
    }

    *WalkStep() {

        if (GameManager.instance.IsAbleDie()) {
            if (GameManager.instance.Sound.RandomNumber(0, 7000) < 1) {
                GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.CHAR_SCARY);
            }
        }
        GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.CHAR_STEP);
        yield this.wfs03;
        this.StopCoroutine(this.WalkCoroutine);
        this.WalkCoroutine = null;
    }


}