import { Quaternion, Random, Space, Time, Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

//오브젝트를 일정하게 움직이는 함수 (코인 회전 시 사용) : "Coin" 프리팹에 삽입됨
export default class SpinScript extends ZepetoScriptBehaviour {

    //CODE: Declare 3 public variables named xSpeed, ySpeed, and zSpeed or type number whose values can be set in the inspector
    //      In the Inspector, set the values for xSpeed, ySpeed, and zSpeed to some values

    public xSpeed:number;
    public ySpeed:number;
    public zSpeed:number;

    public value: number = 1;   //속도 조절 변수

    Start() {    
        //console.log("Start!");    //콘솔에 로그 찍기 (간단한 디버깅용)
    }

    Update() {
    //Code: Access the Transform component that exist on the game object that this SpinScript is attached to
    //      Call the Rotate function that exist in the Transform class to rotate the game object
    //      Note that the Rotate function takes a Vector3 as its first parameter
    //      Pass in xSpeed, ySpeed, zSpeed variables to create your Vector3

        //console.log("Update!");

        //let speed: number = 0;

        //회전: 시간변화에 따른 일정한 회전
        this.transform.Rotate(new Vector3(this.xSpeed, this.ySpeed, this.zSpeed * Time.deltaTime));
        //this.transform.Rotate(new Vector3(this.xSpeed, this.ySpeed, this.zSpeed * Time.deltaTime), Space.Self);

        //이동: 시간변화에 따른 일정한 움직임
        //1) 직선운동
        //2) 곡선운동 (sinewave)
        this.transform.Translate(new Vector3(0, this.value * Time.deltaTime, 0));
        //this.transform.Translate(new Vector3(0, this.value + Math.sin(Time.deltaTime), this.value * Time.deltaTime));
    }
}












































































//====================ANSWERS====================
//public xSpeed:number;
//public ySpeed:number;
//public zSpeed:number;
//this.transform.Rotate(new Vector3(this.xSpeed, this.ySpeed, this.zSpeed) * Time.deltaTime, Space.Self);