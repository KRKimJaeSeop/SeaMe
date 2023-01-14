import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { SpawnInfo, ZepetoPlayers, LocalPlayer } from 'ZEPETO.Character.Controller';

export default class TestCharacter extends ZepetoScriptBehaviour {

    Start() {
        ZepetoPlayers.instance.CreatePlayerWithZepetoId("", "wowjq99", new SpawnInfo(), true);
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            let _player : LocalPlayer = ZepetoPlayers.instance.LocalPlayer;
        });
    }
}