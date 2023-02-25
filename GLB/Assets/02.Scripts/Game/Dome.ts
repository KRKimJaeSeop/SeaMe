import { Debug, Vector3, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour, ZepetoScriptableObject } from 'ZEPETO.Script'
import WorldSettingScript from '../Table/WorldSettingScript';
import GameManager from './GameManager';
export default class Dome extends ZepetoScriptBehaviour {

    //월드 세팅
    public worldSettings: ZepetoScriptableObject<WorldSettingScript>;

    private wfs: WaitForSeconds = new WaitForSeconds(0.5);

    private InitScale: Vector3

    Awake() {
        this.InitScale = this.transform.localScale;
    }

    *DomeScaleControll() {
        this.transform.localScale = this.InitScale;
        GameManager.instance.UI.MainNotification("Game Start", 3);                                  //게임 시작
        yield new WaitForSeconds(this.worldSettings["domeStartTime"] * 0.7);
        GameManager.instance.UI.MainNotification("The magnetic field will soon decrease.", 3);      //자기장이 곧 줄어듭니다.
        yield new WaitForSeconds(this.worldSettings["domeStartTime"] * 0.3);          

        GameManager.instance.UI.MainNotification("The magnetic field begins to decrease.", 5);            //자기장이 줄어듭니다.
        GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.MAP_DOME);

        let domeScale = this.transform.localScale.x;
        while (domeScale > 7) {
            this.transform.localScale = new Vector3(domeScale, domeScale, domeScale);
            domeScale -= this.worldSettings["domeMoveSpeed"];
            yield this.wfs;
        }
    }
    


}