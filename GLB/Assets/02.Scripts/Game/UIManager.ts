import { ZepetoScriptableObject, ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { CharacterState, SpawnInfo, ZepetoPlayer, ZepetoPlayers } from "ZEPETO.Character.Controller"
import { Physics, GameObject, RaycastHit, Input, Camera, Debug, WaitForSeconds, Vector3, Ray, LayerMask, Color, Quaternion, HumanBodyBones, Resources, Transform, KeyCode } from 'UnityEngine';
import { RawImage, Text, Button, Image } from "UnityEngine.UI";
import { List$1 } from 'System.Collections.Generic';
import PlayerController from '../Character/PlayerController';
import Dome from '../Game/Dome';
import MultiplayManager from '../../MultiplaySync/Common/MultiplayManager';
import WorldSettingScript from '../Table/WorldSettingScript';
import { ZepetoChat, MessageType, UserMessage } from 'ZEPETO.Chat';
import SeaHareObject from '../Character/SeaHareObject';
import UIMainNotification from '../UI/UIMainNotification';
import UISubNotification from '../UI/UISubNotification';

export default class UIManager extends ZepetoScriptBehaviour {

    //전체공지 , 작은공지 나누기

    @SerializeField()
    private MainNotiText: GameObject;
    private uiMainNotification: UIMainNotification;


    @SerializeField()
    private SubNotiText: GameObject;
    private uiSubNotification: UISubNotification;

    @SerializeField()
    private damagedImage: Image;

    testA: number = 0;
    testB: number = 0;
    public MainBtn: Button;
    public SubBtn: Button;

    Awake() {
        this.uiMainNotification = this.MainNotiText.GetComponent<UIMainNotification>();
        this.MainNotiText.SetActive(false);
        this.uiSubNotification = this.SubNotiText.GetComponent<UISubNotification>();
        this.SubNotiText.SetActive(false);


        this.MainBtn.onClick.AddListener(() => {
            this.testA++;
            this.MainNotification(`${this.testA}`);
        });
        this.SubBtn.onClick.AddListener(() => {
            this.testB++;
            this.SubNotification(`${this.testB}`);
        });

    }


    public MainNotification(text: string, time: number = 0.5) {
        Debug.Log("위터치");
        this.uiMainNotification.Show(text, time);
    }

    public SubNotification(text: string, time: number = 0.5) {
        Debug.Log("아래터치");
        this.uiSubNotification.Show(text, time);
    }

    public *DamagedRoutine(value: number) {

        this.damagedImage.color = new Color(1, 1, 1, value);
        yield new WaitForSeconds(0.3);
        this.damagedImage.color = new Color(1, 1, 1, 0);

    }



}