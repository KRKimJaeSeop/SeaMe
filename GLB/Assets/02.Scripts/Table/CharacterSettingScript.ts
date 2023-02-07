import { Vector3, Quaternion } from 'UnityEngine';

export default class CharacterSettingScript {  

    @Header("Character Settings")
    @Tooltip("게임 진입 시 카메라 시야 최대 거리 ")
    public cameraDistance: number;
    @Tooltip("플레이어 이동속도 ")
    public playerMoveSpeed: number;      
    @Tooltip("플레이어 점프 높이 ")
    public playerJumpPower: number;      
    @Tooltip("플레이어 공격 사거리 ")
    public playerAttackDistance: number;      

 }