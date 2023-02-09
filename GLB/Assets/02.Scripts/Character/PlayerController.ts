import { ZepetoScriptableObject, ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Physics, RaycastHit, Input, Camera, Debug, WaitForSeconds, Coroutine, HumanBodyBones, Vector3, Ray, LayerMask, Color, Quaternion, WaitUntil, Collider, Resources, GameObject } from 'UnityEngine';
import { ZepetoCamera, ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Room } from 'ZEPETO.Multiplay';
import CharacterSettingScript from '../Table/CharacterSettingScript';
import MultiplayManager from '../../MultiplaySync/Common/MultiplayManager';
import { ZepetoWorldHelper, ZepetoWorldMultiplay } from 'ZEPETO.World';
import { StyleInt } from 'UnityEngine.UIElements';
import GameManager from '../Game/GameManager';
import PlayerSync from '../../MultiplaySync/Player/PlayerSync';
import SeaHareObject from './SeaHareObject';

export default class PlayerController extends ZepetoScriptBehaviour {

    public playerValue: ZepetoScriptableObject<CharacterSettingScript>;

    public userID: string;
    public sessionID: string = "";

    private PlayerObject: GameObject;
    private AttackCoroutine: Coroutine = null;



    public SetCharacter() {

        if (!this.transform.GetComponent<PlayerSync>()?.isLocal) {
            Debug.Log("if문 진입");
            return;
        }
        this.AddMessageHandler();
        Debug.Log("if문 통과");


        this.StartCoroutine(this.ShootRay());



        this.PlayerValueSetting();
        MultiplayManager.instance.Instantiate("TempPlayer", this.sessionID, Vector3.zero, Quaternion.identity);

    }

    private AddMessageHandler() {
        //게임 시작시 플레이어 세팅 수신

        // 게임 오버 수신
        MultiplayManager.instance.room.AddMessageHandler("GameOver", (message) => {
            Debug.Log(message);
            //this.GameOver();
        });

        // 게임 오버 수신
        MultiplayManager.instance.room.AddMessageHandler("Instantiate", (message: string) => {

            
            //let object = message 
            Debug.Log("여기임");
            Debug.Log(message);
        });

    }

    //게임 입장시 플레이어의 수치를 조정한다.
    private PlayerValueSetting() {
        ZepetoPlayers.instance.ZepetoCamera.camera.transform.GetComponent<Camera>().farClipPlane = this.playerValue["cameraDistance"];
        ZepetoPlayers.instance.characterData.jumpPower = this.playerValue["playerJumpPower"];
        ZepetoPlayers.instance.characterData.runSpeed = this.playerValue["playerMoveSpeed"];
    }

    //항상 카메라가 바라보는 방향으로 Ray를 발사한다.
    *ShootRay() {
        Debug.Log("[ShootRay]");
        // 레이 세팅
        let ref = $ref<RaycastHit>();
        let layerMask = 1 << LayerMask.NameToLayer("Player");

        //부딫힌게 나 자신인지 체크해야함.
        while (true) {
            let ray: Ray = new Ray(
                ZepetoPlayers.instance.ZepetoCamera.camera.transform.position,
                ZepetoPlayers.instance.ZepetoCamera.camera.transform.forward);


            //OnEnter
            if (Physics.Raycast(ray, ref, this.playerValue["playerAttackDistance"], layerMask)) {
                let hitInfo = $unref(ref);

                if (hitInfo.collider.gameObject.GetComponent<SeaHareObject>()?.sessionID != this.sessionID) {
                    GameManager.instance.SetTestText(`HIT::${hitInfo.collider.gameObject.GetComponent<SeaHareObject>()?.sessionID} \n ${this.sessionID}`);
                    //이미 돌아가고있다면 중복호출X
                    if (this.AttackCoroutine == null) {
                        this.AttackCoroutine = this.StartCoroutine(this.Attack());
                    }
                }
            }
            //OnExit
            else if (this.AttackCoroutine != null) {
                Debug.Log("Attack::Escape");
                GameManager.instance.SetTestText("HIT::Nothing");
                this.StopCoroutine(this.AttackCoroutine);
                this.AttackCoroutine = null;
            }
            yield new WaitForSeconds(0.05);
            Debug.DrawRay(ZepetoPlayers.instance.ZepetoCamera.camera.transform.position, ray.direction, Color.red);
        }

    }

    //공격
    *Attack() {
        for (let index = 0; index < this.playerValue["playerAttackTime"]; index++) {
            Debug.Log(index);
            yield new WaitForSeconds(1);
        }
        this.StopCoroutine(this.AttackCoroutine);
        this.AttackCoroutine = null;
        // 상대방 게임오버를 서버로 전달한다.
        MultiplayManager.instance.room.Send("Kill", "충돌!");
        Debug.Log("Attack::KILL");
    }

    //게임오버
    public GameOver() {
        this.gameObject.SetActive(false);
    }


}