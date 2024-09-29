// <copyright file="ContrastCalculator.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pictoris.Drawing;

/// <summary>
/// APCA Contrast calculator. 
/// https://github.com/Myndex/SAPC-APCA/
/// 
/// Accessible Perceptual Contrast Algorithm
/// https://github.com/Myndex/apca-w3/
/// </summary>
public static class ContrastCalculator
{
    private static class SA98G
    {
        public const float mainTRC = 2.4f; // 2.4 exponent for emulating actual monitor perception

        // For reverseAPCA
        public static float mainTRCencode => 1f / mainTRC;

        // sRGB coefficients
        public const float sRco = 0.2126729f;
        public const float sGco = 0.7151522f;
        public const float sBco = 0.0721750f;

        // G-4g constants for use with 2.4 exponent
        public const float normBG = 0.56f;
        public const float normTXT = 0.57f;
        public const float revTXT = 0.62f;
        public const float revBG = 0.65f;

        // G-4g Clamps and Scalers
        public const float blkThrs = 0.022f;
        public const float blkClmp = 1.414f;
        public const float scaleBoW = 1.14f;
        public const float scaleWoB = 1.14f;
        public const float loBoWoffset = 0.027f;
        public const float loWoBoffset = 0.027f;
        public const float deltaYmin = 0.0005f;
        public const float loClip = 0.1f;

        ///// MAGIC NUMBERS for UNCLAMP, for use with 0.022 & 1.414 /////
        // Magic Numbers for reverseAPCA
        public const double mFactor = 1.94685544331710d;
        public static double mFactInv => 1f / mFactor;
        public const double mOffsetIn = 0.03873938165714010d;
        public const double mExpAdj = 0.2833433964208690d;
        public static double mExp => mExpAdj / blkClmp;
        public const double mOffsetOut = 0.3128657958707580d;
    }

    public static float GetContrast(ColorF textColor, ColorF backgroundColor)
    {
        return GetContrast(sRGBtoY(textColor), sRGBtoY(backgroundColor));
    }

    private static float GetContrast(float txtY, float bgY)
    {
        // send linear Y (luminance) for text and background.
        // txtY and bgY must be between 0.0-1.0
        // IMPORTANT: Do not swap, polarity is important.

        if (MathF.Min(txtY, bgY) < 0f || MathF.Max(txtY, bgY) > 1f)
        {
            return 0.0f;  // return zero on error
        }

        // TUTORIAL

        // Use Y for text and BG, and soft clamp black,
        // return 0 for very close luminances, determine
        // polarity, and calculate SAPC raw contrast
        // Then scale for easy to remember levels.

        // Note that reverse contrast (white text on black)
        // intentionally returns a negative number
        // Proper polarity is important!

        //////////   BLACK SOFT CLAMP   ////////////////////////////////////////

        // Soft clamps Y for either color if it is near black.
        txtY = (txtY > SA98G.blkThrs) ? txtY :
                               txtY + MathF.Pow(SA98G.blkThrs - txtY, SA98G.blkClmp);
        bgY = (bgY > SA98G.blkThrs) ? bgY :
                                bgY + MathF.Pow(SA98G.blkThrs - bgY, SA98G.blkClmp);

        ///// Return 0 Early for extremely low ∆Y
        if (MathF.Abs(bgY - txtY) < SA98G.deltaYmin)
        {
            return 0f;
        }

        //////////   APCA/SAPC CONTRAST - LOW CLIP (W3 LICENSE)  ///////////////

        if (bgY > txtY)
        {  
            // For normal polarity, black text on white (BoW)

            // Calculate the SAPC contrast value and scale
            float SAPC = (MathF.Pow(bgY, SA98G.normBG) -
                          MathF.Pow(txtY, SA98G.normTXT)) * SA98G.scaleBoW;

            // Low Contrast smooth rollout to prevent polarity reversal
            // and also a low-clip for very low contrasts
            return ((SAPC < SA98G.loClip) ? 0.0f : SAPC - SA98G.loBoWoffset) * 100f;

        }
        else
        {  
            // For reverse polarity, light text on dark (WoB)

            float SAPC = (MathF.Pow(bgY, SA98G.revBG) -
                          MathF.Pow(txtY, SA98G.revTXT)) * SA98G.scaleWoB;

            return ((SAPC > -SA98G.loClip) ? 0.0f : SAPC + SA98G.loWoBoffset) * 100f;
        }
    }

    internal static float sRGBtoY(ColorF rgb)
    {
        // send sRGB 8bpc (0xFFFFFF) or string

        //  APCA   0.0.98G - 4g - W3 Compatible Constants   ////////////////////
        // Future:
        // 0.2126478133913640	0.7151791475336150	0.0721730390750208
        // Derived from:
        // xW	yW	K	xR	yR	xG	yG	xB	yB
        // 0.312720	0.329030	6504	0.640	0.330	0.300	0.600	0.150	0.060

        // linearize r, g, or b then apply coefficients
        // and sum then return the resulting luminance

        return MathF.Min(1, (SA98G.sRco * MathF.Pow(rgb.R, SA98G.mainTRC))
                          + (SA98G.sGco * MathF.Pow(rgb.G, SA98G.mainTRC))
                          + (SA98G.sBco * MathF.Pow(rgb.B, SA98G.mainTRC)));
    }
}
