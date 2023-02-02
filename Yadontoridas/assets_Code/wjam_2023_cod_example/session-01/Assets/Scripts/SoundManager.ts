import { AudioSource } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

//사운드매니저 함수 : "SoundManager" 오브젝트에 삽입됨
//모든 사운드 (BGM, effect...) 관리 예정
export default class SoundManager extends ZepetoScriptBehaviour {
    //CODE: Create a public variable called CollectCoinAudio of type AudioSource
    //      In the inspector, drag the Audio Source component on the SoundManager game object into the CollectCoinAudio field

    //오디오소스 타입 변수
    public collectCoinAudio: AudioSource;

    // Start() {    
    //     this.collectCoinAudio.Play();
    // }

    // Update(){
    //     this.collectCoinAudio.Play();
    // }

    //코인 충돌 시 출력할 사운드 함수
    public PlayCoinCollectSound() {
        //CODE: Call the Play function that exist in the AudioSource class to play your sound
        //오디오소스 플레이
        this.collectCoinAudio.Play();
    }
}




















































































//====================ANSWERS====================
//public CollectCoinAudio: AudioSource;
//this.CollectCoinAudio.Play();