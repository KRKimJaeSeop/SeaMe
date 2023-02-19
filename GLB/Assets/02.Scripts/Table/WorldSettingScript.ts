import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class WorldSettingScript {

    @Header("대기실 세팅")    
    @Tooltip("한 게임에 플레이어 수")
    public roomPlayerCapacity: number;
    @Tooltip("대기실에서 인원충족 후 게임시작 전 카운트다운")
    public countdownBeforeGameStart: number;


    @Header("게임 규칙 세팅") 
    @Tooltip("게임 시작 후 자기장 시작시간")
    public domeStartTime: number;
    @Tooltip("자기장 0.5초마다 이동하는 거리")
    public domeMoveSpeed: number;

    @Header("오브젝트 세팅")    
    @Tooltip("방해물 이동속도 ")
    public obstracleSpeed: number;

}