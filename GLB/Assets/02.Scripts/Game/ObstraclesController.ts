import { Vector3, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptableObject, ZepetoScriptBehaviour } from 'ZEPETO.Script'
import WorldSettingScript from '../Table/WorldSettingScript';

export default class ObstraclesController extends ZepetoScriptBehaviour {

   public worldSettings: ZepetoScriptableObject<WorldSettingScript>;

   Awake() {
      this.StartCoroutine(this.Move())
   }

   *Move() {

      let speed = new Vector3(0, this.worldSettings["obstracleSpeed"], 0);
      let wfs = new WaitForSeconds(0.01);
      let temp = 0;

      while (true) {
         // this.transform.Rotate(speed);
         if (temp > 0) {
            temp--;
            this.transform.Translate(this.transform.position.x,this.transform.position.y,this.transform.position.z)
         }
         else {
            temp++;
         }
         this.transform.position =



            yield wfs;

      }
   }
}