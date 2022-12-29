//# signature=UnityEngine.ImageConversionModule#953415a97d584f62a3aa516b1d72535c#0.0.4
// @ts-nocheck
declare module 'UnityEngine' {

    import * as System from 'System';
    import * as UnityEngine_Texture2D from 'UnityEngine.Texture2D';
    import * as UnityEngine_Experimental_Rendering from 'UnityEngine.Experimental.Rendering';
    import * as Unity_Collections from 'Unity.Collections';
        
    /**
     * This class provides utility and extension methods to convert image data from or to PNG, EXR, TGA, and JPEG formats.
     */
    class ImageConversion extends System.Object {
        /**
         * Enables legacy PNG runtime import behavior.
         */
        public static get EnableLegacyPngGammaRuntimeLoadBehavior(): boolean;
        public static set EnableLegacyPngGammaRuntimeLoadBehavior(value: boolean);
        /**
         * Encodes the specified texture in TGA format.
         * @param tex The texture to encode.
         */
        public static EncodeToTGA($tex: Texture2D):number[];
        /**
         * Encodes this texture into PNG format.
         * @param tex The texture to convert.
         */
        public static EncodeToPNG($tex: Texture2D):number[];
        /**
         * Encodes this texture into JPG format.
         * @param tex Text texture to convert.
         * @param quality JPG quality to encode with, 1..100 (default 75).
         */
        public static EncodeToJPG($tex: Texture2D, $quality: number):number[];
        /**
         * Encodes this texture into JPG format.
         * @param tex Text texture to convert.
         * @param quality JPG quality to encode with, 1..100 (default 75).
         */
        public static EncodeToJPG($tex: Texture2D):number[];
        /**
         * Encodes this texture into the EXR format.
         * @param tex The texture to convert.
         * @param flags Flags used to control compression and the output format.
         */
        public static EncodeToEXR($tex: Texture2D, $flags: UnityEngine_Texture2D.EXRFlags):number[];
        
        public static EncodeToEXR($tex: Texture2D):number[];
        /**
         * Loads PNG/JPG (or supported format) image byte array into a texture.
         * @param data The byte array containing the image data to load.
         * @param markNonReadable Set to false by default, pass true to optionally mark the texture as non-readable.
         * @param tex The texture to load the image into.
         * @returns Returns true if the data can be loaded, false otherwise.
         */
        public static LoadImage($tex: Texture2D, $data: number[], $markNonReadable: boolean):boolean;
        
        public static LoadImage($tex: Texture2D, $data: number[]):boolean;
        
        public static EncodeArrayToTGA($array: System.Array, $format: UnityEngine_Experimental_Rendering.GraphicsFormat, $width: number, $height: number, $rowBytes?: number):number[];
        
        public static EncodeArrayToPNG($array: System.Array, $format: UnityEngine_Experimental_Rendering.GraphicsFormat, $width: number, $height: number, $rowBytes?: number):number[];
        
        public static EncodeArrayToJPG($array: System.Array, $format: UnityEngine_Experimental_Rendering.GraphicsFormat, $width: number, $height: number, $rowBytes?: number, $quality?: number):number[];
        
        public static EncodeArrayToEXR($array: System.Array, $format: UnityEngine_Experimental_Rendering.GraphicsFormat, $width: number, $height: number, $rowBytes?: number, $flags?: UnityEngine_Texture2D.EXRFlags):number[];
        
        public static EncodeNativeArrayToTGA<T>($input: Unity_Collections.NativeArray$1<T>, $format: UnityEngine_Experimental_Rendering.GraphicsFormat, $width: number, $height: number, $rowBytes?: number):Unity_Collections.NativeArray$1<number>;
        
        public static EncodeNativeArrayToPNG<T>($input: Unity_Collections.NativeArray$1<T>, $format: UnityEngine_Experimental_Rendering.GraphicsFormat, $width: number, $height: number, $rowBytes?: number):Unity_Collections.NativeArray$1<number>;
        
        public static EncodeNativeArrayToJPG<T>($input: Unity_Collections.NativeArray$1<T>, $format: UnityEngine_Experimental_Rendering.GraphicsFormat, $width: number, $height: number, $rowBytes?: number, $quality?: number):Unity_Collections.NativeArray$1<number>;
        
        public static EncodeNativeArrayToEXR<T>($input: Unity_Collections.NativeArray$1<T>, $format: UnityEngine_Experimental_Rendering.GraphicsFormat, $width: number, $height: number, $rowBytes?: number, $flags?: UnityEngine_Texture2D.EXRFlags):Unity_Collections.NativeArray$1<number>;
        
                    
    }
    /**
     * Class that represents textures in C# code.
     */
    interface Texture2D extends Texture {
        
                    
    }
    /**
     * Base class for Texture handling.
     */
    interface Texture extends Object {
        
                    
    }
    /**
     * Base class for all objects Unity can reference.
     */
    interface Object extends System.Object {
        
                    
    }
    
