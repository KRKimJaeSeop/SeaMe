import { ZepetoScriptableObject, ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { CharacterState, SpawnInfo, ZepetoPlayer, ZepetoPlayers } from "ZEPETO.Character.Controller"
import { Physics, GameObject, RaycastHit, Input, Camera, Coroutine, Debug, WaitForSeconds, Vector3, Ray, LayerMask, Color, Quaternion, HumanBodyBones, Resources, Transform } from 'UnityEngine';
import { RawImage, Text, Image } from "UnityEngine.UI";
import { List$1 } from 'System.Collections.Generic';
import PlayerController from '../Character/PlayerController';
import Dome from '../Game/Dome';
import MultiplayManager from '../../MultiplaySync/Common/MultiplayManager';
import { ZepetoChat, MessageType, UserMessage } from 'ZEPETO.Chat';
import SeaHareObject from '../Character/SeaHareObject';

export default class UIMainNotification extends ZepetoScriptBehaviour {

    //표시할 텍스트
    @SerializeField()
    private contentText: Text
    //코루틴
    private doingCoRoutine: Coroutine = null;


    public Show(text: string, time: number) {

        if (this.doingCoRoutine == null) {
            this.gameObject.SetActive(true);
            this.doingCoRoutine = this.StartCoroutine(this.ShowCoroutine(text, time));
        }
        else {
            this.StopCoroutine(this.doingCoRoutine);
            this.doingCoRoutine = null;
            this.gameObject.SetActive(true);
            this.doingCoRoutine = this.StartCoroutine(this.ShowCoroutine(text, time));
        }
    }

    private * ShowCoroutine(text: string, time: number) {

        this.contentText.text = text;
        yield new WaitForSeconds(time);
        this.gameObject.SetActive(false);
        this.StopCoroutine(this.doingCoRoutine);
        this.doingCoRoutine = null;
    }

}