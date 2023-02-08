import { ZepetoScriptableObject, ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Physics, RaycastHit, Input, Camera, Debug, WaitForSeconds, Coroutine, HumanBodyBones, Vector3, Ray, LayerMask, Color, Quaternion, WaitUntil, Collider, Resources, GameObject } from 'UnityEngine';
import { ZepetoCamera, ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Room } from 'ZEPETO.Multiplay';
import CharacterSettingScript from '../Table/CharacterSettingScript';
import MultiplayManager from '../../MultiplaySync/Common/MultiplayManager';
import { ZepetoWorldHelper, ZepetoWorldMultiplay } from 'ZEPETO.World';
import { StyleInt } from 'UnityEngine.UIElements';
import GameManager from '../Game/GameManager';

export default class PlayerController extends ZepetoScriptBehaviour {

    public playerValue: ZepetoScriptableObject<CharacterSettingScript>;

    public userID: string;
    public sessionID: string = "";

    private PlayerObject: GameObject;
    private AttackCoroutine: Coroutine = null;

  

    public SetCharacter(){

        this.StartCoroutine(this.ShootRay());

        this.AddMessageHandler();

        //let _character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;

        // 본 위치
        //let tempTransform = _character.character.Context.transform;

       // this.PlayerObject = GameObject.Instantiate(Resources.Load("TempPlayer"), tempTransform) as GameObject;
        //this.gameObject.transform.SetParent(tempTransform);
        // this.PlayerObject.transform.localPosition = Vector3.zero;

        // 캐릭터 off
       // _character.character.ZepetoAnimator.GetBoneTransform(HumanBodyBones.Hips).gameObject.SetActive(false);
        // _character.character.Context.transform.GetChild(0).gameObject.SetActive(false);

        this.PlayerValueSetting();

    }

    private AddMessageHandler() {
        //게임 시작시 플레이어 세팅 수신

        // 게임 오버 수신
        MultiplayManager.instance.room.AddMessageHandler("GameOver", (message) => {
            Debug.Log(message);
            //this.GameOver();
        });

    }

    //게임 입장시 플레이어의 수치를 조정한다.
    private PlayerValueSetting() {
        ZepetoPlayers.instance.ZepetoCamera.camera.transform.GetComponent<Camera>().farClipPlane = this.playerValue["cameraDistance"];
        ZepetoPlayers.instance.characterData.jumpPower = this.playerValue["playerJumpPower"];
        ZepetoPlayers.instance.characterData.runSpeed = this.playerValue["playerMoveSpeed"];
    }

    //항상 카메라가 바라보는 방향으로 Ray를 발사한다.
    *ShootRay() {
        Debug.Log("[ShootRay]");
        // 레이 세팅
        let ref = $ref<RaycastHit>();
        let layerMask = 1 << LayerMask.NameToLayer("Player");

        //부딫힌게 나 자신인지 체크해야함.
        while (true) {
            // let ray: Ray = new Ray(
            //     //ZepetoPlayers.instance.ZepetoCamera.camera.transform.position,
            //     this.transform.position,
            //     ZepetoPlayers.instance.ZepetoCamera.camera.transform.forward);
            let ray: Ray = new Ray(
                this.gameObject.transform.position,
                this.gameObject.transform.forward);

            //OnEnter
            if (Physics.Raycast(ray, ref, this.playerValue["playerAttackDistance"], layerMask)) {
                let hitInfo = $unref(ref);
                Debug.Log(hitInfo.collider.gameObject.GetComponent<PlayerController>().sessionID);
                if (hitInfo.collider.gameObject.GetComponent<PlayerController>().sessionID != this.sessionID) {

                    //이미 돌아가고있다면 중복호출X
                    if (this.AttackCoroutine == null) {
                        this.AttackCoroutine = this.StartCoroutine(this.Attack());
                    }
                }
            }
            //OnExit
            else if (this.AttackCoroutine != null) {
                Debug.Log("Attack::Escape");
                this.StopCoroutine(this.AttackCoroutine);
                this.AttackCoroutine = null;
            }
            yield new WaitForSeconds(0.05);
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
        MultiplayManager.instance.room.Send("Kill", "충돌!");
        Debug.Log("Attack::KILL");
    }

    //게임오버
    public GameOver() {
        this.gameObject.SetActive(false);
    }


}