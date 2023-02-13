import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class WorldSettingScript {

    @Header("Game Rule Settings")    
    @Tooltip("자기장 이동속도 ")
    public deadLineMoveSpeed: number;

    @Tooltip("대기실에서 인원충족 후 게임시작 전 카운트다운")
    public countdownBeforeGameStart: number;

    @Tooltip("한 룸에 플레이어 수 ")
    public roomPlayerCapacity: number;



    @Header("Game Rule Settings")    
    @Tooltip("방해물 등장 비율 ")
    public obstructionAmount: number;

}