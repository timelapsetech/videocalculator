import { CodecCategory } from '../context/CodecContext';

export const defaultCodecData: CodecCategory[] = [
  {
    "id": "delivery",
    "name": "Delivery & Streaming",
    "description": "Optimized for final delivery and streaming platforms",
    "codecs": [
      {
        "id": "h264",
        "name": "H.264 (AVC)",
        "description": "Most widely supported codec for delivery",
        "workflowNotes": "Best for web streaming, social media, and general distribution. Excellent compatibility across all devices and platforms.",
        "variants": [
          {
            "name": "Baseline Profile",
            "description": "Basic profile for maximum compatibility",
            "bitrates": {
              "720p": { "23.98": 5, "24": 5, "25": 5, "29.97": 5, "30": 5, "59.94": 5, "60": 5 },
              "1080p": { "23.98": 8, "24": 8, "25": 8, "29.97": 8, "30": 8, "59.94": 8, "60": 8 },
              "4K": { "23.98": 25, "24": 25, "25": 25, "29.97": 25, "30": 25, "59.94": 25, "60": 25 },
              "8K": { "23.98": 100, "24": 100, "25": 100, "29.97": 100, "30": 100, "59.94": 100, "60": 100 }
            }
          },
          {
            "name": "Main Profile",
            "description": "Standard profile for broadcast and streaming",
            "bitrates": {
              "720p": { "23.98": 6, "24": 6, "25": 6, "29.97": 6, "30": 6, "59.94": 6, "60": 6 },
              "1080p": { "23.98": 10, "24": 10, "25": 10, "29.97": 10, "30": 10, "59.94": 10, "60": 10 },
              "4K": { "23.98": 30, "24": 30, "25": 30, "29.97": 30, "30": 30, "59.94": 30, "60": 30 },
              "8K": { "23.98": 120, "24": 120, "25": 120, "29.97": 120, "30": 120, "59.94": 120, "60": 120 }
            }
          },
          {
            "name": "High Profile",
            "description": "Advanced profile for high-quality delivery",
            "bitrates": {
              "720p": { "23.98": 8, "24": 8, "25": 8, "29.97": 8, "30": 8, "59.94": 8, "60": 8 },
              "1080p": { "23.98": 15, "24": 15, "25": 15, "29.97": 15, "30": 15, "59.94": 15, "60": 15 },
              "4K": { "23.98": 45, "24": 45, "25": 45, "29.97": 45, "30": 45, "59.94": 45, "60": 45 },
              "8K": { "23.98": 180, "24": 180, "25": 180, "29.97": 180, "30": 180, "59.94": 180, "60": 180 }
            }
          }
        ]
      },
      {
        "id": "h265",
        "name": "H.265 (HEVC)",
        "description": "Next-generation codec with superior compression efficiency",
        "workflowNotes": "Better compression than H.264, ideal for 4K/8K streaming. Requires more processing power but delivers smaller file sizes.",
        "variants": [
          {
            "name": "Main Profile",
            "description": "Standard HEVC profile for 8-bit content",
            "bitrates": {
              "720p": { "23.98": 2.5, "24": 2.5, "25": 2.5, "29.97": 2.5, "30": 2.5, "59.94": 2.5, "60": 2.5 },
              "1080p": { "23.98": 5, "24": 5, "25": 5, "29.97": 5, "30": 5, "59.94": 5, "60": 5 },
              "4K": { "23.98": 15, "24": 15, "25": 15, "29.97": 15, "30": 15, "59.94": 15, "60": 15 },
              "8K": { "23.98": 50, "24": 50, "25": 50, "29.97": 50, "30": 50, "59.94": 50, "60": 50 }
            }
          },
          {
            "name": "Main 10",
            "description": "10-bit profile for HDR content",
            "bitrates": {
              "720p": { "23.98": 3, "24": 3, "25": 3, "29.97": 3, "30": 3, "59.94": 3, "60": 3 },
              "1080p": { "23.98": 6, "24": 6, "25": 6, "29.97": 6, "30": 6, "59.94": 6, "60": 6 },
              "4K": { "23.98": 18, "24": 18, "25": 18, "29.97": 18, "30": 18, "59.94": 18, "60": 18 },
              "8K": { "23.98": 60, "24": 60, "25": 60, "29.97": 60, "30": 60, "59.94": 60, "60": 60 }
            }
          },
          {
            "name": "Main 4:2:2 10",
            "description": "Professional 10-bit 4:2:2 profile",
            "bitrates": {
              "720p": { "23.98": 4, "24": 4, "25": 4, "29.97": 4, "30": 4, "59.94": 4, "60": 4 },
              "1080p": { "23.98": 8, "24": 8, "25": 8, "29.97": 8, "30": 8, "59.94": 8, "60": 8 },
              "4K": { "23.98": 25, "24": 25, "25": 25, "29.97": 25, "30": 25, "59.94": 25, "60": 25 },
              "8K": { "23.98": 80, "24": 80, "25": 80, "29.97": 80, "30": 80, "59.94": 80, "60": 80 }
            }
          }
        ]
      },
      {
        "id": "vp9",
        "name": "VP9",
        "description": "Google's open-source codec for web streaming",
        "workflowNotes": "Used by YouTube and other Google services. Good compression efficiency with royalty-free licensing.",
        "variants": [
          {
            "name": "Profile 0",
            "description": "8-bit 4:2:0 profile",
            "bitrates": {
              "720p": { "23.98": 2.5, "24": 2.5, "25": 2.5, "29.97": 2.5, "30": 2.5, "59.94": 2.5, "60": 2.5 },
              "1080p": { "23.98": 5, "24": 5, "25": 5, "29.97": 5, "30": 5, "59.94": 5, "60": 5 },
              "4K": { "23.98": 18, "24": 18, "25": 18, "29.97": 18, "30": 18, "59.94": 18, "60": 18 },
              "8K": { "23.98": 60, "24": 60, "25": 60, "29.97": 60, "30": 60, "59.94": 60, "60": 60 }
            }
          },
          {
            "name": "Profile 2",
            "description": "10-bit 4:2:0 profile for HDR",
            "bitrates": {
              "720p": { "23.98": 3, "24": 3, "25": 3, "29.97": 3, "30": 3, "59.94": 3, "60": 3 },
              "1080p": { "23.98": 6, "24": 6, "25": 6, "29.97": 6, "30": 6, "59.94": 6, "60": 6 },
              "4K": { "23.98": 22, "24": 22, "25": 22, "29.97": 22, "30": 22, "59.94": 22, "60": 22 },
              "8K": { "23.98": 75, "24": 75, "25": 75, "29.97": 75, "30": 75, "59.94": 75, "60": 75 }
            }
          }
        ]
      },
      {
        "id": "av1",
        "name": "AV1",
        "description": "Latest open-source codec with superior compression",
        "workflowNotes": "Future-proof codec with excellent compression efficiency. Slower encoding but significantly smaller file sizes.",
        "variants": [
          {
            "name": "Main Profile",
            "description": "Standard AV1 profile",
            "bitrates": {
              "720p": { "23.98": 2, "24": 2, "25": 2, "29.97": 2, "30": 2, "59.94": 2, "60": 2 },
              "1080p": { "23.98": 4, "24": 4, "25": 4, "29.97": 4, "30": 4, "59.94": 4, "60": 4 },
              "4K": { "23.98": 12, "24": 12, "25": 12, "29.97": 12, "30": 12, "59.94": 12, "60": 12 },
              "8K": { "23.98": 40, "24": 40, "25": 40, "29.97": 40, "30": 40, "59.94": 40, "60": 40 }
            }
          },
          {
            "name": "High Profile",
            "description": "Advanced AV1 profile with enhanced features",
            "bitrates": {
              "720p": { "23.98": 2.5, "24": 2.5, "25": 2.5, "29.97": 2.5, "30": 2.5, "59.94": 2.5, "60": 2.5 },
              "1080p": { "23.98": 5, "24": 5, "25": 5, "29.97": 5, "30": 5, "59.94": 5, "60": 5 },
              "4K": { "23.98": 15, "24": 15, "25": 15, "29.97": 15, "30": 15, "59.94": 15, "60": 15 },
              "8K": { "23.98": 50, "24": 50, "25": 50, "29.97": 50, "30": 50, "59.94": 50, "60": 50 }
            }
          },
          {
            "name": "Professional Profile",
            "description": "Professional AV1 profile for high-end applications",
            "bitrates": {
              "720p": { "23.98": 3, "24": 3, "25": 3, "29.97": 3, "30": 3, "59.94": 3, "60": 3 },
              "1080p": { "23.98": 6, "24": 6, "25": 6, "29.97": 6, "30": 6, "59.94": 6, "60": 6 },
              "4K": { "23.98": 18, "24": 18, "25": 18, "29.97": 18, "30": 18, "59.94": 18, "60": 18 },
              "8K": { "23.98": 60, "24": 60, "25": 60, "29.97": 60, "30": 60, "59.94": 60, "60": 60 }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "professional",
    "name": "Professional Intermediate",
    "description": "High-quality codecs optimized for professional post-production workflows",
    "codecs": [
      {
        "id": "prores",
        "name": "Apple ProRes",
        "description": "Industry standard for professional editing and color grading",
        "workflowNotes": "Optimized for editing performance with excellent image quality. Widely supported across professional NLEs and color grading systems.",
        "variants": [
          {
            "name": "ProRes 422 Proxy",
            "description": "Lowest quality for offline editing and proxies",
            "bitrates": {
              "NTSC": { "23.98": 18, "24": 18, "25": 18, "29.97": 18, "30": 18 },
              "NTSC_D1": { "23.98": 18, "24": 18, "25": 18, "29.97": 18, "30": 18 },
              "PAL": { "23.98": 18, "24": 18, "25": 18, "29.97": 18, "30": 18 },
              "720p": { "23.98": 45, "24": 45, "25": 45, "29.97": 45, "30": 45, "59.94": 45, "60": 45 },
              "1080p": { "23.98": 45, "24": 45, "25": 45, "29.97": 45, "30": 45, "59.94": 45, "60": 45 },
              "4K": { "23.98": 180, "24": 180, "25": 180, "29.97": 180, "30": 180, "59.94": 180, "60": 180 }
            }
          },
          {
            "name": "ProRes 422 LT",
            "description": "Lower quality for basic editing workflows",
            "bitrates": {
              "NTSC": { "23.98": 41, "24": 41, "25": 41, "29.97": 41, "30": 41 },
              "NTSC_D1": { "23.98": 41, "24": 41, "25": 41, "29.97": 41, "30": 41 },
              "PAL": { "23.98": 41, "24": 41, "25": 41, "29.97": 41, "30": 41 },
              "720p": { "23.98": 102, "24": 102, "25": 102, "29.97": 102, "30": 102, "59.94": 102, "60": 102 },
              "1080p": { "23.98": 102, "24": 102, "25": 102, "29.97": 102, "30": 102, "59.94": 102, "60": 102 },
              "4K": { "23.98": 408, "24": 408, "25": 408, "29.97": 408, "30": 408, "59.94": 408, "60": 408 }
            }
          },
          {
            "name": "ProRes 422",
            "description": "Standard quality for professional editing",
            "bitrates": {
              "NTSC": { "23.98": 59, "24": 59, "25": 59, "29.97": 59, "30": 59 },
              "NTSC_D1": { "23.98": 59, "24": 59, "25": 59, "29.97": 59, "30": 59 },
              "PAL": { "23.98": 59, "24": 59, "25": 59, "29.97": 59, "30": 59 },
              "720p": { "23.98": 147, "24": 147, "25": 147, "29.97": 147, "30": 147, "59.94": 147, "60": 147 },
              "1080p": { "23.98": 147, "24": 147, "25": 147, "29.97": 147, "30": 147, "59.94": 147, "60": 147 },
              "4K": { "23.98": 588, "24": 588, "25": 588, "29.97": 588, "30": 588, "59.94": 588, "60": 588 }
            }
          },
          {
            "name": "ProRes 422 HQ",
            "description": "High quality for demanding workflows",
            "bitrates": {
              "NTSC": { "23.98": 88, "24": 88, "25": 88, "29.97": 88, "30": 88 },
              "NTSC_D1": { "23.98": 88, "24": 88, "25": 88, "29.97": 88, "30": 88 },
              "PAL": { "23.98": 88, "24": 88, "25": 88, "29.97": 88, "30": 88 },
              "720p": { "23.98": 220, "24": 220, "25": 220, "29.97": 220, "30": 220, "59.94": 220, "60": 220 },
              "1080p": { "23.98": 220, "24": 220, "25": 220, "29.97": 220, "30": 220, "59.94": 220, "60": 220 },
              "4K": { "23.98": 880, "24": 880, "25": 880, "29.97": 880, "30": 880, "59.94": 880, "60": 880 }
            }
          },
          {
            "name": "ProRes 4444",
            "description": "Highest quality with alpha channel support",
            "bitrates": {
              "NTSC": { "23.98": 132, "24": 132, "25": 132, "29.97": 132, "30": 132 },
              "NTSC_D1": { "23.98": 132, "24": 132, "25": 132, "29.97": 132, "30": 132 },
              "PAL": { "23.98": 132, "24": 132, "25": 132, "29.97": 132, "30": 132 },
              "720p": { "23.98": 330, "24": 330, "25": 330, "29.97": 330, "30": 330, "59.94": 330, "60": 330 },
              "1080p": { "23.98": 330, "24": 330, "25": 330, "29.97": 330, "30": 330, "59.94": 330, "60": 330 },
              "4K": { "23.98": 1320, "24": 1320, "25": 1320, "29.97": 1320, "30": 1320, "59.94": 1320, "60": 1320 }
            }
          },
          {
            "name": "ProRes 4444 XQ",
            "description": "Extreme quality for high-end color grading",
            "bitrates": {
              "NTSC": { "23.98": 200, "24": 200, "25": 200, "29.97": 200, "30": 200 },
              "NTSC_D1": { "23.98": 200, "24": 200, "25": 200, "29.97": 200, "30": 200 },
              "PAL": { "23.98": 200, "24": 200, "25": 200, "29.97": 200, "30": 200 },
              "720p": { "23.98": 500, "24": 500, "25": 500, "29.97": 500, "30": 500, "59.94": 500, "60": 500 },
              "1080p": { "23.98": 500, "24": 500, "25": 500, "29.97": 500, "30": 500, "59.94": 500, "60": 500 },
              "4K": { "23.98": 2000, "24": 2000, "25": 2000, "29.97": 2000, "30": 2000, "59.94": 2000, "60": 2000 }
            }
          }
        ]
      },
      {
        "id": "dnxhd",
        "name": "Avid DNxHD/HR",
        "description": "Avid's professional codec family optimized for editorial workflows",
        "workflowNotes": "Designed for Avid Media Composer and broadcast workflows. Excellent for collaborative editing environments.",
        "variants": [
          {
            "name": "DNxHD 36",
            "description": "Lowest quality DNxHD for offline editing",
            "bitrates": {
              "720p": { "23.98": 36, "24": 36, "25": 36, "29.97": 36, "30": 36, "59.94": 36, "60": 36 },
              "1080p": { "23.98": 36, "24": 36, "25": 36, "29.97": 36, "30": 36, "59.94": 36, "60": 36 }
            }
          },
          {
            "name": "DNxHD 145",
            "description": "Standard quality DNxHD for online editing",
            "bitrates": {
              "720p": { "23.98": 145, "24": 145, "25": 145, "29.97": 145, "30": 145, "59.94": 145, "60": 145 },
              "1080p": { "23.98": 145, "24": 145, "25": 145, "29.97": 145, "30": 145, "59.94": 145, "60": 145 },
              "1080i": { "23.98": 145, "24": 145, "25": 145, "29.97": 145, "30": 145, "59.94": 145, "60": 145 }
            }
          },
          {
            "name": "DNxHD 220",
            "description": "High quality DNxHD for finishing",
            "bitrates": {
              "720p": { "23.98": 220, "24": 220, "25": 220, "29.97": 220, "30": 220, "59.94": 220, "60": 220 },
              "1080p": { "23.98": 220, "24": 220, "25": 220, "29.97": 220, "30": 220, "59.94": 220, "60": 220 }
            }
          },
          {
            "name": "DNxHR LB",
            "description": "Low bandwidth DNxHR for proxy workflows",
            "bitrates": {
              "720p": { "23.98": 45, "24": 45, "25": 45, "29.97": 45, "30": 45, "59.94": 45, "60": 45 },
              "1080p": { "23.98": 45, "24": 45, "25": 45, "29.97": 45, "30": 45, "59.94": 45, "60": 45 },
              "4K": { "23.98": 180, "24": 180, "25": 180, "29.97": 180, "30": 180, "59.94": 180, "60": 180 }
            }
          },
          {
            "name": "DNxHR SQ",
            "description": "Standard quality DNxHR",
            "bitrates": {
              "720p": { "23.98": 115, "24": 115, "25": 115, "29.97": 115, "30": 115, "59.94": 115, "60": 115 },
              "1080p": { "23.98": 115, "24": 115, "25": 115, "29.97": 115, "30": 115, "59.94": 115, "60": 115 },
              "4K": { "23.98": 460, "24": 460, "25": 460, "29.97": 460, "30": 460, "59.94": 460, "60": 460 }
            }
          },
          {
            "name": "DNxHR HQ",
            "description": "High quality DNxHR",
            "bitrates": {
              "720p": { "23.98": 175, "24": 175, "25": 175, "29.97": 175, "30": 175, "59.94": 175, "60": 175 },
              "1080p": { "23.98": 175, "24": 175, "25": 175, "29.97": 175, "30": 175, "59.94": 175, "60": 175 },
              "4K": { "23.98": 700, "24": 700, "25": 700, "29.97": 700, "30": 700, "59.94": 700, "60": 700 }
            }
          },
          {
            "name": "DNxHR HQX",
            "description": "Highest quality DNxHR",
            "bitrates": {
              "720p": { "23.98": 220, "24": 220, "25": 220, "29.97": 220, "30": 220, "59.94": 220, "60": 220 },
              "1080p": { "23.98": 220, "24": 220, "25": 220, "29.97": 220, "30": 220, "59.94": 220, "60": 220 },
              "4K": { "23.98": 880, "24": 880, "25": 880, "29.97": 880, "30": 880, "59.94": 880, "60": 880 }
            }
          },
          {
            "name": "DNxHR 444",
            "description": "Uncompressed quality with alpha support",
            "bitrates": {
              "720p": { "23.98": 350, "24": 350, "25": 350, "29.97": 350, "30": 350, "59.94": 350, "60": 350 },
              "1080p": { "23.98": 350, "24": 350, "25": 350, "29.97": 350, "30": 350, "59.94": 350, "60": 350 },
              "4K": { "23.98": 1400, "24": 1400, "25": 1400, "29.97": 1400, "30": 1400, "59.94": 1400, "60": 1400 }
            }
          }
        ]
      },
      {
        "id": "cineform",
        "name": "GoPro CineForm",
        "description": "Wavelet-based intermediate codec for mixed resolution workflows",
        "workflowNotes": "Excellent for mixed resolution projects and cross-platform compatibility. Good balance of quality and file size.",
        "variants": [
          {
            "name": "CineForm Low",
            "description": "Low quality for proxy workflows",
            "bitrates": {
              "720p": { "23.98": 40, "24": 40, "25": 40, "29.97": 40, "30": 40, "59.94": 40, "60": 40 },
              "1080p": { "23.98": 90, "24": 90, "25": 90, "29.97": 90, "30": 90, "59.94": 90, "60": 90 },
              "4K": { "23.98": 360, "24": 360, "25": 360, "29.97": 360, "30": 360, "59.94": 360, "60": 360 }
            }
          },
          {
            "name": "CineForm Medium",
            "description": "Medium quality for standard editing",
            "bitrates": {
              "720p": { "23.98": 80, "24": 80, "25": 80, "29.97": 80, "30": 80, "59.94": 80, "60": 80 },
              "1080p": { "23.98": 180, "24": 180, "25": 180, "29.97": 180, "30": 180, "59.94": 180, "60": 180 },
              "4K": { "23.98": 720, "24": 720, "25": 720, "29.97": 720, "30": 720, "59.94": 720, "60": 720 }
            }
          },
          {
            "name": "CineForm High",
            "description": "High quality for finishing workflows",
            "bitrates": {
              "720p": { "23.98": 120, "24": 120, "25": 120, "29.97": 120, "30": 120, "59.94": 120, "60": 120 },
              "1080p": { "23.98": 270, "24": 270, "25": 270, "29.97": 270, "30": 270, "59.94": 270, "60": 270 },
              "4K": { "23.98": 1080, "24": 1080, "25": 1080, "29.97": 1080, "30": 1080, "59.94": 1080, "60": 1080 }
            }
          },
          {
            "name": "CineForm Film Scan",
            "description": "Highest quality for film scanning applications",
            "bitrates": {
              "720p": { "23.98": 180, "24": 180, "25": 180, "29.97": 180, "30": 180, "59.94": 180, "60": 180 },
              "1080p": { "23.98": 400, "24": 400, "25": 400, "29.97": 400, "30": 400, "59.94": 400, "60": 400 },
              "4K": { "23.98": 1600, "24": 1600, "25": 1600, "29.97": 1600, "30": 1600, "59.94": 1600, "60": 1600 }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "camera",
    "name": "Camera Acquisition",
    "description": "Native camera recording formats from professional cameras",
    "codecs": [
      {
        "id": "xdcam",
        "name": "Sony XDCAM",
        "description": "Sony's professional camera format for broadcast applications",
        "workflowNotes": "Widely used in broadcast cameras and professional camcorders. Good balance of quality and workflow efficiency.",
        "variants": [
          {
            "name": "XDCAM EX",
            "description": "Entry-level XDCAM format",
            "bitrates": {
              "720p": { "23.98": 18, "24": 18, "25": 18, "29.97": 18, "30": 18, "59.94": 18, "60": 18 },
              "1080p": { "23.98": 18, "24": 18, "25": 18, "29.97": 18, "30": 18, "59.94": 18, "60": 18 }
            }
          },
          {
            "name": "XDCAM HD",
            "description": "Standard XDCAM HD format",
            "bitrates": {
              "720p": { "23.98": 25, "24": 25, "25": 25, "29.97": 25, "30": 25, "59.94": 25, "60": 25 },
              "1080p": { "23.98": 25, "24": 25, "25": 25, "29.97": 25, "30": 25, "59.94": 25, "60": 25 }
            }
          },
          {
            "name": "XDCAM HD422",
            "description": "High-quality 4:2:2 XDCAM format",
            "bitrates": {
              "720p": { "23.98": 50, "24": 50, "25": 50, "29.97": 50, "30": 50, "59.94": 50, "60": 50 },
              "1080p": { "23.98": 50, "24": 50, "25": 50, "29.97": 50, "30": 50, "59.94": 50, "60": 50 },
              "1080i": { "23.98": 50, "24": 50, "25": 50, "29.97": 50, "30": 50, "59.94": 50, "60": 50 },
              "4K": { "23.98": 100, "24": 100, "25": 100, "29.97": 100, "30": 100, "59.94": 100, "60": 100 }
            }
          }
        ]
      },
      {
        "id": "xavc",
        "name": "Sony XAVC",
        "description": "Sony's modern acquisition format for high-end cameras",
        "workflowNotes": "Used in Sony's professional and cinema cameras. Excellent image quality with efficient compression.",
        "variants": [
          {
            "name": "XAVC-L",
            "description": "Long GOP XAVC for efficient recording",
            "bitrates": {
              "720p": { "23.98": 25, "24": 25, "25": 25, "29.97": 25, "30": 25, "59.94": 25, "60": 25 },
              "1080p": { "23.98": 50, "24": 50, "25": 50, "29.97": 50, "30": 50, "59.94": 50, "60": 50 },
              "4K": { "23.98": 150, "24": 150, "25": 150, "29.97": 150, "30": 150, "59.94": 150, "60": 150 }
            }
          },
          {
            "name": "XAVC-I",
            "description": "Intraframe XAVC for professional workflows",
            "bitrates": {
              "720p": { "23.98": 100, "24": 100, "25": 100, "29.97": 100, "30": 100, "59.94": 100, "60": 100 },
              "1080p": { "23.98": 200, "24": 200, "25": 200, "29.97": 200, "30": 200, "59.94": 200, "60": 200 },
              "4K": { "23.98": 600, "24": 600, "25": 600, "29.97": 600, "30": 600, "59.94": 600, "60": 600 }
            }
          },
          {
            "name": "XAVC-HS",
            "description": "High-speed XAVC for slow motion",
            "bitrates": {
              "720p": { "23.98": 50, "24": 50, "25": 50, "29.97": 50, "30": 50, "59.94": 50, "60": 50 },
              "1080p": { "23.98": 100, "24": 100, "25": 100, "29.97": 100, "30": 100, "59.94": 100, "60": 100 },
              "4K": { "23.98": 300, "24": 300, "25": 300, "29.97": 300, "30": 300, "59.94": 300, "60": 300 }
            }
          }
        ]
      },
      {
        "id": "avc_intra",
        "name": "Panasonic AVC-Intra",
        "description": "Panasonic's intraframe codec for professional cameras",
        "workflowNotes": "Used in Panasonic professional cameras. Intraframe compression for easy editing and color grading.",
        "variants": [
          {
            "name": "AVC-Intra 50",
            "description": "Standard quality AVC-Intra",
            "bitrates": {
              "720p": { "23.98": 50, "24": 50, "25": 50, "29.97": 50, "30": 50, "59.94": 50, "60": 50 },
              "1080p": { "23.98": 50, "24": 50, "25": 50, "29.97": 50, "30": 50, "59.94": 50, "60": 50 }
            }
          },
          {
            "name": "AVC-Intra 100",
            "description": "High quality AVC-Intra",
            "bitrates": {
              "720p": { "23.98": 100, "24": 100, "25": 100, "29.97": 100, "30": 100, "59.94": 100, "60": 100 },
              "1080p": { "23.98": 100, "24": 100, "25": 100, "29.97": 100, "30": 100, "59.94": 100, "60": 100 },
              "4K": { "23.98": 400, "24": 400, "25": 400, "29.97": 400, "30": 400, "59.94": 400, "60": 400 }
            }
          },
          {
            "name": "AVC-Intra 200",
            "description": "Highest quality AVC-Intra",
            "bitrates": {
              "720p": { "23.98": 200, "24": 200, "25": 200, "29.97": 200, "30": 200, "59.94": 200, "60": 200 },
              "1080p": { "23.98": 200, "24": 200, "25": 200, "29.97": 200, "30": 200, "59.94": 200, "60": 200 },
              "4K": { "23.98": 800, "24": 800, "25": 800, "29.97": 800, "30": 800, "59.94": 800, "60": 800 }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "raw",
    "name": "RAW & Cinema",
    "description": "Unprocessed and cinema-quality formats for maximum image fidelity",
    "codecs": [
      {
        "id": "prores_raw",
        "name": "ProRes RAW",
        "description": "Apple's RAW format combining RAW flexibility with ProRes efficiency",
        "workflowNotes": "Maintains maximum image quality and color grading flexibility while providing efficient workflows in Final Cut Pro and other NLEs.",
        "variants": [
          {
            "name": "ProRes RAW",
            "description": "Standard ProRes RAW quality",
            "bitrates": {
              "1080p": { "23.98": 500, "24": 500, "25": 500, "29.97": 500, "30": 500, "59.94": 500, "60": 500 },
              "4K": { "23.98": 2000, "24": 2000, "25": 2000, "29.97": 2000, "30": 2000, "59.94": 2000, "60": 2000 },
              "8K": { "23.98": 8000, "24": 8000, "25": 8000, "29.97": 8000, "30": 8000, "59.94": 8000, "60": 8000 }
            }
          },
          {
            "name": "ProRes RAW HQ",
            "description": "High quality ProRes RAW",
            "bitrates": {
              "1080p": { "23.98": 800, "24": 800, "25": 800, "29.97": 800, "30": 800, "59.94": 800, "60": 800 },
              "4K": { "23.98": 3200, "24": 3200, "25": 3200, "29.97": 3200, "30": 3200, "59.94": 3200, "60": 3200 },
              "8K": { "23.98": 12800, "24": 12800, "25": 12800, "29.97": 12800, "30": 12800, "59.94": 12800, "60": 12800 }
            }
          }
        ]
      },
      {
        "id": "braw",
        "name": "Blackmagic RAW",
        "description": "Blackmagic Design's intelligent RAW format",
        "workflowNotes": "Intelligent RAW codec with excellent compression efficiency. Optimized for DaVinci Resolve workflows with real-time playback.",
        "variants": [
          {
            "name": "BRAW Q0",
            "description": "Uncompressed quality (lossless)",
            "bitrates": {
              "1080p": { "23.98": 800, "24": 800, "25": 800, "29.97": 800, "30": 800, "59.94": 800, "60": 800 },
              "4K": { "23.98": 3200, "24": 3200, "25": 3200, "29.97": 3200, "30": 3200, "59.94": 3200, "60": 3200 },
              "8K": { "23.98": 12800, "24": 12800, "25": 12800, "29.97": 12800, "30": 12800, "59.94": 12800, "60": 12800 }
            }
          },
          {
            "name": "BRAW Q5",
            "description": "Visually lossless quality",
            "bitrates": {
              "1080p": { "23.98": 400, "24": 400, "25": 400, "29.97": 400, "30": 400, "59.94": 400, "60": 400 },
              "4K": { "23.98": 1600, "24": 1600, "25": 1600, "29.97": 1600, "30": 1600, "59.94": 1600, "60": 1600 },
              "8K": { "23.98": 6400, "24": 6400, "25": 6400, "29.97": 6400, "30": 6400, "59.94": 6400, "60": 6400 }
            }
          },
          {
            "name": "BRAW 3:1",
            "description": "3:1 compression ratio",
            "bitrates": {
              "1080p": { "23.98": 267, "24": 267, "25": 267, "29.97": 267, "30": 267, "59.94": 267, "60": 267 },
              "4K": { "23.98": 1067, "24": 1067, "25": 1067, "29.97": 1067, "30": 1067, "59.94": 1067, "60": 1067 },
              "8K": { "23.98": 4267, "24": 4267, "25": 4267, "29.97": 4267, "30": 4267, "59.94": 4267, "60": 4267 }
            }
          },
          {
            "name": "BRAW 5:1",
            "description": "5:1 compression ratio",
            "bitrates": {
              "1080p": { "23.98": 160, "24": 160, "25": 160, "29.97": 160, "30": 160, "59.94": 160, "60": 160 },
              "4K": { "23.98": 640, "24": 640, "25": 640, "29.97": 640, "30": 640, "59.94": 640, "60": 640 },
              "8K": { "23.98": 2560, "24": 2560, "25": 2560, "29.97": 2560, "30": 2560, "59.94": 2560, "60": 2560 }
            }
          },
          {
            "name": "BRAW 8:1",
            "description": "8:1 compression ratio",
            "bitrates": {
              "1080p": { "23.98": 100, "24": 100, "25": 100, "29.97": 100, "30": 100, "59.94": 100, "60": 100 },
              "4K": { "23.98": 400, "24": 400, "25": 400, "29.97": 400, "30": 400, "59.94": 400, "60": 400 },
              "8K": { "23.98": 1600, "24": 1600, "25": 1600, "29.97": 1600, "30": 1600, "59.94": 1600, "60": 1600 }
            }
          },
          {
            "name": "BRAW 12:1",
            "description": "12:1 compression ratio",
            "bitrates": {
              "1080p": { "23.98": 67, "24": 67, "25": 67, "29.97": 67, "30": 67, "59.94": 67, "60": 67 },
              "4K": { "23.98": 267, "24": 267, "25": 267, "29.97": 267, "30": 267, "59.94": 267, "60": 267 },
              "8K": { "23.98": 1067, "24": 1067, "25": 1067, "29.97": 1067, "30": 1067, "59.94": 1067, "60": 1067 }
            }
          }
        ]
      },
      {
        "id": "red_r3d",
        "name": "RED R3D",
        "description": "RED Digital Cinema's proprietary RAW format",
        "workflowNotes": "Professional cinema RAW with variable compression ratios. Industry standard for high-end film and commercial production.",
        "variants": [
          {
            "name": "REDCODE RAW 2:1",
            "description": "Highest quality with 2:1 compression",
            "bitrates": {
              "4K": { "23.98": 2400, "24": 2400, "25": 2400, "29.97": 2400, "30": 2400, "59.94": 2400, "60": 2400 },
              "8K": { "23.98": 9600, "24": 9600, "25": 9600, "29.97": 9600, "30": 9600, "59.94": 9600, "60": 9600 }
            }
          },
          {
            "name": "REDCODE RAW 3:1",
            "description": "High quality with 3:1 compression",
            "bitrates": {
              "4K": { "23.98": 1600, "24": 1600, "25": 1600, "29.97": 1600, "30": 1600, "59.94": 1600, "60": 1600 },
              "8K": { "23.98": 6400, "24": 6400, "25": 6400, "29.97": 6400, "30": 6400, "59.94": 6400, "60": 6400 }
            }
          },
          {
            "name": "REDCODE RAW 4:1",
            "description": "Standard quality with 4:1 compression",
            "bitrates": {
              "4K": { "23.98": 1200, "24": 1200, "25": 1200, "29.97": 1200, "30": 1200, "59.94": 1200, "60": 1200 },
              "8K": { "23.98": 4800, "24": 4800, "25": 4800, "29.97": 4800, "30": 4800, "59.94": 4800, "60": 4800 }
            }
          },
          {
            "name": "REDCODE RAW 5:1",
            "description": "Efficient quality with 5:1 compression",
            "bitrates": {
              "4K": { "23.98": 960, "24": 960, "25": 960, "29.97": 960, "30": 960, "59.94": 960, "60": 960 },
              "8K": { "23.98": 3840, "24": 3840, "25": 3840, "29.97": 3840, "30": 3840, "59.94": 3840, "60": 3840 }
            }
          },
          {
            "name": "REDCODE RAW 8:1",
            "description": "Compact quality with 8:1 compression",
            "bitrates": {
              "4K": { "23.98": 600, "24": 600, "25": 600, "29.97": 600, "30": 600, "59.94": 600, "60": 600 },
              "8K": { "23.98": 2400, "24": 2400, "25": 2400, "29.97": 2400, "30": 2400, "59.94": 2400, "60": 2400 }
            }
          }
        ]
      },
      {
        "id": "canon_raw",
        "name": "Canon Cinema RAW",
        "description": "Canon's cinema RAW format for professional cameras",
        "workflowNotes": "Used in Canon's cinema cameras like the C300, C500, and C700 series. Optimized for Canon's color science and workflows.",
        "variants": [
          {
            "name": "Cinema RAW Light",
            "description": "Compressed RAW format for efficient workflows",
            "bitrates": {
              "4K": { "23.98": 1000, "24": 1000, "25": 1000, "29.97": 1000, "30": 1000, "59.94": 1000, "60": 1000 },
              "8K": { "23.98": 4000, "24": 4000, "25": 4000, "29.97": 4000, "30": 4000, "59.94": 4000, "60": 4000 }
            }
          },
          {
            "name": "Cinema RAW ST",
            "description": "Standard RAW format for maximum quality",
            "bitrates": {
              "4K": { "23.98": 2000, "24": 2000, "25": 2000, "29.97": 2000, "30": 2000, "59.94": 2000, "60": 2000 },
              "8K": { "23.98": 8000, "24": 8000, "25": 8000, "29.97": 8000, "30": 8000, "59.94": 8000, "60": 8000 }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "broadcast",
    "name": "Broadcast",
    "description": "Traditional broadcast and legacy formats for television and streaming",
    "codecs": [
      {
        "id": "mpeg2",
        "name": "MPEG-2",
        "description": "Traditional broadcast standard still used in many applications",
        "workflowNotes": "Legacy format widely used in broadcast television, DVD, and satellite transmission. Still relevant for certain broadcast workflows.",
        "variants": [
          {
            "name": "MPEG-2 422P@ML",
            "description": "Main Level 4:2:2 Profile",
            "bitrates": {
              "NTSC": { "29.97": 25 },
              "NTSC_D1": { "29.97": 25 },
              "PAL": { "25": 25 },
              "720p": { "23.98": 25, "24": 25, "25": 25, "29.97": 25, "30": 25, "59.94": 25, "60": 25 },
              "1080i": { "23.98": 25, "24": 25, "25": 25, "29.97": 25, "30": 25, "59.94": 25, "60": 25 }
            }
          },
          {
            "name": "MPEG-2 422P@HL",
            "description": "High Level 4:2:2 Profile",
            "bitrates": {
              "NTSC": { "29.97": 50 },
              "NTSC_D1": { "29.97": 50 },
              "PAL": { "25": 50 },
              "720p": { "23.98": 50, "24": 50, "25": 50, "29.97": 50, "30": 50, "59.94": 50, "60": 50 },
              "1080i": { "23.98": 50, "24": 50, "25": 50, "29.97": 50, "30": 50, "59.94": 50, "60": 50 }
            }
          },
          {
            "name": "MPEG-2 MP@ML",
            "description": "Main Profile at Main Level",
            "bitrates": {
              "NTSC": { "29.97": 15 },
              "NTSC_D1": { "29.97": 15 },
              "PAL": { "25": 15 },
              "720p": { "23.98": 15, "24": 15, "25": 15, "29.97": 15, "30": 15, "59.94": 15, "60": 15 },
              "1080i": { "23.98": 15, "24": 15, "25": 15, "29.97": 15, "30": 15, "59.94": 15, "60": 15 }
            }
          }
        ]
      },
      {
        "id": "jpeg2000",
        "name": "JPEG 2000",
        "description": "Wavelet-based codec for high-end broadcast applications",
        "workflowNotes": "Used in high-end broadcast workflows and digital cinema distribution. Excellent image quality with scalable compression.",
        "variants": [
          {
            "name": "J2K Lossless",
            "description": "Mathematically lossless compression",
            "bitrates": {
              "720p": { "23.98": 400, "24": 400, "25": 400, "29.97": 400, "30": 400, "59.94": 400, "60": 400 },
              "1080p": { "23.98": 800, "24": 800, "25": 800, "29.97": 800, "30": 800, "59.94": 800, "60": 800 },
              "4K": { "23.98": 3200, "24": 3200, "25": 3200, "29.97": 3200, "30": 3200, "59.94": 3200, "60": 3200 }
            }
          },
          {
            "name": "J2K Visually Lossless",
            "description": "Visually lossless compression",
            "bitrates": {
              "720p": { "23.98": 200, "24": 200, "25": 200, "29.97": 200, "30": 200, "59.94": 200, "60": 200 },
              "1080p": { "23.98": 400, "24": 400, "25": 400, "29.97": 400, "30": 400, "59.94": 400, "60": 400 },
              "4K": { "23.98": 1600, "24": 1600, "25": 1600, "29.97": 1600, "30": 1600, "59.94": 1600, "60": 1600 }
            }
          },
          {
            "name": "J2K Lossy",
            "description": "Efficient lossy compression",
            "bitrates": {
              "720p": { "23.98": 100, "24": 100, "25": 100, "29.97": 100, "30": 100, "59.94": 100, "60": 100 },
              "1080p": { "23.98": 200, "24": 200, "25": 200, "29.97": 200, "30": 200, "59.94": 200, "60": 200 },
              "4K": { "23.98": 800, "24": 800, "25": 800, "29.97": 800, "30": 800, "59.94": 800, "60": 800 }
            }
          },
          {
            "name": "J2K IMF 4K",
            "description": "IMF (Interoperable Master Format) for 4K distribution",
            "bitrates": {
              "4K": { "23.98": 250, "24": 250, "25": 250, "29.97": 250, "30": 250, "59.94": 250, "60": 250 }
            }
          }
        ]
      },
      {
        "id": "mxf_d10",
        "name": "MXF D-10 (IMX)",
        "description": "MXF D-10 format for professional broadcast and cinema workflows",
        "workflowNotes": "Used in professional broadcast and cinema workflows. Excellent for high-quality video and audio recording.",
        "variants": [
          {
            "name": "MXF D-10",
            "description": "Standard MXF D-10 format",
            "bitrates": {
              "NTSC": { "29.97": 50 },
              "NTSC_D1": { "29.97": 50 },
              "PAL": { "25": 50 },
              "720p": { "23.98": 100, "24": 100, "25": 100, "29.97": 100, "30": 100, "59.94": 100, "60": 100 },
              "1080p": { "23.98": 100, "24": 100, "25": 100, "29.97": 100, "30": 100, "59.94": 100, "60": 100 },
              "4K": { "23.98": 400, "24": 400, "25": 400, "29.97": 400, "30": 400, "59.94": 400, "60": 400 }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "archival",
    "name": "Archival & Preservation",
    "description": "Formats optimized for long-term preservation and archival storage",
    "codecs": [
      {
        "id": "ffv1",
        "name": "FFV1 (in Matroska/MKV)",
        "description": "Lossless intra-frame codec designed for archival and preservation",
        "workflowNotes": "Preferred by archives for its lossless compression, error resilience, and open specification. Typically stored in Matroska (MKV) container.",
        "variants": [
          {
            "name": "FFV1 Version 3",
            "description": "Most common version for archival use with variable bitrates",
            "bitrates": {
              "NTSC": { "23.98": 80, "24": 80, "25": 80, "29.97": 80, "30": 80 },
              "NTSC_D1": { "23.98": 80, "24": 80, "25": 80, "29.97": 80, "30": 80 },
              "PAL": { "23.98": 80, "24": 80, "25": 80, "29.97": 80, "30": 80 },
              "720p": { "23.98": 200, "24": 200, "25": 200, "29.97": 200, "30": 200, "59.94": 200, "60": 200 },
              "1080p": { "23.98": 400, "24": 400, "25": 400, "29.97": 400, "30": 400, "59.94": 400, "60": 400 },
              "4K": { "23.98": 1600, "24": 1600, "25": 1600, "29.97": 1600, "30": 1600, "59.94": 1600, "60": 1600 }
            }
          }
        ]
      },
      {
        "id": "uncompressed",
        "name": "Uncompressed Video",
        "description": "Raw uncompressed video for maximum quality preservation",
        "workflowNotes": "Used for master archival copies where storage space is not a concern. Provides bit-perfect preservation of original content.",
        "variants": [
          {
            "name": "10-bit 4:2:2",
            "description": "Professional 10-bit 4:2:2 uncompressed",
            "bitrates": {
              "NTSC": { "23.98": 498, "24": 498, "25": 498, "29.97": 498, "30": 498 },
              "NTSC_D1": { "23.98": 498, "24": 498, "25": 498, "29.97": 498, "30": 498 },
              "PAL": { "23.98": 498, "24": 498, "25": 498, "29.97": 498, "30": 498 },
              "720p": { "23.98": 1244, "24": 1244, "25": 1244, "29.97": 1244, "30": 1244, "59.94": 1244, "60": 1244 },
              "1080p": { "23.98": 2488, "24": 2488, "25": 2488, "29.97": 2488, "30": 2488, "59.94": 2488, "60": 2488 },
              "4K": { "23.98": 9953, "24": 9953, "25": 9953, "29.97": 9953, "30": 9953, "59.94": 9953, "60": 9953 }
            }
          },
          {
            "name": "8-bit 4:2:2",
            "description": "Standard 8-bit 4:2:2 uncompressed",
            "bitrates": {
              "NTSC": { "23.98": 398, "24": 398, "25": 398, "29.97": 398, "30": 398 },
              "NTSC_D1": { "23.98": 398, "24": 398, "25": 398, "29.97": 398, "30": 398 },
              "PAL": { "23.98": 398, "24": 398, "25": 398, "29.97": 398, "30": 398 },
              "720p": { "23.98": 995, "24": 995, "25": 995, "29.97": 995, "30": 995, "59.94": 995, "60": 995 },
              "1080p": { "23.98": 1990, "24": 1990, "25": 1990, "29.97": 1990, "30": 1990, "59.94": 1990, "60": 1990 },
              "4K": { "23.98": 7962, "24": 7962, "25": 7962, "29.97": 7962, "30": 7962, "59.94": 7962, "60": 7962 }
            }
          }
        ]
      },
      {
        "id": "lossless_jpeg2000",
        "name": "Lossless JPEG 2000",
        "description": "Mathematically lossless JPEG 2000 for archival applications",
        "workflowNotes": "Provides lossless compression with better efficiency than uncompressed while maintaining mathematical integrity for archival purposes.",
        "variants": [
          {
            "name": "Lossless J2K",
            "description": "Mathematically lossless JPEG 2000",
            "bitrates": {
              "NTSC": { "23.98": 240, "24": 240, "25": 240, "29.97": 240, "30": 240 },
              "NTSC_D1": { "23.98": 240, "24": 240, "25": 240, "29.97": 240, "30": 240 },
              "PAL": { "23.98": 240, "24": 240, "25": 240, "29.97": 240, "30": 240 },
              "720p": { "23.98": 600, "24": 600, "25": 600, "29.97": 600, "30": 600, "59.94": 600, "60": 600 },
              "1080p": { "23.98": 1200, "24": 1200, "25": 1200, "29.97": 1200, "30": 1200, "59.94": 1200, "60": 1200 },
              "4K": { "23.98": 4800, "24": 4800, "25": 4800, "29.97": 4800, "30": 4800, "59.94": 4800, "60": 4800 }
            }
          }
        ]
      }
    ]
  }
];