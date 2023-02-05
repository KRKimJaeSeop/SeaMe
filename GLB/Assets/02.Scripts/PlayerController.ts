import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Physics, RaycastHit, Input, Camera, Debug, WaitForSeconds, HumanBodyBones, Vector3, Ray, LayerMask, Color, Quaternion } from 'UnityEngine';
import { ZepetoCamera, ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Room } from 'ZEPETO.Multiplay';
import MultiplayManager from '../MultiplaySync/Common/MultiplayManager';

export default class PlayerController extends ZepetoScriptBehaviour {

    private Start() {

        if (ZepetoPlayers.instance.GetPlayer(MultiplayManager.instance.room.SessionId).isLocalPlayer) {

            Debug.Log("[Start]");
            this.StartCoroutine(this.ShootRay());
            // 로컬 캐릭터
            let _character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;

            // 본 위치
            let tempTransform = _character.character.Context.transform;// ZepetoAnimator.GetBoneTransform(UnityEngine.HumanBodyBones.);

            this.gameObject.transform.SetParent(tempTransform);
            this.gameObject.transform.localPosition = Vector3.zero;

            // 캐릭터 off
            _character.character.ZepetoAnimator.GetBoneTransform(HumanBodyBones.Hips).gameObject.SetActive(false);
            _character.character.Context.transform.GetChild(0).gameObject.SetActive(false);
        }
        // Instantiate한 프리팹       
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

            if (Physics.Raycast(ray, ref, 2, layerMask)) {
                let hitInfo = $unref(ref);
                Debug.LogWarning(`Hit!${hitInfo.collider.gameObject.name}`);
            }

            Debug.DrawRay(
                ZepetoPlayers.instance.ZepetoCamera.camera.transform.position,
                ZepetoPlayers.instance.ZepetoCamera.camera.transform.forward,
                Color.red, 0.05);

            yield new WaitForSeconds(0.05);
        }


    }



}