Shader "SeaMe/SeaMe_Water3_Shader"
{
    Properties     
    {
        [Header(_____Albedo_____)]
        _Color ("Color", Color) = (1,1,1,1)
        _MainTex ("Albedo Map", 2D) = "white" {}
        [Enum(UnityEngine.Rendering.CullMode)]_Cull("Cull Mode", Float) = 2

        [Space(10)]
        [Header(_____Normal_____)]
        [Normal] _NormalTex("Normal Map", 2D) = "normal" {}
        _NormalScale("Normal Scale", Range(0,5)) = 1.0

        [Space(10)]
        [Header(_____Wave_____)]
        _DistortionTex("Distortion Map", 2D) = "black" {}
        _WaveSpeed("Wave Speed", Range(0,1)) = 0.05
        _WavePower("Wave Power", Range(0,5)) = 0.2
        _WaveTilling("Wave Tilling", Range(0,50)) = 10
        [Toggle]_ActiveWaveX ("Active Wave Movement X-axis", Range(0, 1)) = 0
        [Toggle]_ActiveWaveY ("Active Wave Movement Y-axis", Range(0, 1)) = 0
    }

    SubShader
    {
        Tags { "RenderType"="Transparent" "Queue"="Transparent-2" }
        Cull [_Cull]
        LOD 200

        CGPROGRAM
        #pragma surface surf Standard vertex:vert alpha:blend
        #pragma target 3.0

        sampler2D _MainTex;
        sampler2D _NormalTex;
        sampler2D _DistortionTex;

        struct Input
        {
            float2 uv_MainTex;
            float2 uv_NormalTex;
            float2 uv_DistortionTex;
        };

        fixed4 _Color;
        fixed _NormalScale;

        float _WaveSpeed;
        float _WavePower;
        float _WaveTilling;
        bool _ActiveWaveX;
        bool _ActiveWaveY;

        void vert (inout appdata_full v)
        {
            if(_ActiveWaveX && _ActiveWaveY)
            {
                v.vertex.y += (sin(abs(v.texcoord.x*2-1)*_WaveTilling+_Time.y) + sin(abs(v.texcoord.y*2-1)*_WaveTilling+_Time.y)) * _WavePower;
            }
            else if(_ActiveWaveX)
            {
                v.vertex.y += sin(abs(v.texcoord.x*2-1)*_WaveTilling+_Time.y) * _WavePower;              
            }
            else if(_ActiveWaveY)
            {
                v.vertex.y += sin(abs(v.texcoord.y*2-1)*_WaveTilling+_Time.y) * _WavePower;
            }
        }

        void surf (Input IN, inout SurfaceOutputStandard o)
        {                                                                                              
            fixed4 d = tex2D (_DistortionTex, IN.uv_DistortionTex + _Time.y *_WaveSpeed);
            fixed4 c = tex2D (_MainTex, IN.uv_MainTex + d.b * _WavePower) * _Color;
            fixed4 n = tex2D (_NormalTex, IN.uv_NormalTex);

            o.Albedo = c.rgb;                                       //fixed3
            o.Alpha = c.a;                                          //half

            fixed3 nm = UnpackNormal(n);
            o.Normal = nm * fixed3(_NormalScale, _NormalScale, 1);  //fixed3
        }
        ENDCG
    }
    //FallBack "Diffuse"
    FallBack "Mobile/VertexLit"
}