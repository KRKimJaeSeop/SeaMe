Shader "SeaMe/SeaMe_Seaweed_Shader"
{
    Properties
    {
        [Header(_____Albedo_____)]
        _Color ("Color", Color) = (1,1,1,1)
        _MainTex ("Albedo Map", 2D) = "white" {}
        _Cutoff ("Cutoff", range(0,1)) = 0.5
        _CutoffSoftness("Cutoff softness", Range(0, 1)) = 0
        [Enum(UnityEngine.Rendering.CullMode)]_Cull("Cull Mode", Float) = 2

        [Space(10)]
        [Header(_____Normal_____)]
        [Normal] _NormalTex("Normal Map", 2D) = "normal" {}
        _NormalScale("Normal Scale", Range(0,5)) = 1.0

        [Space(10)]
        [Header(_____Roughness_____)]
        _SmoothnessTex("Smoothness Map", 2D) = "smoothness" {}
        _SmoothnessScale ("Smoothness Scale", Range(0,1)) = 0.0

        [Space(10)]
        [Header(_____Metallic_____)]
        _MetallicTex("Metallic Map", 2D) = "metallic" {}
        _MetallicScale ("Metallic Scale", Range(0,1)) = 0.0

        [Space(10)]
        [Header(_____Emission_____)]
        _EmissionColor("Emission Color", Color) = (1,1,1)
        _EmissionTex("Emission", 2D) = "white" {}
        _EmissionScale ("Emission Scale", Range(0,5)) = 0.0

        [Space(10)]
        [Header(_____Wave_____)]
        _WaveSpeed("Wave Speed", Range(0,10)) = 0.05
        _WavePower("Wave Power", Range(0,3)) = 0.2
        _WaveTilling("Wave Tilling", Range(0,50)) = 25
        _MaskOffset("Mask offset", Range(0, 1)) = 0.1
        [KeywordEnum(TOP, BOTTOM, LEFT, RIGHT)]_FixedAxis("Fixed Axis Mode", Float) = 0
        [Toggle]_ActiveWaveX ("Active Wave Movement X-axis", Range(0, 1)) = 0
        [Toggle]_ActiveWaveY ("Active Wave Movement Y-axis", Range(0, 1)) = 0
        [Toggle]_ActiveWaveZ ("Active Wave Movement Z-axis", Range(0, 1)) = 0
        
    }

    SubShader
    {
        Tags { "RenderType"="Transparent" "Queue"="Transparent" }
        Blend SrcAlpha OneMinusSrcAlpha
        ZWrite Off
        Offset -1, -1
        Cull [_Cull]
        LOD 200

        CGPROGRAM
        #pragma surface surf Standard fullforwardshadows vertex:vert 
        #pragma target 3.0

        sampler2D _MainTex;
        sampler2D _NormalTex;
        sampler2D _SmoothnessTex;
        sampler2D _MetallicTex;
        sampler2D _EmissionTex;

        struct Input
        {
            float2 uv_MainTex;
            float2 uv_NormalTex;
            float2 uv_SmoothnessTex;
            float2 uv_MetallicTex;
            float2 uv_EmissionTex;
        };

        fixed4 _Color;
        fixed4 _EmissionColor;

        fixed _NormalScale;
        half _SmoothnessScale;
        half _MetallicScale;
        half _EmissionScale;

        float _Cutoff;
        float _CutoffSoftness;

        float _WaveSpeed;
        float _WavePower;
        float _WaveTilling;
        float _MaskOffset;

        int _FixedAxis;
        bool _ActiveWaveX;
        bool _ActiveWaveY;
        bool _ActiveWaveZ;
        
        void vert (inout appdata_full v)
        {
            float fixedAxis;
            float mask;
            float uX = v.texcoord.x;
            float uY = v.texcoord.y;
            float uZ = v.texcoord.z;
            //float3 worldPos = mul(unity_ObjectToWorld, v.vertex).xyz;

            if(_FixedAxis==0) { fixedAxis = 1-uY; }         //TOP
            else if(_FixedAxis==1) { fixedAxis = uY; }      //BOTTOM
            else if(_FixedAxis==2) { fixedAxis = uX; }      //LEFT
            else if(_FixedAxis==3) { fixedAxis = 1-uX; }    //RIGHT

            mask = saturate(sin(fixedAxis - _MaskOffset));
            //mask = saturate(sin((fixedAxis - _MaskOffset) * UNITY_PI));
            //mask = fixedAxis - _MaskOffset;

            if(_ActiveWaveX)
            {
                v.vertex.x += sin(uX * UNITY_PI * _WaveTilling + _Time.y * _WaveSpeed) * _WavePower * mask;
                //v.vertex.x += sin(worldPos.x *_WaveTilling + _Time.y * _WaveSpeed) * _WavePower * uY;
            }
            if(_ActiveWaveY)
            {
                v.vertex.y += (sin(uY * UNITY_PI * _WaveTilling + _Time.y * _WaveSpeed) + sin(uX * UNITY_PI * _WaveTilling + _Time.y * _WaveSpeed)) * _WavePower * mask;
                //v.vertex.y += sin(abs(uY *2-1)*_WaveTilling+_Time.y*_WaveSpeed) * _WavePower * uY;
                //v.vertex.y += sin(worldPos.y *_WaveTilling + _Time.y * _WaveSpeed) * _WavePower * uY;
            }
            if(_ActiveWaveZ)
            {
                v.vertex.z += sin(uX * UNITY_PI *_WaveTilling + _Time.y * _WaveSpeed) * _WavePower * mask;
                //v.vertex.z += sin(worldPos.z *_WaveTilling + _Time.y * _WaveSpeed) * _WavePower * uY;
            }
        }

        void surf (Input IN, inout SurfaceOutputStandard o)
        {
            fixed4 c = tex2D (_MainTex, IN.uv_MainTex) * _Color;
            fixed4 n = tex2D (_NormalTex, IN.uv_NormalTex);
            fixed4 s = tex2D (_SmoothnessTex, IN.uv_SmoothnessTex);
            fixed4 m = tex2D (_MetallicTex, IN.uv_MetallicTex);
            fixed4 e = tex2D (_EmissionTex, IN.uv_EmissionTex) * _EmissionColor;

            o.Albedo = c.rgb;                                       //fixed3

            float texAlpha = c.a;                                   //half
            float cutoff = saturate(_Cutoff + (1 - texAlpha));
            float softAlpha = smoothstep(cutoff, cutoff + _CutoffSoftness, texAlpha);
            o.Alpha = softAlpha * texAlpha * _Color.a;
            if(o.Alpha < _Cutoff) {
                clip(-1.0);
            }

            fixed3 nm = UnpackNormal(n);
            o.Normal = nm * fixed3(_NormalScale, _NormalScale, 1);  //fixed3

            o.Smoothness = s.rgb * _SmoothnessScale;                //half
            o.Metallic = m.rgb * _MetallicScale;                    //half
            o.Emission = e.rgb * _EmissionScale;                    //fixed3
        }
        ENDCG
    }
    //FallBack "Diffuse"
    FallBack "Mobile/VertexLit"
}
