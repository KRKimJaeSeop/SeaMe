import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class WorldSettingScript {

    @Header("Game Rule Settings")    
    @Tooltip("자기장 이동속도 ")
    public deadLineMoveSpeed: number;

    @Header("Game Rule Settings")    
    @Tooltip("방해물 등장 비율 ")
    public obstructionAmount: number;

}