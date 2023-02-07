Shader "SeaMe/SeaMe_StandardTransparentCutOut_Shader"
{
    Properties
    {
        [Header(_____Albedo_____)]
        _Color ("Color", Color) = (1,1,1,1)
        _MainTex ("Albedo Map", 2D) = "white" {}
        _CutOff ("Alpha CutOut", range(0,1)) = 0.5
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

        Blend off
        ZWrite on
        Cull [_Cull]
        LOD 200

        CGPROGRAM
        #pragma surface surf Standard fullforwardshadows
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
        fixed _CutOff;
        fixed _NormalScale;
        half _SmoothnessScale;
        half _MetallicScale;
        half _EmissionScale;

        void surf (Input IN, inout SurfaceOutputStandard o)
        {
            fixed4 c = tex2D (_MainTex, IN.uv_MainTex) * _Color;
            fixed4 n = tex2D (_NormalTex, IN.uv_NormalTex);
            fixed4 s = tex2D (_SmoothnessTex, IN.uv_SmoothnessTex);
            fixed4 m = tex2D (_MetallicTex, IN.uv_MetallicTex);
            fixed4 e = tex2D (_EmissionTex, IN.uv_EmissionTex) * _EmissionColor;

            o.Albedo = c.rgb;                                       //fixed3
            
            o.Alpha = c.a;                                          //half
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

        Blend SrcAlpha OneMinusSrcAlpha
        ZWrite Off
        Cull [_Cull]
        LOD 200

        CGPROGRAM
        #pragma surface surf Standard fullforwardshadows alpha:fade
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
        fixed _CutOff;
        fixed _NormalScale;
        half _SmoothnessScale;
        half _MetallicScale;
        half _EmissionScale;

        void surf (Input IN, inout SurfaceOutputStandard o)
        {
            fixed4 c = tex2D (_MainTex, IN.uv_MainTex) * _Color;
            fixed4 n = tex2D (_NormalTex, IN.uv_NormalTex);
            fixed4 s = tex2D (_SmoothnessTex, IN.uv_SmoothnessTex);
            fixed4 m = tex2D (_MetallicTex, IN.uv_MetallicTex);
            fixed4 e = tex2D (_EmissionTex, IN.uv_EmissionTex) * _EmissionColor;

            o.Albedo = c.rgb;                                       //fixed3
            
            o.Alpha = c.a;                                          //half
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
