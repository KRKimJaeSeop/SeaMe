import { Debug, Vector3, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class Dome extends ZepetoScriptBehaviour {

    Start() {
        Debug.LogWarning("시작");
        this.StartCoroutine(this.DomeScaleControll());
    }
    *DomeScaleControll() {
        Debug.LogWarning("코루틴");
        let domeScale = this.transform.localScale.x;
        while (true) {
            Debug.LogWarning(domeScale);
            this.transform.localScale = new Vector3(domeScale, domeScale, domeScale);
            domeScale -= 1;
            yield new WaitForSeconds(0.5);
        }
    }

}