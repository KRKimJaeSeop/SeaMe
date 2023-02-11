import { Debug, Light, Vector3 } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import PlayerSync from '../../MultiplaySync/Player/PlayerSync';
import PlayerController from './PlayerController';

export default class SeaHareObject extends ZepetoScriptBehaviour {

    public userID: string;
    public sessionID: string = "";

    @SerializeField()
    private Light: Light;

    Start() {
        this.SetOwnPlayer();
        this.OtherPlayer();
    }

    public SetOwnPlayer() {
        if (ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.isLocalPlayer) {

            //내 제페토 플레이어
            const _character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;
            const tempTransform = _character.character.Context.transform;

            //달팽이 트랜스폼 맞추기
            this.gameObject.transform.SetParent(tempTransform);
            this.transform.localPosition = Vector3.zero;
            //달팽이 ID 세팅
            this.userID = this.transform.parent.parent.GetComponent<PlayerController>().userID;
            this.sessionID = this.transform.parent.parent.GetComponent<PlayerController>().sessionID;
            this.transform.parent.parent.GetComponent<PlayerController>().isHaveSeaHare = true;
            //라이트 설정
            this.Light.gameObject.transform.SetParent(ZepetoPlayers.instance.ZepetoCamera.camera.transform);
            this.Light.gameObject.transform.localPosition = Vector3.zero;

        }
    }

    public OtherPlayer() {
        
        if (!ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.isLocalPlayer) {

        }
    }
}