    interface Texture2D {
        /**
         * Encodes the specified texture in TGA format.
         * @param tex The texture to encode.
         * @extension UnityEngine.ImageConversion
         */
        EncodeToTGA():number[];
        /**
         * Encodes this texture into PNG format.
         * @param tex The texture to convert.
         * @extension UnityEngine.ImageConversion
         */
        EncodeToPNG():number[];
        /**
         * Encodes this texture into JPG format.
         * @param tex Text texture to convert.
         * @param quality JPG quality to encode with, 1..100 (default 75).
         * @extension UnityEngine.ImageConversion
         */
        EncodeToJPG($quality: number):number[];
        /**
         * Encodes this texture into JPG format.
         * @param tex Text texture to convert.
         * @param quality JPG quality to encode with, 1..100 (default 75).
         * @extension UnityEngine.ImageConversion
         */
        EncodeToJPG():number[];
        /**
         * Encodes this texture into the EXR format.
         * @param tex The texture to convert.
         * @param flags Flags used to control compression and the output format.
         * @extension UnityEngine.ImageConversion
         */
        EncodeToEXR($flags: UnityEngine_Texture2D.EXRFlags):number[];
        /** @extension UnityEngine.ImageConversion */
        EncodeToEXR():number[];
        /**
         * Loads PNG/JPG (or supported format) image byte array into a texture.
         * @param data The byte array containing the image data to load.
         * @param markNonReadable Set to false by default, pass true to optionally mark the texture as non-readable.
         * @param tex The texture to load the image into.
         * @returns Returns true if the data can be loaded, false otherwise.
         * @extension UnityEngine.ImageConversion
         */
        LoadImage($data: number[], $markNonReadable: boolean):boolean;
        /** @extension UnityEngine.ImageConversion */
        LoadImage($data: number[]):boolean;
        
                    
    }
    
}
declare module 'System' {

        
    
    interface Object {
        
                    
    }
    
    interface Boolean extends ValueType {
        
                    
    }
    
    interface ValueType extends Object {
        
                    
    }
    
    interface Void extends ValueType {
        
                    
    }
    
    interface Byte extends ValueType {
        
                    
    }
    
    interface Array extends Object {
        
                    
    }
    
    interface Int32 extends ValueType {
        
                    
    }
    
    interface Enum extends ValueType {
        
                    
    }
    
