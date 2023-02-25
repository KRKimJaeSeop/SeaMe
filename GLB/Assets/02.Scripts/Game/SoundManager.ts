import { AudioClip, AudioSource, Debug } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class SoundManager extends ZepetoScriptBehaviour {

    @SerializeField()
    private BGM: AudioSource;

    @SerializeField()
    private WalkSFX: AudioSource;
    @SerializeField()
    private JumpSFX: AudioSource;
    @SerializeField()
    private CharacterSFX: AudioSource;
    @SerializeField()
    private UISFX: AudioSource;
    @SerializeField()
    private EtcSFX: AudioSource;

    @Header("BGM")
    @SerializeField()
    @Tooltip("1구역2구역 BGM")
    private ClipArea_1_2: AudioClip;
    @SerializeField()
    @Tooltip("3구역 BGM")
    private ClipArea_3: AudioClip;
    @SerializeField()
    @Tooltip("대기실 BGM")
    private ClipArea_WaitRoom: AudioClip;

    @Header("SFX")
    @Header("Character")
    @SerializeField()
    @Tooltip("걸을때 소리")
    private ClipStep: AudioClip;
    @SerializeField()
    @Tooltip("점프")
    private ClipJump: AudioClip;
    @SerializeField()
    @Tooltip("슈퍼점프")
    private ClipSuperJump: AudioClip;
    @SerializeField()
    @Tooltip("공표효과음")
    private ClipScary: AudioClip;
    @SerializeField()
    @Tooltip("피해입음1")
    private ClipDamaged1: AudioClip;
    @SerializeField()
    @Tooltip("피해입음2")
    private ClipDamaged2: AudioClip;
    @SerializeField()
    @Tooltip("사망")
    private ClipDie: AudioClip;

    @Header("UI or Game")
    @SerializeField()
    @Tooltip("대기실에 소환시")
    private ClipWaitroom_Spawn: AudioClip;
    @SerializeField()
    @Tooltip("카운트다운")
    private ClipWaitroom_Count: AudioClip;
    @SerializeField()
    @Tooltip("전투맵에 스폰시")
    private ClipTpToMap: AudioClip;
    @SerializeField()
    @Tooltip("자기장이 가까워집니다")
    private ClipDomeComing: AudioClip;
    @SerializeField()
    @Tooltip("문어 공격")
    private ClipOctoAttack: AudioClip;


    //#region Name For Switch 
    @HideInInspector()
    public AREA_1_2: string = "AREA_1_2"
    @HideInInspector()
    public AREA_3: string = "AREA_3"
    @HideInInspector()
    public AREA_WAITROOM: string = "AREA_WaitRoom"

    @HideInInspector()
    public WAITROOM_SPAWN: string = "WAITROOM_SPAWN"
    @HideInInspector()
    public WAITROOM_COUNT: string = "WAITROOM_COUNT"
    @HideInInspector()
    public WAITROOM_GOMAP: string = "WAITROOM_GOMAP"

    @HideInInspector()
    public CHAR_DAMAGED: string = "CHAR_DAMAGED"
    @HideInInspector()
    public CHAR_STEP: string = "CHAR_STEP"
    @HideInInspector()
    public CHAR_JUMP: string = "CHAR_JUMP"
    @HideInInspector()
    public CHAR_DIE: string = "CHAR_DIE"
    @HideInInspector()
    public CHAR_SUPERJUMP: string = "CHAR_SUPERJUMP"
    @HideInInspector()
    public CHAR_SCARY: string = "CHAR_SCARY"
    @HideInInspector()
    public MAP_DOME: string = "MAP_DOME"
    @HideInInspector()
    public MAP_OCTO: string = "MAP_OCTO"
    @HideInInspector()
    public UI_NOTI: string = "UI_NOTI"
    //#endregion


    public PlayBGM(name: string) {

        switch (name) {
            case this.AREA_1_2:
                this.BGM.clip = this.ClipArea_1_2;
                break;

            case this.AREA_3:
                this.BGM.clip = this.ClipArea_3;
                break;

            case this.AREA_WAITROOM:
                this.BGM.clip = this.ClipArea_WaitRoom;
                break;

            default:
                break;
        }
        this.BGM.Play();
    }

    //효과음 리스트 
    public PlayOneShotSFX(name: string) {

        switch (name) {
            case this.CHAR_STEP:
                this.WalkSFX.PlayOneShot(this.ClipStep);
                break;

            case this.CHAR_JUMP:
                this.JumpSFX.PlayOneShot(this.ClipJump);
                break;

            case this.CHAR_SUPERJUMP:
                this.JumpSFX.PlayOneShot(this.ClipSuperJump);
                break;

            case this.CHAR_SCARY:
                this.JumpSFX.PlayOneShot(this.ClipScary);
                break;

            case this.CHAR_DAMAGED:
                this.JumpSFX.PlayOneShot(this.ClipDamaged1);
                this.JumpSFX.PlayOneShot(this.ClipDamaged2);
                break;

            case this.CHAR_DIE:
                this.JumpSFX.PlayOneShot(this.ClipDie);
                break;

            //======================================================
            case this.WAITROOM_SPAWN:
                this.JumpSFX.PlayOneShot(this.ClipWaitroom_Spawn);
                break;

            case this.WAITROOM_COUNT:
                this.JumpSFX.PlayOneShot(this.ClipWaitroom_Count);
                break;

            case this.MAP_DOME:
                this.JumpSFX.PlayOneShot(this.ClipDomeComing);
                break;

            case this.MAP_OCTO:
                this.JumpSFX.PlayOneShot(this.ClipOctoAttack);
                break;

            case this.UI_NOTI:
                this.JumpSFX.PlayOneShot(this.ClipWaitroom_Count);
                break;

            case this.WAITROOM_GOMAP:
                this.JumpSFX.PlayOneShot(this.ClipTpToMap);
                break;

            default:
                Debug.LogError(`${name}는 없는 오디오 소스`);
                break;
        }
    }

}