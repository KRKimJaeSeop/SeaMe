import { ZepetoPlayers, SpawnInfo, LocalPlayer } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { WorldService } from 'ZEPETO.World';

//월드에 캐릭터 호출하는 함수 (해시코드 기반) : "CharacterLoader" 오브젝트에 삽입됨
export default class CharacterLoader extends ZepetoScriptBehaviour {

    Start() {    
        //CODE: Call the CreatePlayerWithUserId function in the ZepetoPlayers class to load in your character avatar
        //TIP:  WorldService.userId will give the user id of the user logged into Unity or the user logged in on device
        ZepetoPlayers.instance.CreatePlayerWithUserId("", WorldService.userId, new SpawnInfo(), true);
        
        //파라미터1
        //세션ID, 비어있어도됨

        //파라미터2
        //해시코드ID, 유니크한값으로 중요

        //파라미터3
        //월드 입장 초기 스폰 위치 (position & rotation)
        //초기값 Vector3(0,0,0), Quaternion(0,0,0)

        //파라미터4
        //컨트롤 가능 여부
        //True: 로컬캐릭터 설정, 캐릭터를 플레이어로 설정 
        //False: NPC 설정, 다른 캐릭터를 불러올 때 False로 설정
    }
}
























































































//====================ANSWERS====================
//ZepetoPlayers.instance.CreatePlayerWithUserId("", WorldService.userId, new SpawnInfo(), true);