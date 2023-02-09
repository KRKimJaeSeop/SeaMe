import { Debug, Vector3 } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import PlayerController from './PlayerController';

export default class SeaHareObject extends ZepetoScriptBehaviour {



    public userID: string;
    public sessionID: string = "";


    // 본 위치


    // this.PlayerObject = GameObject.Instantiate(Resources.Load("TempPlayer"), tempTransform) as GameObject;

    // this.PlayerObject.transform.localPosition = Vector3.zero;

    // 캐릭터 off
    // _character.character.ZepetoAnimator.GetBoneTransform(HumanBodyBones.Hips).gameObject.SetActive(false);
    // _character.character.Context.transform.GetChild(0).gameObject.SetActive(false);

    Start() {
        const _character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;
        const tempTransform = _character.character.Context.transform;
        this.gameObject.transform.SetParent(tempTransform);
        this.transform.localPosition = Vector3.zero;
        this.userID= this.transform.parent.parent.GetComponent<PlayerController>().userID;
        this.sessionID= this.transform.parent.parent.GetComponent<PlayerController>().sessionID;
        this.transform.parent.GetChild(0).gameObject.SetActive(false);
        this.transform.parent.GetChild(1).gameObject.SetActive(false);
    }

}