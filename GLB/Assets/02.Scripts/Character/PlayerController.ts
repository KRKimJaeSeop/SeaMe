import { ZepetoScriptableObject, ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Physics, RaycastHit, Input, Camera, Debug, WaitForSeconds, Coroutine, HumanBodyBones, Vector3, Ray, LayerMask, Color, Quaternion, WaitUntil, Collider } from 'UnityEngine';
import { ZepetoCamera, ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Room } from 'ZEPETO.Multiplay';
import CharacterSettingScript from '../Table/CharacterSettingScript';
import MultiplayManager from '../../MultiplaySync/Common/MultiplayManager';
import { ZepetoWorldMultiplay } from 'ZEPETO.World';
import { StyleInt } from 'UnityEngine.UIElements';

export default class PlayerController extends ZepetoScriptBehaviour {

    // 스크립터블 오브젝트
    @SerializeField()
    private playerValue: ZepetoScriptableObject<CharacterSettingScript>;

    // 내가 공격중이라면 true
    public isAttacking: bool = false;
    public AttackCoroutine: Coroutine = null;
    public ownID: string;



    private Start() {
        this.StartCoroutine(this.ShootRay());
        this.StartCoroutine(this.CoRoutine());
        //  MultiplayManager.instance.room.Send("testonJoin", "충돌!");
        MultiplayManager.instance.room.AddMessageHandler("ABCD", (message) => {
            Debug.Log("::RoomJoined");
        });

    }

    // 룸입장 1초 후 캐릭터 변경.
    *CoRoutine() {
        yield new WaitForSeconds(1);
        // 로컬 캐릭터
        let _character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;

        // 본 위치
        let tempTransform = _character.character.Context.transform;// ZepetoAnimator.GetBoneTransform(UnityEngine.HumanBodyBones.);

        this.gameObject.transform.SetParent(tempTransform);
        this.gameObject.transform.localPosition = Vector3.zero;

        // 캐릭터 off
        _character.character.ZepetoAnimator.GetBoneTransform(HumanBodyBones.Hips).gameObject.SetActive(false);
        _character.character.Context.transform.GetChild(0).gameObject.SetActive(false);

        this.PlayerValueSetting();


    }

    //게임 입장시 플레이어의 수치를 조정한다.
    private PlayerValueSetting() {

        ZepetoPlayers.instance.ZepetoCamera.camera.transform.GetComponent<Camera>().farClipPlane = this.playerValue["cameraDistance"];
        ZepetoPlayers.instance.characterData.jumpPower = this.playerValue["playerJumpPower"];
        ZepetoPlayers.instance.characterData.runSpeed = this.playerValue["playerMoveSpeed"];
    }

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
                if (hitInfo.collider.gameObject.GetInstanceID() != this.gameObject.GetInstanceID()) {

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
    *Attack() {
        for (let index = 0; index < this.playerValue["playerAttackTime"]; index++) {
            Debug.Log(index);
            yield new WaitForSeconds(1);
        }
        this.StopCoroutine(this.AttackCoroutine);
        this.AttackCoroutine = null;
        Debug.Log("Attack::KILL");
    }


}