import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Physics, RaycastHit, Input, Camera, Debug, WaitForSeconds, Ray, LayerMask, Color } from 'UnityEngine';
import { Vector3 } from 'ZEPETO.Multiplay.Schema';

export default class PlayerController extends ZepetoScriptBehaviour {

    private Start() {
        Debug.Log("[Start]");
        this.StartCoroutine(this.ShootRay());
    }

    *ShootRay() {
        Debug.Log("[ShootRay]");
        //Ver 1
        // let ray: Ray = new Ray(
        //     this.transform.position, this.gameObject.transform.forward);

        // // :: 레이어 마스크
        // const layerMask = 20 << LayerMask.NameToLayer("test");

        // let ref = $ref<RaycastHit>();


        //ver 2
        
        let ref = $ref<RaycastHit>();

        let layerMask = 20 << LayerMask.NameToLayer("test");


        while (true) {
            Debug.Log("[while]");
            Debug.Log(LayerMask.NameToLayer("test"));
            let ray: Ray = new Ray(
                this.transform.position, this.gameObject.transform.forward);
            // if (Physics.Raycast(ray, ref, 100, layerMask)) {
            //     Debug.LogError("Hit!");
            //     let hitInfo = $unref(ref);
            //     Debug.Log(hitInfo);
            // }
            if (Physics.Raycast(ray, ref, 100)) {
                let hitInfo = $unref(ref);
                Debug.LogError(hitInfo.collider.gameObject.name);
            }

            Debug.DrawRay(
                this.transform.position, this.gameObject.transform.forward,
                Color.red, 0.1);

            yield new WaitForSeconds(0.1);
        }

    }



}
