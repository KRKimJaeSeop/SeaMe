import { Debug, Vector3, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class Dome extends ZepetoScriptBehaviour {

   
    *DomeScaleControll() {
        let domeScale = this.transform.localScale.x;
        while (domeScale>7) {
            this.transform.localScale = new Vector3(domeScale, domeScale, domeScale);
            domeScale -= 1;
            yield new WaitForSeconds(0.5);
        }
    }

}