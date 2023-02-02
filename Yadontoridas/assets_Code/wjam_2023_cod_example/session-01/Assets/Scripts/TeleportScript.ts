import { Collider, Debug, Quaternion, Transform, Vector3 } from 'UnityEngine'
import { ZepetoCharacter } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

//텔레포트(위치 리스폰) 함수 : "TeleportTriggerBox" 오브젝트에 삽입됨
export default class TeleportScript extends ZepetoScriptBehaviour {

    public SpawnPoint: Transform;

    Start() {    

    }

    //트리거 발동 시 실행하는 함수
    OnTriggerEnter(other: Collider) {
        //CODE: Use Debug.Log to log the name of game object that entered the trigger of the game object this TeleportScript is attached to
        //트리거 디버깅 로그 찍기
        console.log("Entered Trigger: teleport");

        //TIP:  This if block checks to see if game object that entered the trigger of the game object this TeleportScript is attached to has a ZepetoCharacter component attached to it
        //      Only a ZEPETO character would have a ZepetoCharacter component attached to it, so this would mean a ZEPETO character triggered the trigger
        //캐릭터 오브젝트 변수 선언 및 정의
        let character = other.gameObject.GetComponent<ZepetoCharacter>();

        //캐릭터 오브젝트 존재 시
        if(character != undefined){
        //if (other.gameObject.GetComponent<ZepetoCharacter>()){

            //CODE: Get the ZepetoCharacter component through the Collider name other that was pass into OnTriggerEnter
            //      Call the Teleport function that exist in the ZepetoCharacter class, and teleport to position 0 for x, 0 for y, and 0 for z

            //캐릭터를 특정 위치에 텔레포트 (정의된 Teleport() 함수 호출)
            //character.Teleport(new Vector3(0,0,0), Quaternion.identity);
            character.Teleport(this.SpawnPoint.position, Quaternion.identity);
        }
    }
}










































































//====================ANSWERS====================
//Debug.Log(other.gameObject.name + " entered trigger");
//other.gameObject.GetComponent<ZepetoCharacter>().Teleport(new Vector3(0,0,0), Quaternion.identity);