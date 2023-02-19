import { Debug, Vector3, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour, ZepetoScriptableObject } from 'ZEPETO.Script'
import WorldSettingScript from '../Table/WorldSettingScript';
import GameManager from './GameManager';
export default class Dome extends ZepetoScriptBehaviour {

    //월드 세팅
    public worldSettings: ZepetoScriptableObject<WorldSettingScript>;

    private wfs: WaitForSeconds = new WaitForSeconds(0.5);


    *DomeScaleControll() {
        GameManager.instance.UI.MainNotification("게임 시작", 3);
        yield new WaitForSeconds(this.worldSettings["domeStartTime"] * 0.7);
        GameManager.instance.UI.MainNotification("자기장이 곧 줄어듭니다.", 3);
        yield new WaitForSeconds(this.worldSettings["domeStartTime"] * 0.3);

        GameManager.instance.UI.MainNotification("자기장이 줄어듭니다.", 5);

        let domeScale = this.transform.localScale.x;
        while (domeScale > 7) {
            this.transform.localScale = new Vector3(domeScale, domeScale, domeScale);
            domeScale -= this.worldSettings["domeMoveSpeed"];
            yield this.wfs;
        }
    }

}