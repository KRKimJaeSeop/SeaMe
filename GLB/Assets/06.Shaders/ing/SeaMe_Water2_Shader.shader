Shader "SeaMe/SeaMe_Water2_Shader"
{
    Properties
    {   
        [Header(_____Normal_____)]
        [Normal] _NormalTex("Normal Map", 2D) = "normal" {}

        [Space(10)]
        [Header(_____Wave_____)]
        _DistortionTex("Distortion Map", 2D) = "black" {}
        _WaveSpeed("Wave Speed", Range(0,1)) = 0.05
        _WavePower("Wave Power", Range(0,1)) = 0.2
        _WaveTilling("Wave Tilling", Range(0,50)) = 10
        [Toggle]_ActiveWaveX ("Active Wave Movement X-axis", Range(0, 1)) = 0
        [Toggle]_ActiveWaveY ("Active Wave Movement Y-axis", Range(0, 1)) = 0

        [Space(10)]
        [Header(_____Cull_____)]
        [Space(10)]
        [Enum(UnityEngine.Rendering.CullMode)]_Cull("Cull Mode", Float) = 2
    }

    SubShader
    {
        Tags { "RenderType"="Opaque" }
        Cull [_Cull]
        LOD 200
 
        GrabPass{}        
 
        CGPROGRAM
        #pragma surface surf _CatDarkLight vertex:vert noambient noshadow
        #pragma target 3.0
    
        sampler2D _NormalTex;
        sampler2D _DistortionTex;
        sampler2D _GrabTexture;

        struct Input
        {
            float2 uv_NormalTex;
            float2 uv_DistortionTex;
            float4 screenPos;    
            float3 viewDir;
            float3 worldRefl;
            INTERNAL_DATA
        };

        float _WaveSpeed;
        float _WavePower;
        float _WaveTilling;
        bool _ActiveWaveX;
        bool _ActiveWaveY;

        void vert(inout appdata_full v)
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
 
        void surf (Input IN, inout SurfaceOutput o)
        {   
            float3 nL = UnpackNormal(tex2D(_NormalTex, IN.uv_NormalTex - float2(0, _Time.y * _WaveSpeed)));
            float3 nR = UnpackNormal(tex2D(_NormalTex, IN.uv_NormalTex + float2(0, _Time.y * _WaveSpeed)));
            float3 nT = UnpackNormal(tex2D(_NormalTex, IN.uv_NormalTex - float2(_Time.y * _WaveSpeed, 0)));
            float3 nB = UnpackNormal(tex2D(_NormalTex, IN.uv_NormalTex + float2(_Time.y * _WaveSpeed, 0)));
            o.Normal = (nL + nR + nT + nB) / 4.0f;
 
            float3 worldReflectionVec = WorldReflectionVector(IN, o.Normal).xyz;
            float3 reflection = UNITY_SAMPLE_TEXCUBE(unity_SpecCube0, worldReflectionVec).rgb * unity_SpecCube0_HDR.r;
 
            float4 d = tex2D(_DistortionTex, IN.uv_DistortionTex + _Time.y * _WaveSpeed);    

            float3 scrPos = IN.screenPos.xyz / (IN.screenPos.w + 0.00001f);
            float4 grab = tex2D(_GrabTexture, scrPos.xy + (d.r * _WavePower));
 
            float nDotV = dot(o.Normal, IN.viewDir);
            float rim = saturate(pow(1 - nDotV + 0.1f, 1));
 
            o.Emission = lerp(grab.rgb, reflection, rim);
        }
 
        float4 Lighting_CatDarkLight(SurfaceOutput s, float3 lightDir, float3 viewDir, float atten)
        {
            float4 spec = float4(0.0f, 0.0f, 0.0f, 0.0f);
            float3 halfVector = normalize(lightDir + viewDir);
            float specHDotN = saturate(dot(s.Normal, halfVector));
            specHDotN = pow(specHDotN, 100.0f);

            float4 finalColor = 0.0f;
            finalColor = specHDotN;

            return finalColor;
        }
        ENDCG
    }
    FallBack "Diffuse"
    //FallBack "Mobile/VertexLit"
}