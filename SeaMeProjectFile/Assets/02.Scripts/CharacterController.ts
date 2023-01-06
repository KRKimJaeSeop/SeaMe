import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { SpawnInfo, ZepetoPlayers, LocalPlayer, ZepetoCharacter } from 
'ZEPETO.Character.Controller'
import { GameObject,Object } from 'UnityEngine';
 
export default class CharacterController extends ZepetoScriptBehaviour {
 
 
    @SerializeField()
    private Test : GameObject;
 
    Start() {        
       ZepetoPlayers.instance.CreatePlayerWithZepetoId("", "[ZEPETO_ID]", new SpawnInfo(), 
true);
 
       ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
           let _player : LocalPlayer = ZepetoPlayers.instance.LocalPlayer;

       });
   }
}