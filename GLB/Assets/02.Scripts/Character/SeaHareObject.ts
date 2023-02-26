import { Debug, Light, Quaternion, Vector3, WaitForSeconds } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import PlayerSync from '../../MultiplaySync/Player/PlayerSync';
import GameManager from '../Game/GameManager';
import PlayerController from './PlayerController';

export default class SeaHareObject extends ZepetoScriptBehaviour {

    public userID: string;
    public sessionID: string = "";

    @SerializeField()
    private Light: Light;

    Start() {
        this.SetOwnPlayer();
    }

    public SetOwnPlayer() {

        //달팽이 ID 세팅
        this.userID = this.transform.parent.parent.gameObject.GetComponent<PlayerController>().userID;
        this.sessionID = this.transform.parent.parent.gameObject.GetComponent<PlayerController>().sessionID;
        this.transform.parent.parent.gameObject.GetComponent<PlayerController>().isHaveSeaHare = true;

        if (this.transform.parent.parent.gameObject.GetComponent<PlayerSync>()?.isLocal) {

            //달팽이 트랜스폼 맞추기
            this.gameObject.transform.SetParent(this.transform.parent);
            this.transform.localPosition = Vector3.zero;
            this.transform.rotation = Quaternion.Euler(0, 0, 0);

            //라이트 설정
            this.Light.gameObject.transform.SetParent(ZepetoPlayers.instance.ZepetoCamera.camera.transform);
            this.Light.gameObject.transform.localPosition = new Vector3(0, 0, 1.5);
            this.Light.gameObject.SetActive(false);
            this.gameObject.layer = 0;

        }
    }



}