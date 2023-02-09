import { Room, RoomData } from "ZEPETO.Multiplay";
import { Player, State } from "ZEPETO.Multiplay.Schema";
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ZepetoWorldMultiplay } from 'ZEPETO.World';
import { CharacterState, SpawnInfo, ZepetoPlayer, ZepetoPlayers } from "ZEPETO.Character.Controller"
import * as UnityEngine from "UnityEngine";
import { Vector3, GameObject, Transform,Debug, WaitForSeconds } from 'UnityEngine';
import PlayerController from "../Character/PlayerController";


export default class ClientStarter extends ZepetoScriptBehaviour {

    public multiPlay: ZepetoWorldMultiplay;
    private room: Room;

    @SerializeField()
    private customCharacter: UnityEngine.GameObject

    private currentPlayers: Map<string, Player> = new Map<string, Player>();


    Start() {
        this.multiPlay.RoomCreated += (room: Room) => {
            this.room = room;
        }

        this.multiPlay.RoomJoined += (room: Room) => {
            room.OnStateChange += this.OnStateChange;
        }
    }

    private OnStateChange(state: State, isFirst: boolean) {

        if (isFirst) {
            ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
                const myPlayer = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;
                myPlayer.character.OnChangedState.AddListener((cur, pev) => {
                    this.SendState(cur);
                });
            });

            ZepetoPlayers.instance.OnAddedPlayer.AddListener((sessionId: string)=>{
                const isLocal = this.room.SessionId === sessionId;
              
                const nowJoinPlayer = ZepetoPlayers.instance.GetPlayer(sessionId).character;
                nowJoinPlayer.tag = "Player";
                nowJoinPlayer.name = sessionId;
            });
        }

        let join = new Map<string, Player>();
        state.players.ForEach((sessionId: string, player: Player) => {
            if (!this.currentPlayers.has(sessionId)) {
                join.set(sessionId, player);
            }

        });
        join.forEach((player: Player, sessionId: string) => this.OnJoinPlayer(sessionId, player));

    }

    private SendState(state: CharacterState) {
        const data = new RoomData();
        data.Add("state", state);
        this.room.Send("onChangedState", data.GetObject());
    }

    private OnJoinPlayer(sessionId: string, player: Player) {
        console.log(`[OnJoinPlayer] player - sessionId : ${sessionId}`)
        this.currentPlayers.set(sessionId, player);

        const spawnInfo = new SpawnInfo();
        const position = new UnityEngine.Vector3(0, 0, 0);
        const rotation = new UnityEngine.Vector3(0, 0, 0);



        spawnInfo.position = position;
        spawnInfo.rotation = UnityEngine.Quaternion.Euler(rotation);

        const isLocal = this.room.SessionId === player.sessionId;
        ZepetoPlayers.instance.CreatePlayerWithUserId(sessionId, player.zepetoUserId, spawnInfo, isLocal);
        const nowJoinPlayer = ZepetoPlayers.instance.GetPlayer(sessionId).character;
        nowJoinPlayer.gameObject.AddComponent<PlayerController>();
    }
}