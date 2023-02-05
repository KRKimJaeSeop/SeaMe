import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Physics, RaycastHit, Input, Camera, Debug, WaitForSeconds,Vector3, Ray, LayerMask, Color, Quaternion } from 'UnityEngine';
import { ZepetoCamera, ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';

export default class PlayerController extends ZepetoScriptBehaviour {

    private Start() {
        Debug.Log("[Start]");
        this.StartCoroutine(this.ShootRay());
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