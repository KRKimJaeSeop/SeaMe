import { getAllJSDocTags } from "typescript";
import { Sandbox, SandboxOptions, SandboxPlayer } from "ZEPETO.Multiplay";
import { DataStorage } from "ZEPETO.Multiplay.DataStorage";
import { Player } from "ZEPETO.Multiplay.Schema";

export default class extends Sandbox {

  // Room이 생성될 때 1회 호출한다.
  onCreate(options: SandboxOptions) {
    this.onMessage("onChangeState", (client, message) => {
      const Player = this.state.players.get(client.sessionId);
      Player.state = message.state;
    })
  }

  // Client가 Room에 입장할 때 호출된다. Client의 ID 및 캐릭터 정보는 SandboxPlayer 객체에 포함되어있다.
  async onJoin(client: SandboxPlayer) {
    console.log(`OnJoin : ${client.sessionId} , HashCode : ${client.hashCode} , userId: ${client.userId}`)

    const player = new Player();
    player.sessionId = client.sessionId;

    if (client.hashCode) {
      player.zepetoHash = client.hashCode;
    }
    if (client.userId) {
      player.zepetoUserId = client.userId;
    }
    // Client의 데이터
    const storage: DataStorage = client.loadDataStorage();

    let visit_count = await storage.get("VisitCount") as number;
    if (visit_count == null) {
      visit_count = 0;
    }

    console.log(`[onJoin] ${client.sessionId}'s visiting count : ${visit_count}`);
    await storage.set(`VisitCount`, ++visit_count);
    this.state.players.set(client.sessionId, player);

  }
  // Client가 Room에서 퇴장할 때 호출된다. 
  //연결 해제를 요청한 경우  Consented가 true.
  onLeave(client: SandboxPlayer, consented?: boolean) {

  }
  // SandboxOptions 에서 설정된 tickInterval마다 호출(update문임). 여기서 시간 체크
      OnTick(deltaTIme: number) {

  }
}