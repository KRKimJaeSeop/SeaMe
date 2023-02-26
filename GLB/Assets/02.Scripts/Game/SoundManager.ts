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
    private ScarySFX: AudioSource;
    @SerializeField()
    private WorldSFX: AudioSource;

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
    @Tooltip("공표효과음 리스트")
    private ClipScaryList: AudioClip[];
    @SerializeField()
    @Tooltip("장애물에게 피해입음 리스트")
    private ClipDamagedList: AudioClip[];

    @SerializeField()
    @Tooltip("사람에게 피해입음")
    private ClipDamagedByOther: AudioClip;

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

    @SerializeField()
    @Tooltip("게임결과 승리")
    private ClipResultWin: AudioClip;
    @SerializeField()
    @Tooltip("게임결과 패배")
    private ClipResultLose: AudioClip;

    //#region Name For Switch 
    @HideInInspector()
    public AREA_1_2: string = "AREA_1_2";
    @HideInInspector()
    public AREA_3: string = "AREA_3";
    @HideInInspector()
    public AREA_WAITROOM: string = "AREA_WaitRoom";

    @HideInInspector()
    public WAITROOM_SPAWN: string = "WAITROOM_SPAWN";
    @HideInInspector()
    public WAITROOM_COUNT: string = "WAITROOM_COUNT";
    @HideInInspector()
    public WAITROOM_GOMAP: string = "WAITROOM_GOMAP";

    @HideInInspector()
    public CHAR_DAMAGED_OBSTRACLE: string = "CHAR_DAMAGED_OBSTRACLE";
    @HideInInspector()
    public CHAR_DAMAGED_OTHER: string = "CHAR_DAMAGED_OTHER";
    @HideInInspector()
    public CHAR_STEP: string = "CHAR_STEP";
    @HideInInspector()
    public CHAR_JUMP: string = "CHAR_JUMP";
    @HideInInspector()
    public CHAR_DIE: string = "CHAR_DIE";
    @HideInInspector()
    public CHAR_SUPERJUMP: string = "CHAR_SUPERJUMP";
    @HideInInspector()
    public CHAR_SCARY: string = "CHAR_SCARY";
    @HideInInspector()
    public MAP_DOME: string = "MAP_DOME";
    @HideInInspector()
    public MAP_OCTO: string = "MAP_OCTO";
    @HideInInspector()
    public UI_NOTI: string = "UI_NOTI";

    @HideInInspector()
    public UI_WIN: string = "UI_WIN";
    @HideInInspector()
    public UI_LOSE: string = "UI_LOSE";
    //#endregion


    public PlayBGM(name: string) {

        switch (name) {
            case this.AREA_1_2:
                this.BGM.clip = this.ClipArea_1_2;
                this.BGM.volume = 1;
                break;

            case this.AREA_3:
                this.BGM.clip = this.ClipArea_3;
                this.BGM.volume = 0.7;
                break;

            case this.AREA_WAITROOM:
                this.BGM.clip = this.ClipArea_WaitRoom;
                this.BGM.volume = 0.6;
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
                this.WalkSFX.pitch = Math.random() + 1;
                this.WalkSFX.PlayOneShot(this.ClipStep, 1.6);
                break;

            case this.CHAR_JUMP:
                this.JumpSFX.PlayOneShot(this.ClipJump, 0.5);
                break;

            case this.CHAR_SUPERJUMP:
                this.JumpSFX.PlayOneShot(this.ClipSuperJump);
                break;

            case this.CHAR_SCARY:
                this.ScarySFX.PlayOneShot(this.ClipScaryList[this.RandomNumber(0, 3)]);
                break;

            case this.CHAR_DAMAGED_OTHER:
                this.WalkSFX.pitch = Math.random() + 1;
                this.CharacterSFX.PlayOneShot(this.ClipDamagedByOther);
                this.WalkSFX.pitch = 1;
                break;

            case this.CHAR_DAMAGED_OBSTRACLE:
                this.CharacterSFX.PlayOneShot(this.ClipDamagedList[this.RandomNumber(0, 1)]);
                break;

            case this.CHAR_DIE:
                this.CharacterSFX.PlayOneShot(this.ClipDie);
                break;

            //======================================================
            case this.WAITROOM_SPAWN:
                this.CharacterSFX.PlayOneShot(this.ClipWaitroom_Spawn);
                break;

            case this.WAITROOM_COUNT:
                this.UISFX.PlayOneShot(this.ClipWaitroom_Count);
                break;

            case this.MAP_DOME:
                this.WorldSFX.PlayOneShot(this.ClipDomeComing);
                break;

            case this.MAP_OCTO:
                this.WorldSFX.PlayOneShot(this.ClipOctoAttack);
                break;

            case this.UI_NOTI:
                this.UISFX.PlayOneShot(this.ClipWaitroom_Count);
                break;

            case this.WAITROOM_GOMAP:
                this.WorldSFX.PlayOneShot(this.ClipTpToMap);
                break;


            case this.UI_WIN:
                this.UISFX.PlayOneShot(this.ClipResultWin);
                break;

            case this.UI_LOSE:
                this.UISFX.PlayOneShot(this.ClipResultLose);
                break;

            default:
                Debug.LogError(`${name}는 없는 오디오 소스`);
                break;
        }
    }

    public RandomNumber(min: number, max: number): int {

        let randomNum = Math.floor(Math.random() * (max - min + 1));
        return randomNum;

    }



}