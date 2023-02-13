Shader "SeaMe/SeaMe_StandardTransparentCutOut_Shader"
{
    Properties
    {
        [Header(_____Albedo_____)]
        _Color ("Color", Color) = (1,1,1,1)
        _MainTex ("Albedo Map", 2D) = "white" {}
        _CutOff ("Alpha CutOut", range(0,1)) = 0.5
        _CutOffSoftness("Cutoff softness", Range(0, 1)) = 0
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
    }

    SubShader
    {
        Tags { "RenderType" = "Opaque"  "Queue" = "Geometry+1"  "RequireOption" = "SoftVegetation" }
        //Tags{ "RenderType" = "TransparentCutout"  "Queue" = "Geometry+0" "IsEmissive" = "true"  }

        Blend off
        ZWrite on
        Cull [_Cull]
        LOD 200

        CGPROGRAM
        //#pragma surface surf Standard fullforwardshadows
        ////#include "UnityStandardUtils.cginc"
		#include "UnityPBSLighting.cginc"
        #pragma surface surf StandardCustom keepalpha addshadow fullforwardshadows exclude_path:deferred
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

        struct SurfaceOutputStandardCustom
		{
			fixed3 Albedo;
			fixed3 Normal;
			half3 Emission;
			half Metallic;
			half Smoothness;
			half Occlusion;
			fixed Alpha;
			//fixed3 Transmission;
		};

        fixed4 _Color;
        fixed4 _EmissionColor;
        float _CutOff;
        float _CutOffSoftness;
        fixed _NormalScale;
        half _SmoothnessScale;
        half _MetallicScale;
        half _EmissionScale;

        inline half4 LightingStandardCustom(SurfaceOutputStandardCustom s, half3 viewDir, UnityGI gi )
		{
			//half3 transmission = max(0 , -dot(s.Normal, gi.light.dir)) * gi.light.color * s.Transmission;
			//half4 d = half4(s.Albedo * transmission , 0);
            half3 transmission = max(0 , -dot(s.Normal, gi.light.dir)) * gi.light.color;
			half4 d = half4(s.Albedo * transmission , 0);

			SurfaceOutputStandard r;
			r.Albedo = s.Albedo;
			r.Normal = s.Normal;
			r.Emission = s.Emission;
			r.Metallic = s.Metallic;
			r.Smoothness = s.Smoothness;
			r.Occlusion = s.Occlusion;
			r.Alpha = s.Alpha;
			return LightingStandard (r, viewDir, gi) + d;
		}

		inline void LightingStandardCustom_GI(SurfaceOutputStandardCustom s, UnityGIInput data, inout UnityGI gi )
		{
			#if defined(UNITY_PASS_DEFERRED) && UNITY_ENABLE_REFLECTION_BUFFERS
				gi = UnityGlobalIllumination(data, s.Occlusion, s.Normal);
			#else
				UNITY_GLOSSY_ENV_FROM_SURFACE( g, s, data );
				gi = UnityGlobalIllumination( data, s.Occlusion, s.Normal, g );
			#endif
		}

        void surf (Input IN, inout SurfaceOutputStandardCustom o) //SurfaceOutputStandard
        {
            fixed4 c = tex2D (_MainTex, IN.uv_MainTex) * _Color;
            fixed4 n = tex2D (_NormalTex, IN.uv_NormalTex);
            fixed4 s = tex2D (_SmoothnessTex, IN.uv_SmoothnessTex);
            fixed4 m = tex2D (_MetallicTex, IN.uv_MetallicTex);
            fixed4 e = tex2D (_EmissionTex, IN.uv_EmissionTex) * _EmissionColor;

            o.Albedo = c.rgb;                                       //fixed3
            
            // o.Alpha = c.a;                                          //half
            // if(o.Alpha < _CutOff) {   
			// 	clip(-1.0); 
			// }

            float texAlpha = tex2D (_MainTex, IN.uv_MainTex).a;     //half
            float cutoff = saturate(_CutOff + (1 - texAlpha));
            float softAlpha = smoothstep(cutoff, cutoff + _CutOffSoftness, texAlpha);
            o.Alpha = softAlpha * texAlpha * _Color.a;
            if(o.Alpha < _CutOff) {
                clip(-1.0);
            }

            fixed3 nm = UnpackNormal(n);
            o.Normal = nm * fixed3(_NormalScale, _NormalScale, 1);  //fixed3

            o.Smoothness = s.rgb * _SmoothnessScale;                //half
            o.Metallic = m.rgb * _MetallicScale;                    //half
            o.Emission = e.rgb * _EmissionScale;                    //fixed3
        }
        ENDCG

        Tags {"Queue" = "Transparent" "RenderType" = "Transparent" "RequireOption" = "SoftVegetation" }
        //Tags{ "RenderType" = "TransparentCutout"  "Queue" = "Geometry+0" "IsEmissive" = "true"  }

        Blend SrcAlpha OneMinusSrcAlpha
        ZWrite Off
        Cull [_Cull]
        LOD 200

        CGPROGRAM
        //#pragma surface surf Standard fullforwardshadows alpha:fade
        ////#include "UnityStandardUtils.cginc"
		#include "UnityPBSLighting.cginc"
        #pragma surface surf StandardCustom keepalpha addshadow fullforwardshadows exclude_path:deferred
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

        struct SurfaceOutputStandardCustom
		{
			fixed3 Albedo;
			fixed3 Normal;
			half3 Emission;
			half Metallic;
			half Smoothness;
			half Occlusion;
			fixed Alpha;
			//fixed3 Transmission;
		};

        fixed4 _Color;
        fixed4 _EmissionColor;
        fixed _CutOff;
        float _CutOffSoftness;
        fixed _NormalScale;
        half _SmoothnessScale;
        half _MetallicScale;
        half _EmissionScale;

        inline half4 LightingStandardCustom(SurfaceOutputStandardCustom s, half3 viewDir, UnityGI gi )
		{
			//half3 transmission = max(0 , -dot(s.Normal, gi.light.dir)) * gi.light.color * s.Transmission;
			//half4 d = half4(s.Albedo * transmission , 0);
            half3 transmission = max(0 , -dot(s.Normal, gi.light.dir)) * gi.light.color;
			half4 d = half4(s.Albedo * transmission , 0);

			SurfaceOutputStandard r;
			r.Albedo = s.Albedo;
			r.Normal = s.Normal;
			r.Emission = s.Emission;
			r.Metallic = s.Metallic;
			r.Smoothness = s.Smoothness;
			r.Occlusion = s.Occlusion;
			r.Alpha = s.Alpha;
			return LightingStandard (r, viewDir, gi) + d;
		}

		inline void LightingStandardCustom_GI(SurfaceOutputStandardCustom s, UnityGIInput data, inout UnityGI gi )
		{
			#if defined(UNITY_PASS_DEFERRED) && UNITY_ENABLE_REFLECTION_BUFFERS
				gi = UnityGlobalIllumination(data, s.Occlusion, s.Normal);
			#else
				UNITY_GLOSSY_ENV_FROM_SURFACE( g, s, data );
				gi = UnityGlobalIllumination( data, s.Occlusion, s.Normal, g );
			#endif
		}

        void surf (Input IN, inout SurfaceOutputStandardCustom o) //SurfaceOutputStandard
        {
            fixed4 c = tex2D (_MainTex, IN.uv_MainTex) * _Color;
            fixed4 n = tex2D (_NormalTex, IN.uv_NormalTex);
            fixed4 s = tex2D (_SmoothnessTex, IN.uv_SmoothnessTex);
            fixed4 m = tex2D (_MetallicTex, IN.uv_MetallicTex);
            fixed4 e = tex2D (_EmissionTex, IN.uv_EmissionTex) * _EmissionColor;

            o.Albedo = c.rgb;                                       //fixed3
            
            // o.Alpha = c.a;                                          //half
            // if(o.Alpha < _CutOff) {   
			// 	clip(-1.0); 
			// }

            float texAlpha = tex2D (_MainTex, IN.uv_MainTex).a;     //half
            float cutoff = saturate(_CutOff + (1 - texAlpha));
            float softAlpha = smoothstep(cutoff, cutoff + _CutOffSoftness, texAlpha);
            o.Alpha = softAlpha * texAlpha * _Color.a;
            if(o.Alpha < _CutOff) {
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
