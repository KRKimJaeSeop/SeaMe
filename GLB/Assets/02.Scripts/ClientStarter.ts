import { Room, RoomData } from "ZEPETO.Multiplay";
import { Player, State } from "ZEPETO.Multiplay.Schema";
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ZepetoWorldMultiplay } from 'ZEPETO.World';
import { CharacterState, SpawnInfo, ZepetoPlayer, ZepetoPlayers } from "ZEPETO.Character.Controller"
import * as UnityEngine from "UnityEngine";
import { Vector3, GameObject, Transform, WaitForSeconds } from 'UnityEngine';


export default class ClientStarter extends ZepetoScriptBehaviour {

    public multiPlay: ZepetoWorldMultiplay;
    private room: Room;
    private customCharacter : UnityEngine.GameObject
<<<<<<< HEAD

    @SerializeField()
    private customCharacter: UnityEngine.GameObject

    // @SerializeField()
    // private testParent: UnityEngine.GameObject

    private currentPlayers: Map<string, Player> = new Map<string, Player>();
<<<<<<< HEAD
=======
    
>>>>>>> 88c341d77f6cde41797ab71b40fb4f3fad8697ec
=======

    private currentPlayers: Map<string, Player> = new Map<string, Player>();
    
>>>>>>> origin/main


    Start() {
        this.multiPlay.RoomCreated += (room: Room) => {
            this.room = room;
        }

        this.multiPlay.RoomJoined += (room: Room) => {
            room.OnStateChange += this.OnStateChange;
<<<<<<< HEAD
<<<<<<< HEAD

=======
            
>>>>>>> 88c341d77f6cde41797ab71b40fb4f3fad8697ec
=======
            
>>>>>>> origin/main
        }
        this.StartCoroutine(this.TestRoutine());
    }

    private OnStateChange(state: State, isFirst: boolean) {

        if (isFirst) {
            ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
                const myPlayer = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;
                myPlayer.character.OnChangedState.AddListener((cur, pev) => {
                    this.SendState(cur);
                });
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
<<<<<<< HEAD
<<<<<<< HEAD

        //UnityEngine.GameObject.Instantiate(this.customCharacter);



=======
      
>>>>>>> 88c341d77f6cde41797ab71b40fb4f3fad8697ec
=======
      
>>>>>>> origin/main
    }

    *TestRoutine() {

        yield new WaitForSeconds(3);

        // 로컬 캐릭터
        let _character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;

        // 본 위치
        let tempTransform = _character.character.ZepetoAnimator.GetBoneTransform(UnityEngine.HumanBodyBones.Head);
        let tempVector = new Vector3(tempTransform.position.x, tempTransform.position.y, tempTransform.position.z);

        // Instantiate한 프리팹
        let _gameObject = UnityEngine.GameObject.Instantiate(this.customCharacter,tempTransform)as GameObject ;

        _gameObject.transform.SetParent(tempTransform);
        //    tempGO.gameObject.transform.position = tempTransform);


        //console.log(`[OnJoinPlayer] parentPosition :: ${this.testParent.transform}`)
        //console.log(`[OnJoinPlayer] GO Name :: ${tempGO}`)

    }
}