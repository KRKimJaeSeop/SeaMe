import { AudioClip, AudioSource } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class SoundManager extends ZepetoScriptBehaviour {

    @SerializeField()
    private BGM: AudioSource;

    @SerializeField()
    private SFX: AudioSource;

    @Header("BGM")
    @SerializeField()
    @Tooltip("대기실 BGM")
    private BGM01: AudioClip;
    @SerializeField()
    @Tooltip("게임 시작 메인 BGM")
    private BGM02: AudioClip;
    @SerializeField()
    @Tooltip("마지막 긴박한 BGM")
    private BGM03: AudioClip;




    public PlayBGM(index: number) {

        if (this.BGM.isPlaying) {
            this.BGM.Stop();
        }
        if (index == 1) {
            this.BGM.clip = this.BGM01;
        }
        if (index == 2) {
            this.BGM.clip = this.BGM02;
        }
        if (index == 3) {
            this.BGM.clip = this.BGM03;
        }
        this.BGM.Play();
    }
    //효과음 리스트 

}