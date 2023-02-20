import { Vector3, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptableObject, ZepetoScriptBehaviour } from 'ZEPETO.Script'
import WorldSettingScript from '../Table/WorldSettingScript';

export default class ObstraclesController extends ZepetoScriptBehaviour {

   public worldSettings: ZepetoScriptableObject<WorldSettingScript>;

   Awake() {
      this.StartCoroutine(this.Move())
   }

   *Move() {

      let spinSpeed = new Vector3(0, this.worldSettings["obstracleSpeed"], 0);
      let verticalSpeed = this.worldSettings["obstracleSpeed"];
      let wfs = new WaitForSeconds(0.01);

      let currentPosition = this.transform.position.y;

      while (true) {
         this.transform.Rotate(spinSpeed);

         if (this.transform.position.y < currentPosition - 1)
            verticalSpeed *= -1;

         else if (this.transform.position.y > currentPosition + 1)
            verticalSpeed *= -1;

         this.transform.Translate(0, verticalSpeed * 0.1, 0);
         yield wfs;

      }
   }
}