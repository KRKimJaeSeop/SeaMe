import { Sandbox, SandboxOptions, SandboxPlayer } from "ZEPETO.Multiplay";
import { DataStorage } from "ZEPETO.Multiplay.DataStorage";
import { Player } from "ZEPETO.Multiplay.Schema";

export default class extends Sandbox {

    onCreate(options: SandboxOptions) {
        this.onMessage("onChangeState",(client,message)=>{
            const Player = this.state.players.get(client.sessionId);
            Player.state = message.state;
        })
    }

    async onJoin(client: SandboxPlayer) {
        console.log(`OnJoin : ${client.sessionId} , HashCode : ${client.hashCode} , userId: ${client.userId}`)

        const player = new Player();
        player.sessionId = client.sessionId;

      if (client.hashCode) {
        player.zepetoHash = client.hashCode;
      }
      if(client.userId){
        player.zepetoUserId = client.userId;
      }
      const storage : DataStorage = client.loadDataStorage();

      let visit_count = await storage.get("VisitCount") as number;
      if (visit_count ==null) {
        visit_count =0;
      }

      console.log(`[onJoin] ${client.sessionId}'s visiting count : ${visit_count}`);

      await storage.set(`VisitCount`,++visit_count);
      this.state.players.set(client.sessionId , player);
 
    }

    onLeave(client: SandboxPlayer, consented?: boolean) {
        
    }
}