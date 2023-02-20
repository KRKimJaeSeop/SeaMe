Shader "SeaMe/SeaMe_MagneticField_Shader"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _GradientMap("Gradient map", 2D) = "white" {} 
        [HDR]_Color("Color", Color) = (1,1,1,1)
 
        //Secondary texture
        [Space(20)]
        [Toggle(SECONDARY_TEX)]
        _SecondTex("Second texture", float) = 0
        _SecondaryTex("Secondary texture", 2D) = "white" {}
        _SecondaryPanningSpeed("Secondary panning speed", Vector) = (0,0,0,0)
         
        _PanningSpeed("Panning speed (XY main texture - ZW displacement texture)", Vector) = (0,0,0,0)
        _Contrast("Contrast", float) = 1
        _Power("Power", float) = 1
 
        //Clipping
        [Space(20)]
        _Cutoff("Cutoff", Range(0, 1)) = 0
        _CutoffSoftness("Cutoff softness", Range(0, 1)) = 0
        [HDR]_BurnCol("Burn color", Color) = (1,1,1,1)
        _BurnSize("Burn size", float) = 0
 
        //Softness
        [Space(20)]
        [Toggle(SOFT_BLEND)]
        _SoftBlend("Soft blending", float) = 0
        _IntersectionThresholdMax("Intersection Threshold Max", float) = 1
         
        //Vertex offset
        [Space(20)]
        [Toggle(VERTEX_OFFSET)]
        _VertexOffset("Vertex offset", float) = 0
        _VertexOffsetAmount("Vertex offset amount", float) = 0
 
        //Displacement
        [Space(20)]
        _DisplacementAmount("Displacement", float) = 0
        _DisplacementGuide("DisplacementGuide", 2D) = "white" {}
         
        //Culling
        [Space(20)]
        [Enum(UnityEngine.Rendering.CullMode)] _Culling ("Cull Mode", Int) = 2
 
        //Banding
        [Space(20)]
        [Toggle(BANDING)]
        _Banding("Color banding", float) = 0
        _Bands("Number of bands", float) = 3
 
        //Polar coordinates
        [Space(20)]
        [Toggle(POLAR)]
        _PolarCoords("Polar coordinates", float) = 0
 
        //Circle mask
        [Space(20)]
        [Toggle(CIRCLE_MASK)]
        _CircleMask("Circle mask", float) = 0
        _OuterRadius("Outer radius", Range(0,1)) = 0.5
        _InnerRadius("Inner radius", Range(-1,1)) = 0
        _Smoothness("Smoothness", Range(0,1)) = 0.2
 
        //Rect mask
        [Space(20)]
        [Toggle(RECT_MASK)]
        _RectMask("Rectangle mask", float) = 0
        _RectWidth("Rectangle width", float) = 0
        _RectHeight("Rectangle height", float) = 0
        _RectMaskCutoff("Rectangle mask cutoff", Range(0,1)) = 0
        _RectSmoothness("Rectangle mask smoothness", Range(0,1)) = 0

        //추가
        //Normal
        _BumpTex("Hex Normal Texture", 2D) = "bump" {}

        //Fresnel
        _FresnelPow("Fresnel Pow", float) = 2
        _FresnelMul("Fresnel Mul", float) = 1
        [HDR]_FresnelColor("Fresnel Color", Color) = (1,1,1,1)

        //겹침
        [HDR] _OverlapColor("Overlap Color", Color) = (1,1,1,1)	//! 겹침 색상
        _DepthFadeMul("DepthFadeMul", float) = 1				//! 겹침 마스크 강도
    }
    SubShader
    {
        Tags { "RenderType"="Transparent" "Queue"="Transparent+1"}
        Blend SrcAlpha OneMinusSrcAlpha
        ZWrite Off
        Offset -1, -1
        Cull [_Culling]
        LOD 100
 
        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma shader_feature SECONDARY_TEX
            #pragma shader_feature VERTEX_OFFSET
            #pragma shader_feature SOFT_BLEND
            #pragma shader_feature BANDING
            #pragma shader_feature POLAR
            #pragma shader_feature CIRCLE_MASK
            #pragma shader_feature RECT_MASK
            // make fog work
            #pragma multi_compile_fog
 
            #include "UnityCG.cginc"
 
            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
                fixed4 color : COLOR;
                float3 normal : NORMAL;
                float4 tangent : TANGENT;
            };
 
            struct v2f
            {
                float2 uv : TEXCOORD0;
                UNITY_FOG_COORDS(1)
                float2 displUV : TEXCOORD2;
                float2 secondaryUV : TEXCOORD3;
                float4 scrPos : TEXCOORD4;
                float4 vertex : SV_POSITION;
                fixed4 color : COLOR;

                //추가
                half3 viewDir : TEXCOORD5;
                //half3 worldNormal : TEXCOORD6;

                half3 tspace0 : TEXCOORD6;
				half3 tspace1 : TEXCOORD7;
				half3 tspace2 : TEXCOORD8;

				float3 lightDir : TEXCOORD9;
            };
 
            sampler2D _MainTex;
            float4 _MainTex_ST;
            sampler2D _SecondaryTex;
            float4 _SecondaryTex_ST;
            sampler2D _GradientMap;
            float _Contrast;
            float _Power;
 
            fixed4 _Color;
 
            float _Bands;
 
            float4 _PanningSpeed;
            float4 _SecondaryPanningSpeed;
             
            float _Cutoff;
            float _CutoffSoftness;
            fixed4 _BurnCol;
            float _BurnSize;
 
            sampler2D _CameraDepthTexture;
            float _IntersectionThresholdMax;
 
            float _VertexOffsetAmount;
 
            sampler2D _DisplacementGuide;
            float4 _DisplacementGuide_ST;
            float _DisplacementAmount;
 
            float _Smoothness;
            float _OuterRadius;
            float _InnerRadius;
 
            float _RectSmoothness;
            float _RectHeight;
            float _RectWidth;
            float _RectMaskCutoff;

            //추가
            sampler2D _BumpTex;
			float4 _BumpTex_ST;

            float _FresnelMul;
            float _FresnelPow;
            half4 _FresnelColor;

            float4 _OverlapColor;
            float _DepthFadeMul;
            //sampler2D _CameraDepthTexture;	//! Depth Buffer

            //추가
            //! Rim 함수
            fixed Fuc_Fresnel(half fNDotV, half fPow, half fMul)	
            {
                half fInverseRim = 1 - abs(fNDotV);
                return saturate((pow(fInverseRim, fPow) * fMul));
            }
 
            v2f vert (appdata v)
            {
                v2f o;
                o.uv = TRANSFORM_TEX(v.uv, _MainTex);
                o.secondaryUV = TRANSFORM_TEX(v.uv, _SecondaryTex);
 
                #ifdef VERTEX_OFFSET
                float vertOffset = tex2Dlod(_MainTex, float4(o.uv + _Time.y * _PanningSpeed.xy, 1, 1)).x;
                #ifdef SECONDARY_TEX
                float secondTex = tex2Dlod(_SecondaryTex, float4(o.secondaryUV + _Time.y * _SecondaryPanningSpeed.xy, 1, 1)).x;
                vertOffset = vertOffset * secondTex * 2;
                #endif
                vertOffset = ((vertOffset * 2) - 1) * _VertexOffsetAmount;
                v.vertex.xyz += vertOffset * v.normal;
                #endif
 
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.displUV = TRANSFORM_TEX(v.uv, _DisplacementGuide);
                o.scrPos = ComputeScreenPos(o.vertex);
                o.color = v.color;
                UNITY_TRANSFER_FOG(o,o.vertex);

                //추가
                half3 worldnormal = UnityObjectToWorldNormal(v.normal);
				o.viewDir = normalize(WorldSpaceViewDir(v.vertex));     //! 시선 월드 벡터
                //o.worldNormal = UnityObjectToWorldNormal(v.normal);		//! 월드 노말 벡터

                half3 wTangent = UnityObjectToWorldDir(v.tangent.xyz);
				half tangentSign = v.tangent.w * unity_WorldTransformParams.w;
				half3 wBitangent = cross(worldnormal, wTangent) * tangentSign;
				o.tspace0 = half3(wTangent.x, wBitangent.x, worldnormal.x);
				o.tspace1 = half3(wTangent.y, wBitangent.y, worldnormal.y);
				o.tspace2 = half3(wTangent.z, wBitangent.z, worldnormal.z);
				
				o.lightDir = ObjSpaceLightDir(v.vertex);

                COMPUTE_EYEDEPTH(o.scrPos.z);

                return o;
            }
 
            fixed4 frag (v2f i) : SV_Target
            {
 
                // sample the texture
                float2 uv = i.uv;
                float2 displUV = i.displUV;
                float2 secondaryUV = i.secondaryUV;
 
                //Polar coords
                #ifdef POLAR
                float2 mappedUV = (i.uv * 2) - 1;
                uv = float2(atan2(mappedUV.y, mappedUV.x) / UNITY_PI / 2.0 + 0.5, length(mappedUV));
                mappedUV = (i.displUV * 2) - 1;
                displUV = float2(atan2(mappedUV.y, mappedUV.x) / UNITY_PI / 2.0 + 0.5, length(mappedUV));
                mappedUV = (i.secondaryUV * 2) - 1;
                secondaryUV = float2(atan2(mappedUV.y, mappedUV.x) / UNITY_PI / 2.0 + 0.5, length(mappedUV));
                #endif
 
                //UV Panning
                uv += _Time.y * _PanningSpeed.xy;
                displUV += _Time.y * _PanningSpeed.zw;
                secondaryUV += _Time.y * _SecondaryPanningSpeed.xy;
 
                //Displacement
                float2 displ = tex2D(_DisplacementGuide, displUV).xy;
                displ = ((displ * 2) - 1) * _DisplacementAmount;
 
                float col = pow(saturate(lerp(0.5, tex2D(_MainTex, uv + displ).x, _Contrast)), _Power);
                #ifdef SECONDARY_TEX
                col = col * pow(saturate(lerp(0.5, tex2D(_SecondaryTex, secondaryUV + displ).x, _Contrast)), _Power) * 2;
                #endif
 
                //Masking
                #ifdef CIRCLE_MASK
                float circle = distance(i.uv, float2(0.5, 0.5));
                col *= 1 - smoothstep(_OuterRadius, _OuterRadius + _Smoothness, circle);
                col *= smoothstep(_InnerRadius, _InnerRadius + _Smoothness, circle);
                #endif
 
                #ifdef RECT_MASK
                float2 uvMapped = (i.uv * 2) - 1;
                float rect = max(abs(uvMapped.x / _RectWidth), abs(uvMapped.y / _RectHeight));
                col *= 1 - smoothstep(_RectMaskCutoff, _RectMaskCutoff + _RectSmoothness, rect);
                #endif
             
 
                float orCol = col;
 
                //Banding
                #ifdef BANDING
                col = round(col * _Bands) / _Bands;
                #endif
 
                //Transparency
                float cutoff = saturate(_Cutoff + (1 - i.color.a));
                float alpha = smoothstep(cutoff, cutoff + _CutoffSoftness, orCol);
 
                //Coloring
                fixed4 rampCol = tex2D(_GradientMap, float2(col, 0)) + _BurnCol * smoothstep(orCol - cutoff, orCol - cutoff + _CutoffSoftness, _BurnSize) * smoothstep(0.001, 0.5, cutoff);
                fixed4 finalCol = fixed4(rampCol.rgb * _Color.rgb * rampCol.a, 1);
                 
                // apply fog
                UNITY_APPLY_FOG(i.fogCoord, finalCol);
                finalCol.a = alpha * tex2D(_MainTex, uv + displ).a * _Color.a;
 
                //Soft Blending
                #ifdef SOFT_BLEND
                float depth = LinearEyeDepth (tex2Dproj(_CameraDepthTexture, UNITY_PROJ_COORD(i.scrPos)));
                float diff = saturate(_IntersectionThresholdMax * (depth - i.scrPos.w));
                finalCol.a *= diff;
                #endif
                //return finalCol;

                //추가
                fixed intersect = saturate((abs(LinearEyeDepth(tex2Dproj(_CameraDepthTexture,i.scrPos).r) - i.scrPos.z)) / (_DepthFadeMul));
				intersect = 1-saturate(intersect);

                fixed3 fHexNormal = UnpackNormal(tex2D(_BumpTex, i.uv * _BumpTex_ST.rg));

                //half3 worldNormal = saturate(i.worldNormal);
                half3 worldNormal;
				worldNormal.x = dot(i.tspace0, fHexNormal);
				worldNormal.y = dot(i.tspace1, fHexNormal);
				worldNormal.z = dot(i.tspace2, fHexNormal);

                //fixed3 fHalfVector = normalize(i.lightDir + i.viewDir);
				//float fBPSpecular = saturate(dot(worldNormal, fHalfVector));
                //fBPSpecular = clamp(0, 0.1f, pow(fBPSpecular, _InnerSpecularPow) * _InnerSpecularMul);

                fixed fNDotV = dot(i.viewDir, worldNormal);
                fixed fFresnel = Fuc_Fresnel(fNDotV, _FresnelPow, _FresnelMul);
				fFresnel *= lerp(0.5f, 1.0f, abs(sin(_Time.y*2)));
				half4 fFresnelColor = _FresnelColor * fFresnel;
				fixed fFresnel_Back = Fuc_Fresnel(fNDotV, 1.5f, 5.0f);

                //fixed fRim_Basic = Fuc_Rim(fNDotV, _FresnelPow, _FresnelMul);
	            //half4 fRim_Color = fRim_Basic * _FresnelColor;

                //! 뎁스 텍스처를 LinearEyeDepth함수를 통해 월드->뷰 공간으로 변환 
                //float fDepthMap_R = abs(LinearEyeDepth(tex2Dproj(_CameraDepthTexture, i.scrPos).r) - i.scrPos.z);
                //fixed fDepthIntersect = saturate(fDepthMap_R / _DepthFadeMul);
                //half4 fDepthIntersectColor = (1 - fDepthIntersect) * _DepthIntersectColor;
                //return fRim_Color;

                finalCol.rgb *= (fFresnelColor + ((intersect) * _OverlapColor));
                finalCol.a *= (fFresnelColor.a + ((intersect) * _OverlapColor.a));
                finalCol.a = saturate(finalCol.a);
                return finalCol;
            }
            ENDCG
        }
    }
}
