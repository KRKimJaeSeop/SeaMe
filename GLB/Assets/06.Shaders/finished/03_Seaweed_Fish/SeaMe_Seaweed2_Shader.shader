Shader "SeaMe/SeaMe_Seaweed2_Shader"
{
    Properties
    {
        [Header(_____Albedo_____)]
        _Color ("Color", Color) = (1,1,1,1)
        _MainTex ("Albedo Map", 2D) = "white" {}
        _Cutoff ("Cutoff", range(0,1)) = 0.5
        _CutoffSoftness("Cutoff softness", Range(0, 1)) = 0
        [Enum(UnityEngine.Rendering.CullMode)]_Cull("Cull Mode", Float) = 2

        // [Space(10)]
        // [Header(_____Normal_____)]
        // [Normal] _NormalTex("Normal Map", 2D) = "normal" {}
        // _NormalScale("Normal Scale", Range(0,5)) = 1.0

        // [Space(10)]
        // [Header(_____Roughness_____)]
        // _SmoothnessTex("Smoothness Map", 2D) = "smoothness" {}
        // _SmoothnessScale ("Smoothness Scale", Range(0,1)) = 0.0

        // [Space(10)]
        // [Header(_____Metallic_____)]
        // _MetallicTex("Metallic Map", 2D) = "metallic" {}
        // _MetallicScale ("Metallic Scale", Range(0,1)) = 0.0

        [Space(10)]
        [Header(_____Emission_____)]
        [HDR]_EmissionColor("Emission Color", Color) = (1,1,1)
        _EmissionTex("Emission", 2D) = "white" {}
        _EmissionScale ("Emission Scale", Range(0,5)) = 0.0

        [Space(10)]
        [Header(_____Occlusion_____)]
        _WorldYPosition("WorldYPosition", Range(0,2)) = 1
        _InnerAOAmount("InnerAOAmount", Range(0,10)) = 5
        _InnerAOLength("InnerAOLength", Range(0,10)) = 2
        _InnerAOPower("InnerAOPower", Range(0,10)) = 5
        _InnerAOColor("InnerAOColor", Color) = (1, 1, 1, 1)

        [Space(10)]
        [Header(_____Lightvector_____)]
        _LightvectorX("LightVectorX", Range(-1,1)) = 0.5
        _LightvectorY("LightVectorY", Range(-1,1)) = 0.5
        _LightvectorZ("LightVectorZ", Range(-1,1)) = 0.5

        [Space(10)]
        [Header(_____SSS_____)]
        _SSSColor("SSSColor", Color) = (1, 1, 1, 1)
        _BrightAmount("BrightAmount", Range(1, 3)) = 1
        _BrightPower("BrightPower", Range(0, 10)) = 1

        [Space(10)]
        [Header(_____Wind_____)]
        _WindFoliageAmplitude("Wind Foliage Amplitude", Range( 0 , 1)) = 0
		_WindFoliageSpeed("Wind Foliage Speed", Range( 0 , 1)) = 0

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
        //Tags { "RenderType"="TransparentCutout" "Queue"="AlphaTest+1" }
        Tags { "RenderType"="Transparent" "Queue"="Transparent" "IsEmissive" = "true" }
        LOD 100
        Blend SrcAlpha OneMinusSrcAlpha
        ZWrite Off
        //Offset -1, -1
        Cull [_Cull]
        LOD 100

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            // make fog work
            #pragma multi_compile_fog

            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
                float3 normal : NORMAL;
                float4 color : COLOR;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                UNITY_FOG_COORDS(1)
                float4 vertex : SV_POSITION;
                float3 innerAo : COLOR;         //innerAo   //color
                float3 unmapedNormal : NORMAL;
                float3 normalDir: TEXCOORD2;
            };

            sampler2D _MainTex;
            float4 _MainTex_ST;
            sampler2D _EmissionTex;
            float4 _EmissionTex_ST;

            SamplerState sampler_MainTex;
            uniform half _WorldYPosition;
            half _InnerAOAmount, _InnerAOLength, _InnerAOPower;
            half _LightvectorX, _LightvectorY, _LightvectorZ;
            half _BrightAmount, _BrightPower;
            
            //추가
            half _Cutoff, _CutoffSoftness;

            fixed4 _Color, _InnerAOColor, _SSSColor;


            //추가
            fixed4 _EmissionColor;
            half _EmissionScale;

            float _WaveSpeed;
            float _WavePower;
            float _WaveTilling;
            float _MaskOffset;

            int _FixedAxis;
            bool _ActiveWaveX;
            bool _ActiveWaveY;
            bool _ActiveWaveZ;

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                float3 worldPos = mul(unity_ObjectToWorld, v.vertex).xyz;

                float fixedAxis;
                float mask;
                float uX = v.uv.x;
                float uY = v.uv.y;

                if(_FixedAxis==0) { fixedAxis = 1-uY; }         //TOP
                else if(_FixedAxis==1) { fixedAxis = uY; }      //BOTTOM
                else if(_FixedAxis==2) { fixedAxis = uX; }      //LEFT
                else if(_FixedAxis==3) { fixedAxis = 1-uX; }    //RIGHT

                mask = saturate(sin(fixedAxis - _MaskOffset));

                if(_ActiveWaveX)
                {
                    o.vertex.x += sin(uX * UNITY_PI * _WaveTilling + _Time.y * _WaveSpeed) * _WavePower * mask;
                }
                if(_ActiveWaveY)
                {
                    o.vertex.y += sin(uY * UNITY_PI * _WaveTilling + _Time.y * _WaveSpeed) * _WavePower * mask;
                }
                if(_ActiveWaveZ)
                {
                    o.vertex.z += sin(uX * UNITY_PI *_WaveTilling + _Time.y * _WaveSpeed) * _WavePower * mask;
                }

                o.uv = TRANSFORM_TEX(v.uv, _MainTex);
                o.innerAo = (v.vertex.xyz - float3(0, _WorldYPosition, 0)) / _InnerAOLength;
                o.normalDir = normalize( mul( float4(v.normal, 0.0), unity_WorldToObject).xyz);
                float3 worldUnmapNormal = normalize(mul(unity_ObjectToWorld, v.vertex.xyz) - mul(unity_ObjectToWorld, float3(0, _WorldYPosition, 0)));
                o.unmapedNormal = worldUnmapNormal;                

                // apply fog
                UNITY_TRANSFER_FOG(o,o.vertex);

                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                fixed4 col = tex2D(_MainTex, i.uv) * _Color;
                fixed4 emission = tex2D(_EmissionTex, i.uv) * _EmissionColor;
                
                float ndotl = dot(i.unmapedNormal, normalize(float3(_LightvectorX, _LightvectorY, _LightvectorZ)));
                float halfLambert = ndotl * 0.5 + 0.5;
    
                float3 occlusion = 1 - pow((cos(i.innerAo.x) * 0.5 + 0.5) * (cos(i.innerAo.y) * 0.5 + 0.5) * (cos(i.innerAo.z) * 0.5 + 0.5), _InnerAOPower) * (1 - _InnerAOColor);
                float3 fakeSSS = (pow(halfLambert, _BrightPower) + pow((1 - pow((cos(i.innerAo.x) * 0.5 + 0.5) * (cos(i.innerAo.y) * 0.5 + 0.5) * (cos(i.innerAo.z) * 0.5 + 0.5), _InnerAOPower)), _BrightPower)) * _SSSColor;
                
                col = (float4(col.rgb * (halfLambert + _BrightAmount * 0.1 + fakeSSS) * lerp(1, occlusion, _InnerAOAmount) * _BrightAmount, col.a) + col) * 0.5;
                col.rgb += emission.rgb;

                fixed texAlpha = col.a;
                fixed cutoff = saturate(_Cutoff + (1 - texAlpha));
                fixed softAlpha = smoothstep(cutoff, cutoff + _CutoffSoftness, texAlpha);
                col.a = softAlpha * texAlpha * _Color.a;
                clip(col.a - _Cutoff);

                // apply fog
                UNITY_APPLY_FOG(i.fogCoord, col);

                return col;
            }
            ENDCG
        }
    }
}
