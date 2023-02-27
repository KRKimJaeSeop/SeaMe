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
    private BlackImage: GameObject;

    @SerializeField()
    private inkImage: Image;        //잉크이미지 추가

    @SerializeField()
    private gameWinImage: Image;    //최후 1인 게임클리어 이미지 추가
    @SerializeField()
    private gameLoseImage: Image;    //게임 패배 이미지 추가

    public MainBtn: Button;
    public SubBtn: Button;
    public SubBtn2: Button;

    public IntroImage: GameObject;
    public GuideImage: GameObject;

    private wfs1: WaitForSeconds = new WaitForSeconds(1);
    private wfs3: WaitForSeconds = new WaitForSeconds(3);
    private wfs03: WaitForSeconds = new WaitForSeconds(0.3);


    Awake() {

        this.uiMainNotification = this.MainNotiText.GetComponent<UIMainNotification>();
        this.MainNotiText.SetActive(false);
        this.uiSubNotification = this.SubNotiText.GetComponent<UISubNotification>();
        this.SubNotiText.SetActive(false);

        this.MainBtn.onClick.AddListener(() => {
            // GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.CHAR_STEP);
            MultiplayManager.instance.room.Send("Kill", `${ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.id}`);
        });
        this.SubBtn.onClick.AddListener(() => {
            GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.CHAR_DAMAGED_OBSTRACLE);

        });
        this.SubBtn2.onClick.AddListener(() => {
            //   GameManager.instance.Sound.PlayBGM(3);
        });
    }

    public SetIntroImage(state: bool) {
        this.IntroImage.SetActive(state);
    }

    public SetGuideImage(state: bool) {
        this.GuideImage.SetActive(state);
    }

    public SetBlackImage(state: bool) {
        this.BlackImage.SetActive(state);
    }

    public MainNotification(text: string, time: number = 0.5) {
        this.uiMainNotification.Show(text, time);
        GameManager.instance.Sound.PlayOneShotSFX(GameManager.instance.Sound.UI_NOTI);
    }

    public SubNotification(text: string, time: number = 0.5) {
        this.uiSubNotification.Show(text, time);
    }


    public ShotDamagedEffect() {
        this.StartCoroutine(this.DamagedRoutine());
    }

    private *DamagedRoutine() {

        this.damagedImage.color = new Color(1, 1, 1, 1);
        yield this.wfs03;
        this.damagedImage.color = new Color(1, 1, 1, 0);
    }


    //잉크
    public ShotInkEffect() {
        this.StartCoroutine(this.InkRoutine());
    }

    //잉크 코루틴
    private *InkRoutine() {
        this.inkImage.color = new Color(1, 1, 1, 1);
        yield this.wfs3;

        for (let alpha = 1; alpha >= 0; alpha -= 0.1) {
            yield this.wfs03;
            this.inkImage.color = new Color(1, 1, 1, alpha);
        }
    }

    //승리
    public GameWinEffect() {
        this.StartCoroutine(this.WinRoutine());
    }

    //승리 코루틴
    private *WinRoutine() {
        this.gameWinImage.gameObject.SetActive(true);
        yield this.wfs3;
        this.gameWinImage.gameObject.SetActive(false);
    }

    //패배
    public GameLoseEffect() {
        this.StartCoroutine(this.LoseRoutine());
    }

    //패배 코루틴
    private *LoseRoutine() {
        this.gameLoseImage.gameObject.SetActive(true);
        yield this.wfs3;
        this.gameLoseImage.gameObject.SetActive(false);

    }

}