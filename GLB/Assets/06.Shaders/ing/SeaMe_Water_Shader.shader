Shader "SeaMe/SeaMe_Water_Shader"
{
    Properties
    {
        [Header(_____Normal_____)]
        [Normal] _NormalTex("Normal Map", 2D) = "normal" {}

        [Space(10)]
        [Header(_____Wave_____)]
        _WaveSpeed("Wave Speed", Range(0,1)) = 0.05
        _WavePower("Wave Power", Range(0,1)) = 0.2
        _WaveTilling("Wave Tilling", Range(0,50)) = 25

        [Space(10)]
        [Header(_____Cube_____)]
        _CubeTex("Cube Map", Cube) = ""{}

        [Space(10)]
        [Header(_____Specular_____)]
        _SpecularScale("Specular Scale", Range(0,10)) = 2
    }

    SubShader
    {
        Tags { "RenderType"="Opaque" }
        Cull [_Cull]
        LOD 200

        GrabPass{}

        CGPROGRAM
        #pragma surface surf _WLight vertex:vert noambient noshadow 
        #pragma target 3.0

        sampler2D _NormalTex;
        sampler2D _GrabTexture;
        samplerCUBE _CubeTex;

        float _WaveSpeed;
        float _WavePower;
        float _WaveTilling;
        float _SpecularScale;
        float dotData;

        struct Input
        {
            float2 uv_NormalTex;
            float4 screenPos;
            float3 viewDir;
            float3 worldRefl;
            INTERNAL_DATA
        };

        void vert (inout appdata_full v)
        {
            v.vertex.y = sin(abs(v.texcoord.x*2-1) * _WaveTilling + _Time.y) * _WavePower;
        }

        void surf (Input IN, inout SurfaceOutput o)
        {
            float4 n1 = tex2D(_NormalTex, IN.uv_NormalTex + float2(_Time.y * _WaveSpeed, 0));
            float4 n2 = tex2D(_NormalTex, IN.uv_NormalTex - float2(_Time.y * _WaveSpeed, 0));
            o.Normal = UnpackNormal((n1+n2) * 0.5);

            float4 sky = texCUBE(_CubeTex, WorldReflectionVector(IN, o.Normal));
            float4 reflection = tex2D(_GrabTexture, (IN.screenPos/IN.screenPos.a).xy + o.Normal.xy * 0.03);
            dotData = pow(saturate(1 - dot(o.Normal, IN.viewDir)), 0.6);
            
            float3 water = lerp(reflection, sky, dotData).rgb;
            o.Albedo = water;
        }

        float4 Lighting_WLight(SurfaceOutput s, float3 lightDir, float3 viewDir, float atten)
        {
            float3 refVec = s.Normal * dot(s.Normal, viewDir) * 2 - viewDir;
            refVec = normalize(refVec);

            float specular = lerp(0, pow(saturate(dot(refVec, lightDir)), 256), dotData) * _SpecularScale;

            return float4(s.Albedo + specular.rrr, 1);
        }
        ENDCG
    }
    FallBack "Diffuse"
    //FallBack "Mobile/VertexLit"
}