    interface UInt32 extends ValueType {
        
                    
    }
    
}
declare module 'UnityEngine.Texture2D' {

        
    /**
     * Flags used to control the encoding to an EXR file.
     */
    enum EXRFlags { None = 0, OutputAsFloat = 1, CompressZIP = 2, CompressRLE = 4, CompressPIZ = 8 }
    
}
declare module 'UnityEngine.Experimental.Rendering' {

        
    /**
     * Use this format to create either Textures or RenderTextures from scripts.
     */
    enum GraphicsFormat { None = 0, R8_SRGB = 1, R8G8_SRGB = 2, R8G8B8_SRGB = 3, R8G8B8A8_SRGB = 4, R8_UNorm = 5, R8G8_UNorm = 6, R8G8B8_UNorm = 7, R8G8B8A8_UNorm = 8, R8_SNorm = 9, R8G8_SNorm = 10, R8G8B8_SNorm = 11, R8G8B8A8_SNorm = 12, R8_UInt = 13, R8G8_UInt = 14, R8G8B8_UInt = 15, R8G8B8A8_UInt = 16, R8_SInt = 17, R8G8_SInt = 18, R8G8B8_SInt = 19, R8G8B8A8_SInt = 20, R16_UNorm = 21, R16G16_UNorm = 22, R16G16B16_UNorm = 23, R16G16B16A16_UNorm = 24, R16_SNorm = 25, R16G16_SNorm = 26, R16G16B16_SNorm = 27, R16G16B16A16_SNorm = 28, R16_UInt = 29, R16G16_UInt = 30, R16G16B16_UInt = 31, R16G16B16A16_UInt = 32, R16_SInt = 33, R16G16_SInt = 34, R16G16B16_SInt = 35, R16G16B16A16_SInt = 36, R32_UInt = 37, R32G32_UInt = 38, R32G32B32_UInt = 39, R32G32B32A32_UInt = 40, R32_SInt = 41, R32G32_SInt = 42, R32G32B32_SInt = 43, R32G32B32A32_SInt = 44, R16_SFloat = 45, R16G16_SFloat = 46, R16G16B16_SFloat = 47, R16G16B16A16_SFloat = 48, R32_SFloat = 49, R32G32_SFloat = 50, R32G32B32_SFloat = 51, R32G32B32A32_SFloat = 52, B8G8R8_SRGB = 56, B8G8R8A8_SRGB = 57, B8G8R8_UNorm = 58, B8G8R8A8_UNorm = 59, B8G8R8_SNorm = 60, B8G8R8A8_SNorm = 61, B8G8R8_UInt = 62, B8G8R8A8_UInt = 63, B8G8R8_SInt = 64, B8G8R8A8_SInt = 65, R4G4B4A4_UNormPack16 = 66, B4G4R4A4_UNormPack16 = 67, R5G6B5_UNormPack16 = 68, B5G6R5_UNormPack16 = 69, R5G5B5A1_UNormPack16 = 70, B5G5R5A1_UNormPack16 = 71, A1R5G5B5_UNormPack16 = 72, E5B9G9R9_UFloatPack32 = 73, B10G11R11_UFloatPack32 = 74, A2B10G10R10_UNormPack32 = 75, A2B10G10R10_UIntPack32 = 76, A2B10G10R10_SIntPack32 = 77, A2R10G10B10_UNormPack32 = 78, A2R10G10B10_UIntPack32 = 79, A2R10G10B10_SIntPack32 = 80, A2R10G10B10_XRSRGBPack32 = 81, A2R10G10B10_XRUNormPack32 = 82, R10G10B10_XRSRGBPack32 = 83, R10G10B10_XRUNormPack32 = 84, A10R10G10B10_XRSRGBPack32 = 85, A10R10G10B10_XRUNormPack32 = 86, RGB_DXT1_SRGB = 96, RGBA_DXT1_SRGB = 96, RGB_DXT1_UNorm = 97, RGBA_DXT1_UNorm = 97, RGBA_DXT3_SRGB = 98, RGBA_DXT3_UNorm = 99, RGBA_DXT5_SRGB = 100, RGBA_DXT5_UNorm = 101, R_BC4_UNorm = 102, R_BC4_SNorm = 103, RG_BC5_UNorm = 104, RG_BC5_SNorm = 105, RGB_BC6H_UFloat = 106, RGB_BC6H_SFloat = 107, RGBA_BC7_SRGB = 108, RGBA_BC7_UNorm = 109, RGB_PVRTC_2Bpp_SRGB = 110, RGB_PVRTC_2Bpp_UNorm = 111, RGB_PVRTC_4Bpp_SRGB = 112, RGB_PVRTC_4Bpp_UNorm = 113, RGBA_PVRTC_2Bpp_SRGB = 114, RGBA_PVRTC_2Bpp_UNorm = 115, RGBA_PVRTC_4Bpp_SRGB = 116, RGBA_PVRTC_4Bpp_UNorm = 117, RGB_ETC_UNorm = 118, RGB_ETC2_SRGB = 119, RGB_ETC2_UNorm = 120, RGB_A1_ETC2_SRGB = 121, RGB_A1_ETC2_UNorm = 122, RGBA_ETC2_SRGB = 123, RGBA_ETC2_UNorm = 124, R_EAC_UNorm = 125, R_EAC_SNorm = 126, RG_EAC_UNorm = 127, RG_EAC_SNorm = 128, RGBA_ASTC4X4_SRGB = 129, RGBA_ASTC4X4_UNorm = 130, RGBA_ASTC5X5_SRGB = 131, RGBA_ASTC5X5_UNorm = 132, RGBA_ASTC6X6_SRGB = 133, RGBA_ASTC6X6_UNorm = 134, RGBA_ASTC8X8_SRGB = 135, RGBA_ASTC8X8_UNorm = 136, RGBA_ASTC10X10_SRGB = 137, RGBA_ASTC10X10_UNorm = 138, RGBA_ASTC12X12_SRGB = 139, RGBA_ASTC12X12_UNorm = 140, RGBA_ASTC4X4_UFloat = 145, RGBA_ASTC5X5_UFloat = 146, RGBA_ASTC6X6_UFloat = 147, RGBA_ASTC8X8_UFloat = 148, RGBA_ASTC10X10_UFloat = 149, RGBA_ASTC12X12_UFloat = 150 }
    
}
declare module 'Unity.Collections' {

    import * as System from 'System';
        
    /**
     * A NativeArray exposes a buffer of native memory to managed code, making it possible to share data between managed and native without marshalling costs.
     */
    interface NativeArray$1<T> extends System.ValueType {
        
                    
    }
    
}

