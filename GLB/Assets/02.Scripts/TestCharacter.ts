import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { SpawnInfo, ZepetoPlayers, LocalPlayer } from 'ZEPETO.Character.Controller';
import * as UnityEngine from "UnityEngine";
import { Vector3 } from 'ZEPETO.Multiplay.Schema';

export default class TestCharacter extends ZepetoScriptBehaviour {

   
    public TestObject: UnityEngine.GameObject;
    
    Start() {
        ZepetoPlayers.instance.CreatePlayerWithZepetoId("", "wowjq99", new SpawnInfo(), true);
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            let _player : LocalPlayer = ZepetoPlayers.instance.LocalPlayer;

        UnityEngine.Debug.Log("[START]:: LOG");

        let TestPlayer = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.ZepetoAnimator;
        let targetTransform = TestPlayer.GetBoneTransform(UnityEngine.HumanBodyBones.Chest);

        //UnityEngine.GameObject.Instantiate(this.TestObject,new Vector3(0,0,0));

        });
    }

    public Update(){
 
        UnityEngine.Debug.Log("[UPDATE]]");
    }
}