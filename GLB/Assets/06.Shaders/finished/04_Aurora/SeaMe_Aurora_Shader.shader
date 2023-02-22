//Zepeto World Shader
//FX_Master_Addtive_Two.shd
Shader "SeaMe/SeaMe_Aurora_Shader"
{
	Properties
	{
		[Header(_____FX_Master_Addtive_Two.shd_____)]
		[Space(10)]
		_Main_Texture("Main_Texture", 2D) = "white" {}
		_Main_U_Tiling("Main_U_Tiling", Float) = 1
		_Main_V_Tiling("Main_V_Tiling", Float) = 1
		_MainTex_U_Panning("MainTex_U_Panning", Float) = 0
		_MainTex_V_Panning("MainTex_V_Panning", Float) = 0
		_Distortion_Texture("Distortion_Texture", 2D) = "white" {}
		_Burn("Burn", Float) = 1
		_Distortion_Intensity("Distortion_Intensity", Float) = 0.2
		_Distortion_U_Panning("Distortion_U_Panning", Float) = 0
		_Distortion_V_Panning("Distortion_V_Panning", Float) = -0.2
		_Distortion_U_Tiling("Distortion_U_Tiling", Float) = 1
		_Distortion_V_Tiling("Distortion_V_Tiling", Float) = 1
		_Mask_Texture("Mask_Texture", 2D) = "white" {}
		_Dissolve("Dissolve", Float) = 1
		_Dissolve_Sharpness("Dissolve_Sharpness", Float) = 5.696
		[Toggle]_Use_CustomData("Use_CustomData", Float) = 0
		[HideInInspector] _texcoord( "", 2D ) = "white" {}
		[HideInInspector] _tex3coord3( "", 2D ) = "white" {}
		[HideInInspector] __dirty( "", Int ) = 1
	}

	SubShader
	{
		Tags{ "RenderType" = "Transparent"  "Queue" = "AlphaTest+1" "IsEmissive" = "true"  }
		Cull Off
		ZWrite Off
		Blend SrcAlpha One , SrcAlpha One
		LOD 200
		
		CGPROGRAM
		#include "UnityShaderVariables.cginc"
		#pragma target 3.0
		#pragma surface surf Unlit keepalpha noshadow 
		#undef TRANSFORM_TEX
		#define TRANSFORM_TEX(tex,name) float4(tex.xy * name##_ST.xy + name##_ST.zw, tex.z, tex.w)
		struct Input
		{
			float3 uv3_tex3coord3;
			float2 uv_texcoord;
			float4 vertexColor : COLOR;
		};

		uniform float _Use_CustomData;
		uniform float _Burn;
		uniform sampler2D _Main_Texture;
		uniform sampler2D _Distortion_Texture;
		uniform float _Distortion_U_Tiling;
		uniform float _Distortion_V_Tiling;
		uniform float _Distortion_U_Panning;
		uniform float _Distortion_V_Panning;
		uniform float _Distortion_Intensity;
		uniform float _Main_U_Tiling;
		uniform float _Main_V_Tiling;
		uniform float _MainTex_U_Panning;
		uniform float _MainTex_V_Panning;
		uniform sampler2D _Mask_Texture;
		uniform float4 _Mask_Texture_ST;
		uniform float _Dissolve;
		uniform float _Dissolve_Sharpness;

		inline half4 LightingUnlit( SurfaceOutput s, half3 lightDir, half atten )
		{
			return half4 ( 0, 0, 0, s.Alpha );
		}

		void surf( Input i , inout SurfaceOutput o )
		{
			float4 appendResult84 = (float4(_Distortion_U_Tiling , _Distortion_V_Tiling , 0.0 , 0.0));
			float4 appendResult56 = (float4(_Distortion_U_Panning , _Distortion_V_Panning , 0.0 , 0.0));
			float2 panner45 = ( _Time.y * appendResult56.xy + float2( 0,0 ));
			float2 uv_TexCoord51 = i.uv_texcoord * appendResult84.xy + panner45;
			float4 appendResult87 = (float4(_Main_U_Tiling , _Main_V_Tiling , 0.0 , 0.0));
			float4 appendResult98 = (float4(_MainTex_U_Panning , _MainTex_V_Panning , 0.0 , 0.0));
			float2 panner99 = ( _Time.y * appendResult98.xy + float2( 0,0 ));
			float2 uv_TexCoord26 = i.uv_texcoord * appendResult87.xy + panner99;
			float4 tex2DNode25 = tex2D( _Main_Texture, ( ( UnpackNormal( tex2D( _Distortion_Texture, uv_TexCoord51 ) ) * lerp(_Distortion_Intensity,i.uv3_tex3coord3.y,_Use_CustomData) ) + float3( uv_TexCoord26 ,  0.0 ) ).xy );
			o.Emission = ( lerp(_Burn,i.uv3_tex3coord3.x,_Use_CustomData) * ( tex2DNode25 * i.vertexColor ) ).rgb;
			float2 uv_Mask_Texture = i.uv_texcoord * _Mask_Texture_ST.xy + _Mask_Texture_ST.zw;
			float4 tex2DNode100 = tex2D( _Mask_Texture, uv_Mask_Texture );
			float4 temp_output_108_0 = ( tex2DNode25 * tex2DNode100 );
			float4 temp_cast_7 = (_Dissolve_Sharpness).xxxx;
			float4 clampResult119 = clamp( ( temp_output_108_0 * pow( ( ( 0.5 * temp_output_108_0 ) + lerp(_Dissolve,i.uv3_tex3coord3.z,_Use_CustomData) ) , temp_cast_7 ) ) , float4( 0,0,0,0 ) , float4( 1,0,0,0 ) );
			o.Alpha = ( ( ( tex2DNode25.a * clampResult119 ) * i.vertexColor.a ) * tex2DNode100 ).r;
		}

		ENDCG
	}
	FallBack "Diffuse"
    //FallBack "Mobile/VertexLit"
}