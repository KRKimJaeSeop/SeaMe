import { ZepetoScriptableObject, ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Physics, RaycastHit, Input, Camera, Debug, WaitForSeconds, HumanBodyBones, Vector3, Ray, LayerMask, Color, Quaternion, WaitUntil } from 'UnityEngine';
import { ZepetoCamera, ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Room } from 'ZEPETO.Multiplay';
import CharacterSettingScript from '../Table/CharacterSettingScript';
import MultiplayManager from '../../MultiplaySync/Common/MultiplayManager';
import { ZepetoWorldMultiplay } from 'ZEPETO.World';
import { StyleInt } from 'UnityEngine.UIElements';

export default class PlayerController extends ZepetoScriptBehaviour {

    @SerializeField()
    private playerValue: ZepetoScriptableObject<CharacterSettingScript>;
    private Start() {


        Debug.Log("[Start]");
        this.StartCoroutine(this.ShootRay());
        this.StartCoroutine(this.CoRoutine());
        Debug.LogWarning("ㅎㅇ0");

        // MultiplayManager.instance.multiplay.RoomCreated += (room: Room) => {
        //     room.AddMessageHandler("clientOnRoomCreated", (message:string) => {
        //         Debug.LogWarning("::RoomCreated");
        //         Debug.LogWarning(message);
        //     });
        // };
        MultiplayManager.instance.room.AddMessageHandler("ABCD", (message) => {
            Debug.Log("::RoomJoined");
            //Debug.LogWarning(message);
        });

    }
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

    private PlayerValueSetting() {

        ZepetoPlayers.instance.ZepetoCamera.camera.transform.GetComponent<Camera>().farClipPlane = this.playerValue["cameraDistance"];
        ZepetoPlayers.instance.characterData.jumpPower = this.playerValue["playerJumpPower"];
        ZepetoPlayers.instance.characterData.runSpeed = this.playerValue["playerMoveSpeed"];
    }

    *ShootRay() {
        Debug.Log("[ShootRay]");
        // 레이 세팅
        let ref = $ref<RaycastHit>();
        let layerMask = 1 << LayerMask.NameToLayer("test");
        while (true) {

            let ray: Ray = new Ray(
                ZepetoPlayers.instance.ZepetoCamera.camera.transform.position,
                ZepetoPlayers.instance.ZepetoCamera.camera.transform.forward);

            if (Physics.Raycast(ray, ref, this.playerValue["playerAttackDistance"], layerMask)) {
                let hitInfo = $unref(ref);
                //Debug.LogWarning(`Hit!${hitInfo.collider.gameObject.name}`);
                MultiplayManager.instance.room.Send("testonJoin", "충돌!");
               // MultiplayManager.instance.room.Send("testonCreate", "send");

            }

            Debug.DrawRay(
                ZepetoPlayers.instance.ZepetoCamera.camera.transform.position,
                ZepetoPlayers.instance.ZepetoCamera.camera.transform.forward,
                Color.red, 0.05);

            yield new WaitForSeconds(0.05);
        }


    }



}