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
import GameManager from './GameManager';
import { SceneManager } from 'UnityEngine.SceneManagement';
import { TimelineClipExtensions } from 'UnityEngine.Timeline';

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

    @SerializeField()
    private inkImage: Image;        //잉크이미지 추가

    @SerializeField()
    private gameWinImage: Image;    //최후 1인 게임클리어 이미지 추가

    testA: number = 0;
    testB: number = 0;
    public MainBtn: Button;
    @SerializeField()
    private MainBtnText: Text;
    public SubBtn: Button;
    public SubBtn2: Button;

    Awake() {
        this.uiMainNotification = this.MainNotiText.GetComponent<UIMainNotification>();
        this.MainNotiText.SetActive(false);
        this.uiSubNotification = this.SubNotiText.GetComponent<UISubNotification>();
        this.SubNotiText.SetActive(false);


        this.MainBtn.onClick.AddListener(() => {
            // let nummm = Math.floor(Math.random() * (5 - 0 + 1));
            const localCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.id;



            MultiplayManager.instance.room.Send("Kill", `${localCharacter}`);
            //GameManager.instance.RemoveSurvivorList("");
            //
            //   GameManager.instance.Sound.PlayBGM(1);
        });
        this.SubBtn.onClick.AddListener(() => {
            //  GameManager.instance.Sound.PlayBGM(2);

        });
        this.SubBtn2.onClick.AddListener(() => {
            //   GameManager.instance.Sound.PlayBGM(3);
        });

    }


    Update() {
        this.MainBtnText.text = `${GameManager.instance.SurvivorList.Length} /${GameManager.instance.UserList.Length} `;

    }


    public MainNotification(text: string, time: number = 0.5) {
        this.uiMainNotification.Show(text, time);
        GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.UI_NOTI);
    }

    public SubNotification(text: string, time: number = 0.5) {
        this.uiSubNotification.Show(text, time);
        GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.UI_NOTI);
    }

    public ShotDamagedEffect(time: number) {
        this.StartCoroutine(this.DamagedRoutine(time));
    }

    private *DamagedRoutine(time: number) {

        this.damagedImage.color = new Color(1, 1, 1, 1);
        yield new WaitForSeconds(0.3);
        this.damagedImage.color = new Color(1, 1, 1, 0);
    }

    //잉크
    public ShotInkEffect(time: number) {
        this.StartCoroutine(this.InkRoutine(time));
    }

    //잉크 코루틴
    private *InkRoutine(time: number) {
        this.inkImage.color = new Color(1, 1, 1, 1);
        yield new WaitForSeconds(time);

        for (let alpha = 1; alpha >= 0; alpha -= 0.1) {
            yield new WaitForSeconds(time / 10);
            this.inkImage.color = new Color(1, 1, 1, alpha);
        }
    }

    //승리
    public GameWinEffect(time: number) {
        this.StartCoroutine(this.WinRoutine(time));
    }

    //승리 코루틴
    private *WinRoutine(time: number) {
        this.gameWinImage.color = new Color(1, 1, 1, 1);
        yield new WaitForSeconds(time);
        this.gameWinImage.color = new Color(1, 1, 1, 0);
    }

}