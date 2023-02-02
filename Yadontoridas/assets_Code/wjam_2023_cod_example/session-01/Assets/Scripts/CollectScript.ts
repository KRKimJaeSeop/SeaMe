import { AudioSource, Collider, Debug, GameObject, Vector3 } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import SoundManager from './SoundManager';

// 트리거 설정된 콜라이더와 충돌 시 실행되는 함수 (코인 충돌 시 처리) : "Coin" 프리팹에 삽입됨
export default class CollectScript extends ZepetoScriptBehaviour {

    Start() {    

    }

    //트리거 발동 시 실행하는 함수
    OnTriggerEnter(other: Collider) {
        //CODE: Use Debug.Log to log "Collect Coin" to the console when another game object with a collider enters the trigger that is on this game object
        //트리거 디버깅 로그 찍기
        console.log("Collided: Collect Coin");

        //CODE: Call the PlayCoinCollectSoundInSoundManager function that's in this CollectScript class
        //이펙트 사운드 함수 호출
        this.PlayCoinCollectSoundInSoundManager();

        //CODE: Call the Destroy function inside the GameObject class to destroy the coin game object that this CollectScript is attached to
        //오브젝트 삭제
        GameObject.Destroy(this.gameObject);
    }

    //이펙트 사운드 함수 
    PlayCoinCollectSoundInSoundManager() {
        //CODE: Find game object named SoundManager using GameObject.Find,
        //      then get the SoundManager component that is on the SoundManager game object,
        //      and lastly call the PlayCoinCollectSound function that exist in the SoundManager class
        //사운드매니저의 코인컬렉트이펙트 사운드 호출
        GameObject.Find("SoundManager").GetComponent<SoundManager>().PlayCoinCollectSound();
    }

}










































































//====================ANSWERS====================
//Debug.Log("Collect Coin");
//this.PlayCoinCollectSoundInSoundManager();
//GameObject.Destroy(this.gameObject);
//GameObject.Find("SoundManager").GetComponent<SoundManager>().PlayCoinCollectSound();
