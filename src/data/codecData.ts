import { CodecCategory } from '../context/CodecContext';

// Comprehensive codec database - embedded directly to ensure deployment consistency
export const defaultCodecData: CodecCategory[] = [
  {
    "id": "broadcast",
    "name": "Broadcast",
    "description": "Professional broadcast and television standards",
    "codecs": [
      {
        "id": "jpeg2000",
        "name": "JPEG 2000",
        "description": "High-quality broadcast codec for professional workflows",
        "workflowNotes": "Used in broadcast and digital cinema applications",
        "variants": [
          {
            "name": "J2K IMF 4K",
            "description": "JPEG 2000 Interoperable Master Format for 4K content",
            "bitrates": {
              "4K": {
                "24": 250,
                "25": 250,
                "30": 250,
                "23.98": 250,
                "29.97": 250
              }
            }
          },
          {
            "name": "J2K Lossless",
            "description": "Lossless JPEG 2000 for archival and mastering",
            "bitrates": {
              "1080i": {
                "25": 800,
                "30": 800,
                "50": 800,
                "60": 800,
                "29.97": 800,
                "59.94": 800
              },
              "1080p": {
                "24": 800,
                "25": 800,
                "30": 800,
                "60": 800,
                "23.98": 800,
                "29.97": 800,
                "59.94": 800
              },
              "4K": {
                "24": 3200,
                "25": 3200,
                "30": 3200,
                "60": 3200,
                "23.98": 3200,
                "29.97": 3200,
                "59.94": 3200
              }
            }
          },
          {
            "name": "J2K Visually Lossless",
            "description": "Visually lossless JPEG 2000 for high-quality production",
            "bitrates": {
              "720p": {
                "24": 200,
                "25": 200,
                "30": 200,
                "23.98": 200
              },
              "1080p": {
                "24": 400,
                "25": 400,
                "30": 400,
                "23.98": 400
              },
              "4K": {
                "24": 1600,
                "25": 1600,
                "30": 1600,
                "23.98": 1600
              }
            }
          }
        ]
      },
      {
        "id": "mpeg2",
        "name": "MPEG-2",
        "description": "Legacy broadcast standard still widely used",
        "workflowNotes": "Standard for broadcast television and DVD",
        "variants": [
          {
            "name": "MPEG-2 422P@HL",
            "description": "4:2:2 Profile at High Level",
            "bitrates": {
              "NTSC": {
                "29.97": 50,
                "59.94": 70
              },
              "PAL": {
                "25": 50,
                "50": 70
              },
              "720p": {
                "24": 50,
                "25": 50,
                "30": 50,
                "60": 70,
                "23.98": 50,
                "29.97": 50,
                "59.94": 70
              },
              "1080i": {
                "25": 50,
                "30": 50,
                "50": 70,
                "60": 70,
                "29.97": 50,
                "59.94": 70
              }
            }
          },
          {
            "name": "MPEG-2 422P@ML",
            "description": "4:2:2 Profile at Main Level",
            "bitrates": {
              "NTSC": {
                "29.97": 25,
                "59.94": 35
              },
              "PAL": {
                "25": 25,
                "50": 35
              },
              "720p": {
                "24": 25,
                "25": 25,
                "30": 25,
                "60": 35,
                "23.98": 25,
                "29.97": 25,
                "59.94": 35
              },
              "1080i": {
                "25": 25,
                "30": 25,
                "50": 35,
                "60": 35,
                "29.97": 25,
                "59.94": 35
              }
            }
          },
          {
            "name": "MPEG-2 MP@ML",
            "description": "Main Profile at Main Level",
            "bitrates": {
              "NTSC": {
                "29.97": 15,
                "59.94": 20
              },
              "PAL": {
                "25": 15,
                "50": 20
              },
              "720p": {
                "24": 15,
                "25": 15,
                "30": 15,
                "60": 20,
                "23.98": 15,
                "29.97": 15,
                "59.94": 20
              },
              "1080i": {
                "25": 15,
                "30": 15,
                "50": 20,
                "60": 20,
                "29.97": 15,
                "59.94": 20
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "camera",
    "name": "Camera Acquisition",
    "description": "Camera-native recording formats",
    "codecs": [
      {
        "id": "avc-intra",
        "name": "Panasonic AVC-Intra",
        "description": "Panasonic's professional intraframe codec",
        "workflowNotes": "Used in Panasonic professional cameras",
        "variants": [
          {
            "name": "AVC-Intra 50",
            "description": "50 Mbps variant for efficient recording",
            "bitrates": {
              "1080i": {
                "25": 50,
                "30": 50,
                "50": 50,
                "60": 50,
                "29.97": 50,
                "59.94": 50
              },
              "1080p": {
                "24": 50,
                "25": 50,
                "30": 50,
                "60": 50,
                "23.98": 50,
                "29.97": 50,
                "59.94": 50
              }
            }
          },
          {
            "name": "AVC-Intra 100",
            "description": "100 Mbps variant for higher quality",
            "bitrates": {
              "1080i": {
                "25": 100,
                "30": 100,
                "50": 100,
                "60": 100,
                "29.97": 100,
                "59.94": 100
              },
              "1080p": {
                "24": 100,
                "25": 100,
                "30": 100,
                "60": 100,
                "23.98": 100,
                "29.97": 100,
                "59.94": 100
              }
            }
          },
          {
            "name": "AVC-Intra 200",
            "description": "200 Mbps variant for premium quality",
            "bitrates": {
              "1080i": {
                "25": 200,
                "30": 200,
                "50": 200,
                "60": 200,
                "29.97": 200,
                "59.94": 200
              },
              "1080p": {
                "24": 200,
                "25": 200,
                "30": 200,
                "60": 200,
                "23.98": 200,
                "29.97": 200,
                "59.94": 200
              }
            }
          }
        ]
      },
      {
        "id": "xavc",
        "name": "Sony XAVC",
        "description": "Sony's professional recording format",
        "workflowNotes": "Used in Sony professional cameras and recorders",
        "variants": [
          {
            "name": "XAVC-L",
            "description": "Long GOP variant for efficient recording",
            "bitrates": {
              "1080i": {
                "25": 50,
                "30": 50,
                "50": 50,
                "60": 50,
                "29.97": 50,
                "59.94": 50
              },
              "1080p": {
                "24": 50,
                "25": 50,
                "30": 50,
                "60": 50,
                "23.98": 50,
                "29.97": 50,
                "59.94": 50
              },
              "4K": {
                "24": 100,
                "25": 100,
                "30": 100,
                "60": 100,
                "23.98": 100,
                "29.97": 100,
                "59.94": 100
              }
            }
          },
          {
            "name": "XAVC-I",
            "description": "Intraframe variant for professional workflows",
            "bitrates": {
              "1080i": {
                "25": 200,
                "30": 200,
                "50": 200,
                "60": 200,
                "29.97": 200,
                "59.94": 200
              },
              "1080p": {
                "24": 200,
                "25": 200,
                "30": 200,
                "60": 200,
                "23.98": 200,
                "29.97": 200,
                "59.94": 200
              },
              "4K": {
                "24": 400,
                "25": 400,
                "30": 400,
                "60": 400,
                "23.98": 400,
                "29.97": 400,
                "59.94": 400
              }
            }
          },
          {
            "name": "XAVC-HS",
            "description": "High efficiency variant using H.265",
            "bitrates": {
              "1080p": {
                "24": 100,
                "25": 100,
                "30": 100,
                "23.98": 100
              },
              "4K": {
                "24": 200,
                "25": 200,
                "30": 200,
                "23.98": 200
              }
            }
          }
        ]
      },
      {
        "id": "xdcam",
        "name": "Sony XDCAM",
        "description": "Sony's professional disc-based format",
        "workflowNotes": "Legacy professional format still in use",
        "variants": [
          {
            "name": "XDCAM EX",
            "description": "Extended definition variant",
            "bitrates": {
              "1080i": {
                "25": 18,
                "30": 18,
                "50": 18,
                "60": 18,
                "29.97": 18,
                "59.94": 18
              }
            }
          },
          {
            "name": "XDCAM HD",
            "description": "High definition variant",
            "bitrates": {
              "1080i": {
                "25": 25,
                "30": 25,
                "50": 25,
                "60": 25,
                "29.97": 25,
                "59.94": 25
              }
            }
          },
          {
            "name": "XDCAM HD422",
            "description": "4:2:2 sampling variant",
            "bitrates": {
              "1080i": {
                "25": 50,
                "30": 50,
                "50": 50,
                "60": 50,
                "29.97": 50,
                "59.94": 50
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "delivery",
    "name": "Delivery & Streaming",
    "description": "Codecs optimized for streaming and delivery",
    "codecs": [
      {
        "id": "h264",
        "name": "H.264 (AVC)",
        "description": "Widely supported delivery codec",
        "workflowNotes": "Standard for web delivery and streaming",
        "variants": [
          {
            "name": "Baseline Profile",
            "description": "Basic profile for maximum compatibility",
            "bitrates": {
              "720p": {
                "24": 5,
                "25": 5,
                "30": 5,
                "60": 8,
                "23.98": 5,
                "29.97": 5,
                "59.94": 8
              },
              "1080i": {
                "25": 8,
                "30": 8,
                "50": 12,
                "60": 12,
                "29.97": 8,
                "59.94": 12
              },
              "1080p": {
                "24": 8,
                "25": 8,
                "30": 8,
                "60": 12,
                "23.98": 8,
                "29.97": 8,
                "59.94": 12
              },
              "4K": {
                "24": 25,
                "25": 25,
                "30": 25,
                "60": 35,
                "23.98": 25,
                "29.97": 25,
                "59.94": 35
              }
            }
          },
          {
            "name": "Main Profile",
            "description": "Standard profile for most applications",
            "bitrates": {
              "720p": {
                "24": 6,
                "25": 6,
                "30": 6,
                "60": 9,
                "23.98": 6,
                "29.97": 6,
                "59.94": 9
              },
              "1080i": {
                "25": 10,
                "30": 10,
                "50": 15,
                "60": 15,
                "29.97": 10,
                "59.94": 15
              },
              "1080p": {
                "24": 10,
                "25": 10,
                "30": 10,
                "60": 15,
                "23.98": 10,
                "29.97": 10,
                "59.94": 15
              },
              "4K": {
                "24": 30,
                "25": 30,
                "30": 30,
                "60": 45,
                "23.98": 30,
                "29.97": 30,
                "59.94": 45
              }
            }
          },
          {
            "name": "High Profile",
            "description": "Advanced profile for high quality",
            "bitrates": {
              "720p": {
                "24": 8,
                "25": 8,
                "30": 8,
                "60": 12,
                "23.98": 8,
                "29.97": 8,
                "59.94": 12
              },
              "1080i": {
                "25": 15,
                "30": 15,
                "50": 22,
                "60": 22,
                "29.97": 15,
                "59.94": 22
              },
              "1080p": {
                "24": 15,
                "25": 15,
                "30": 15,
                "60": 22,
                "23.98": 15,
                "29.97": 15,
                "59.94": 22
              },
              "4K": {
                "24": 45,
                "25": 45,
                "30": 45,
                "60": 65,
                "23.98": 45,
                "29.97": 45,
                "59.94": 65
              }
            }
          }
        ]
      },
      {
        "id": "h265",
        "name": "H.265 (HEVC)",
        "description": "Next-generation delivery codec with improved efficiency",
        "workflowNotes": "50% more efficient than H.264",
        "variants": [
          {
            "name": "Main Profile",
            "description": "Standard HEVC profile",
            "bitrates": {
              "720p": {
                "24": 2.5,
                "25": 2.5,
                "30": 2.5,
                "60": 3.5,
                "23.98": 2.5,
                "29.97": 2.5,
                "59.94": 3.5
              },
              "1080p": {
                "24": 5,
                "25": 5,
                "30": 5,
                "60": 7,
                "23.98": 5,
                "29.97": 5,
                "59.94": 7
              },
              "4K": {
                "24": 15,
                "25": 15,
                "30": 15,
                "60": 20,
                "23.98": 15,
                "29.97": 15,
                "59.94": 20
              },
              "8K": {
                "24": 50,
                "25": 50,
                "30": 50,
                "60": 65,
                "23.98": 50,
                "29.97": 50,
                "59.94": 65
              }
            }
          },
          {
            "name": "Main 10",
            "description": "10-bit HEVC profile",
            "bitrates": {
              "720p": {
                "24": 3,
                "25": 3,
                "30": 3,
                "60": 4,
                "23.98": 3,
                "29.97": 3,
                "59.94": 4
              },
              "1080p": {
                "24": 6,
                "25": 6,
                "30": 6,
                "60": 8,
                "23.98": 6,
                "29.97": 6,
                "59.94": 8
              },
              "4K": {
                "24": 18,
                "25": 18,
                "30": 18,
                "60": 24,
                "23.98": 18,
                "29.97": 18,
                "59.94": 24
              },
              "8K": {
                "24": 60,
                "25": 60,
                "30": 60,
                "60": 75,
                "23.98": 60,
                "29.97": 60,
                "59.94": 75
              }
            }
          },
          {
            "name": "Main 4:2:2 10",
            "description": "10-bit 4:2:2 HEVC profile",
            "bitrates": {
              "720p": {
                "24": 4,
                "25": 4,
                "30": 4,
                "60": 5,
                "23.98": 4,
                "29.97": 4,
                "59.94": 5
              },
              "1080p": {
                "24": 8,
                "25": 8,
                "30": 8,
                "60": 10,
                "23.98": 8,
                "29.97": 8,
                "59.94": 10
              },
              "4K": {
                "24": 25,
                "25": 25,
                "30": 25,
                "60": 30,
                "23.98": 25,
                "29.97": 25,
                "59.94": 30
              },
              "8K": {
                "24": 80,
                "25": 80,
                "30": 80,
                "60": 100,
                "23.98": 80,
                "29.97": 80,
                "59.94": 100
              }
            }
          }
        ]
      },
      {
        "id": "av1",
        "name": "AV1",
        "description": "Royalty-free next-generation codec",
        "workflowNotes": "Open source alternative to HEVC",
        "variants": [
          {
            "name": "Main Profile",
            "description": "Standard AV1 profile",
            "bitrates": {
              "720p": {
                "24": 2,
                "25": 2,
                "30": 2,
                "60": 3,
                "23.98": 2,
                "29.97": 2,
                "59.94": 3
              },
              "1080p": {
                "24": 4,
                "25": 4,
                "30": 4,
                "60": 5,
                "23.98": 4,
                "29.97": 4,
                "59.94": 5
              },
              "4K": {
                "24": 12,
                "25": 12,
                "30": 12,
                "60": 16,
                "23.98": 12,
                "29.97": 12,
                "59.94": 16
              },
              "8K": {
                "24": 40,
                "25": 40,
                "30": 40,
                "60": 50,
                "23.98": 40,
                "29.97": 40,
                "59.94": 50
              }
            }
          },
          {
            "name": "High Profile",
            "description": "High quality AV1 profile",
            "bitrates": {
              "720p": {
                "24": 2.5,
                "25": 2.5,
                "30": 2.5,
                "60": 3.5,
                "23.98": 2.5,
                "29.97": 2.5,
                "59.94": 3.5
              },
              "1080p": {
                "24": 5,
                "25": 5,
                "30": 5,
                "60": 7,
                "23.98": 5,
                "29.97": 5,
                "59.94": 7
              },
              "4K": {
                "24": 15,
                "25": 15,
                "30": 15,
                "60": 20,
                "23.98": 15,
                "29.97": 15,
                "59.94": 20
              },
              "8K": {
                "24": 50,
                "25": 50,
                "30": 50,
                "60": 65,
                "23.98": 50,
                "29.97": 50,
                "59.94": 65
              }
            }
          },
          {
            "name": "Professional Profile",
            "description": "Professional AV1 profile",
            "bitrates": {
              "720p": {
                "24": 3,
                "25": 3,
                "30": 3,
                "60": 4,
                "23.98": 3,
                "29.97": 3,
                "59.94": 4
              },
              "1080p": {
                "24": 6,
                "25": 6,
                "30": 6,
                "60": 8,
                "23.98": 6,
                "29.97": 6,
                "59.94": 8
              },
              "4K": {
                "24": 18,
                "25": 18,
                "30": 18,
                "60": 24,
                "23.98": 18,
                "29.97": 18,
                "59.94": 24
              },
              "8K": {
                "24": 60,
                "25": 60,
                "30": 60,
                "60": 75,
                "23.98": 60,
                "29.97": 60,
                "59.94": 75
              }
            }
          }
        ]
      },
      {
        "id": "vp9",
        "name": "VP9",
        "description": "Google's open source codec",
        "workflowNotes": "Used by YouTube and other Google services",
        "variants": [
          {
            "name": "Profile 0",
            "description": "8-bit 4:2:0 profile",
            "bitrates": {
              "720p": {
                "24": 2.5,
                "25": 2.5,
                "30": 2.5,
                "60": 3.5,
                "23.98": 2.5,
                "29.97": 2.5,
                "59.94": 3.5
              },
              "1080p": {
                "24": 5,
                "25": 5,
                "30": 5,
                "60": 7,
                "23.98": 5,
                "29.97": 5,
                "59.94": 7
              },
              "4K": {
                "24": 18,
                "25": 18,
                "30": 18,
                "60": 24,
                "23.98": 18,
                "29.97": 18,
                "59.94": 24
              },
              "8K": {
                "24": 60,
                "25": 60,
                "30": 60,
                "60": 75,
                "23.98": 60,
                "29.97": 60,
                "59.94": 75
              }
            }
          },
          {
            "name": "Profile 2",
            "description": "10-bit 4:2:0 profile",
            "bitrates": {
              "720p": {
                "24": 3,
                "25": 3,
                "30": 3,
                "60": 4,
                "23.98": 3,
                "29.97": 3,
                "59.94": 4
              },
              "1080p": {
                "24": 6,
                "25": 6,
                "30": 6,
                "60": 8,
                "23.98": 6,
                "29.97": 6,
                "59.94": 8
              },
              "4K": {
                "24": 22,
                "25": 22,
                "30": 22,
                "60": 28,
                "23.98": 22,
                "29.97": 22,
                "59.94": 28
              },
              "8K": {
                "24": 75,
                "25": 75,
                "30": 75,
                "60": 90,
                "23.98": 75,
                "29.97": 75,
                "59.94": 90
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "professional",
    "name": "Professional Intermediate",
    "description": "High-quality intermediate codecs for post-production",
    "codecs": [
      {
        "id": "prores",
        "name": "Apple ProRes",
        "description": "Apple's professional intermediate codec",
        "workflowNotes": "Industry standard for post-production workflows",
        "variants": [
          {
            "name": "ProRes 422 Proxy",
            "description": "Lowest quality for offline editing",
            "bitrates": {
              "720p": {
                "24": 45,
                "25": 45,
                "30": 45,
                "60": 67,
                "23.98": 45,
                "29.97": 45,
                "59.94": 67
              },
              "1080i": {
                "25": 45,
                "30": 45,
                "50": 67,
                "60": 67,
                "29.97": 45,
                "59.94": 67
              },
              "1080p": {
                "24": 45,
                "25": 45,
                "30": 45,
                "60": 67,
                "23.98": 45,
                "29.97": 45,
                "59.94": 67
              },
              "4K": {
                "24": 180,
                "25": 180,
                "30": 180,
                "60": 270,
                "23.98": 180,
                "29.97": 180,
                "59.94": 270
              }
            }
          },
          {
            "name": "ProRes 422 LT",
            "description": "Lower quality for space-constrained workflows",
            "bitrates": {
              "1080i": {
                "25": 85,
                "30": 85,
                "50": 127,
                "60": 127,
                "29.97": 85,
                "59.94": 127
              },
              "1080p": {
                "24": 85,
                "25": 85,
                "30": 102,
                "60": 127,
                "23.98": 82,
                "29.97": 85,
                "59.94": 127
              },
              "4K": {
                "24": 340,
                "25": 340,
                "30": 408,
                "60": 508,
                "23.98": 328,
                "29.97": 340,
                "59.94": 508
              }
            }
          },
          {
            "name": "ProRes 422",
            "description": "Standard quality for most workflows",
            "bitrates": {
              "1080i": {
                "25": 122,
                "30": 122,
                "50": 183,
                "60": 183,
                "29.97": 122,
                "59.94": 183
              },
              "1080p": {
                "24": 122,
                "25": 122,
                "30": 147,
                "60": 183,
                "23.98": 117,
                "29.97": 122,
                "59.94": 183
              },
              "4K": {
                "24": 488,
                "25": 488,
                "30": 588,
                "60": 732,
                "23.98": 468,
                "29.97": 488,
                "59.94": 732
              }
            }
          },
          {
            "name": "ProRes 422 HQ",
            "description": "Higher quality for demanding workflows",
            "bitrates": {
              "1080i": {
                "25": 184,
                "30": 184,
                "50": 275,
                "60": 275,
                "29.97": 184,
                "59.94": 275
              },
              "1080p": {
                "24": 184,
                "25": 184,
                "30": 220,
                "60": 275,
                "23.98": 176,
                "29.97": 184,
                "59.94": 275
              },
              "4K": {
                "24": 736,
                "25": 736,
                "30": 880,
                "60": 1100,
                "23.98": 704,
                "29.97": 736,
                "59.94": 1100
              }
            }
          },
          {
            "name": "ProRes 4444",
            "description": "Highest quality with alpha channel support",
            "bitrates": {
              "1080i": {
                "25": 275,
                "30": 275,
                "50": 412,
                "60": 412,
                "29.97": 275,
                "59.94": 412
              },
              "1080p": {
                "24": 275,
                "25": 275,
                "30": 440,
                "60": 412,
                "23.98": 275,
                "29.97": 275,
                "59.94": 412
              },
              "4K": {
                "24": 1100,
                "25": 1100,
                "30": 1760,
                "60": 1648,
                "23.98": 1100,
                "29.97": 1100,
                "59.94": 1648
              }
            }
          }
        ]
      },
      {
        "id": "dnxhd",
        "name": "Avid DNxHD/HR",
        "description": "Avid's professional intermediate codec",
        "workflowNotes": "Standard in Avid workflows and broadcast",
        "variants": [
          {
            "name": "DNxHD 36",
            "description": "Lowest quality for offline editing",
            "bitrates": {
              "1080i": {
                "25": 36,
                "30": 36,
                "50": 36,
                "60": 36,
                "29.97": 36,
                "59.94": 36
              }
            }
          },
          {
            "name": "DNxHD 145",
            "description": "Standard quality for most workflows",
            "bitrates": {
              "1080i": {
                "25": 145,
                "30": 145,
                "50": 145,
                "60": 145,
                "29.97": 145,
                "59.94": 145
              },
              "1080p": {
                "24": 145,
                "25": 145,
                "30": 145,
                "60": 145,
                "23.98": 145,
                "29.97": 145,
                "59.94": 145
              }
            }
          },
          {
            "name": "DNxHD 220",
            "description": "Higher quality for demanding workflows",
            "bitrates": {
              "1080i": {
                "25": 220,
                "30": 220,
                "50": 220,
                "60": 220,
                "29.97": 220,
                "59.94": 220
              },
              "1080p": {
                "24": 220,
                "25": 220,
                "30": 220,
                "60": 220,
                "23.98": 220,
                "29.97": 220,
                "59.94": 220
              }
            }
          },
          {
            "name": "DNxHR LB",
            "description": "Low bandwidth for 4K workflows",
            "bitrates": {
              "1080i": {
                "25": 36,
                "30": 36,
                "50": 36,
                "60": 36,
                "29.97": 36,
                "59.94": 36
              },
              "1080p": {
                "24": 36,
                "25": 36,
                "30": 36,
                "60": 36,
                "23.98": 36,
                "29.97": 36,
                "59.94": 36
              },
              "4K": {
                "24": 144,
                "25": 144,
                "30": 144,
                "60": 144,
                "23.98": 144,
                "29.97": 144,
                "59.94": 144
              }
            }
          },
          {
            "name": "DNxHR SQ",
            "description": "Standard quality for 4K workflows",
            "bitrates": {
              "1080i": {
                "25": 145,
                "30": 145,
                "50": 145,
                "60": 145,
                "29.97": 145,
                "59.94": 145
              },
              "1080p": {
                "24": 145,
                "25": 145,
                "30": 145,
                "60": 145,
                "23.98": 145,
                "29.97": 145,
                "59.94": 145
              },
              "4K": {
                "24": 580,
                "25": 580,
                "30": 580,
                "60": 580,
                "23.98": 580,
                "29.97": 580,
                "59.94": 580
              }
            }
          },
          {
            "name": "DNxHR HQ",
            "description": "High quality for 4K workflows",
            "bitrates": {
              "1080i": {
                "25": 220,
                "30": 220,
                "50": 220,
                "60": 220,
                "29.97": 220,
                "59.94": 220
              },
              "1080p": {
                "24": 220,
                "25": 220,
                "30": 220,
                "60": 220,
                "23.98": 220,
                "29.97": 220,
                "59.94": 220
              },
              "4K": {
                "24": 880,
                "25": 880,
                "30": 880,
                "60": 880,
                "23.98": 880,
                "29.97": 880,
                "59.94": 880
              }
            }
          },
          {
            "name": "DNxHR HQX",
            "description": "Highest quality for 4K workflows",
            "bitrates": {
              "1080p": {
                "24": 440,
                "30": 440,
                "23.98": 440
              },
              "4K": {
                "24": 1760,
                "30": 1760,
                "23.98": 1760
              }
            }
          },
          {
            "name": "DNxHR 444",
            "description": "4:4:4 sampling for highest quality",
            "bitrates": {
              "1080p": {
                "24": 350,
                "30": 350,
                "23.98": 350
              },
              "4K": {
                "24": 1400,
                "30": 1400,
                "23.98": 1400
              }
            }
          }
        ]
      },
      {
        "id": "cineform",
        "name": "GoPro CineForm",
        "description": "Wavelet-based intermediate codec",
        "workflowNotes": "Good for VFX and color grading workflows",
        "variants": [
          {
            "name": "CineForm Low",
            "description": "Lowest quality setting",
            "bitrates": {
              "720p": {
                "24": 40,
                "25": 40,
                "30": 40,
                "60": 60,
                "23.98": 40,
                "29.97": 40,
                "59.94": 60
              },
              "1080p": {
                "24": 90,
                "25": 90,
                "30": 90,
                "60": 135,
                "23.98": 90,
                "29.97": 90,
                "59.94": 135
              },
              "4K": {
                "24": 360,
                "25": 360,
                "30": 360,
                "60": 540,
                "23.98": 360,
                "29.97": 360,
                "59.94": 540
              }
            }
          },
          {
            "name": "CineForm Medium",
            "description": "Medium quality setting",
            "bitrates": {
              "720p": {
                "24": 80,
                "25": 80,
                "30": 80,
                "60": 120,
                "23.98": 80,
                "29.97": 80,
                "59.94": 120
              },
              "1080p": {
                "24": 180,
                "25": 180,
                "30": 180,
                "60": 270,
                "23.98": 180,
                "29.97": 180,
                "59.94": 270
              },
              "4K": {
                "24": 720,
                "25": 720,
                "30": 720,
                "60": 1080,
                "23.98": 720,
                "29.97": 720,
                "59.94": 1080
              }
            }
          },
          {
            "name": "CineForm High",
            "description": "High quality setting",
            "bitrates": {
              "720p": {
                "24": 120,
                "25": 120,
                "30": 120,
                "60": 180,
                "23.98": 120,
                "29.97": 120,
                "59.94": 180
              },
              "1080p": {
                "24": 270,
                "25": 270,
                "30": 270,
                "60": 405,
                "23.98": 270,
                "29.97": 270,
                "59.94": 405
              },
              "4K": {
                "24": 1080,
                "25": 1080,
                "30": 1080,
                "60": 1620,
                "23.98": 1080,
                "29.97": 1080,
                "59.94": 1620
              }
            }
          },
          {
            "name": "CineForm Film Scan",
            "description": "Highest quality for film scanning",
            "bitrates": {
              "720p": {
                "24": 180,
                "25": 180,
                "30": 180,
                "60": 270,
                "23.98": 180,
                "29.97": 180,
                "59.94": 270
              },
              "1080p": {
                "24": 400,
                "25": 400,
                "30": 400,
                "60": 600,
                "23.98": 400,
                "29.97": 400,
                "59.94": 600
              },
              "4K": {
                "24": 1600,
                "25": 1600,
                "30": 1600,
                "60": 2400,
                "23.98": 1600,
                "29.97": 1600,
                "59.94": 2400
              }
            }
          }
        ]
      }
    ]
  },
  {
    "id": "raw",
    "name": "RAW & Cinema",
    "description": "Uncompressed and lightly compressed RAW formats",
    "codecs": [
      {
        "id": "braw",
        "name": "Blackmagic RAW",
        "description": "Blackmagic's RAW format with intelligent compression",
        "workflowNotes": "Excellent for color grading and post-production",
        "variants": [
          {
            "name": "BRAW Q0",
            "description": "Highest quality constant quality",
            "bitrates": {
              "1080p": {
                "24": 800,
                "25": 800,
                "30": 800,
                "60": 1200,
                "23.98": 800,
                "29.97": 800,
                "59.94": 1200
              },
              "4K": {
                "24": 3200,
                "25": 3200,
                "30": 3200,
                "60": 4800,
                "23.98": 3200,
                "29.97": 3200,
                "59.94": 4800
              },
              "8K": {
                "24": 12800,
                "25": 12800,
                "30": 12800,
                "60": 19200,
                "23.98": 12800,
                "29.97": 12800,
                "59.94": 19200
              }
            }
          },
          {
            "name": "BRAW Q5",
            "description": "High quality constant quality",
            "bitrates": {
              "1080p": {
                "24": 400,
                "25": 400,
                "30": 400,
                "60": 600,
                "23.98": 400,
                "29.97": 400,
                "59.94": 600
              },
              "4K": {
                "24": 1600,
                "25": 1600,
                "30": 1600,
                "60": 2400,
                "23.98": 1600,
                "29.97": 1600,
                "59.94": 2400
              },
              "8K": {
                "24": 6400,
                "25": 6400,
                "30": 6400,
                "60": 9600,
                "23.98": 6400,
                "29.97": 6400,
                "59.94": 9600
              }
            }
          },
          {
            "name": "BRAW 3:1",
            "description": "3:1 compression ratio",
            "bitrates": {
              "1080p": {
                "24": 267,
                "25": 267,
                "30": 267,
                "60": 400,
                "23.98": 267,
                "29.97": 267,
                "59.94": 400
              },
              "4K": {
                "24": 1067,
                "25": 1067,
                "30": 1067,
                "60": 1600,
                "23.98": 1067,
                "29.97": 1067,
                "59.94": 1600
              },
              "8K": {
                "24": 4267,
                "25": 4267,
                "30": 4267,
                "60": 6400,
                "23.98": 4267,
                "29.97": 4267,
                "59.94": 6400
              }
            }
          },
          {
            "name": "BRAW 5:1",
            "description": "5:1 compression ratio",
            "bitrates": {
              "1080p": {
                "24": 160,
                "25": 160,
                "30": 160,
                "60": 240,
                "23.98": 160,
                "29.97": 160,
                "59.94": 240
              },
              "4K": {
                "24": 640,
                "25": 640,
                "30": 640,
                "60": 960,
                "23.98": 640,
                "29.97": 640,
                "59.94": 960
              },
              "8K": {
                "24": 2560,
                "25": 2560,
                "30": 2560,
                "60": 3840,
                "23.98": 2560,
                "29.97": 2560,
                "59.94": 3840
              }
            }
          },
          {
            "name": "BRAW 8:1",
            "description": "8:1 compression ratio",
            "bitrates": {
              "1080p": {
                "24": 100,
                "25": 100,
                "30": 100,
                "60": 150,
                "23.98": 100,
                "29.97": 100,
                "59.94": 150
              },
              "4K": {
                "24": 400,
                "25": 400,
                "30": 400,
                "60": 600,
                "23.98": 400,
                "29.97": 400,
                "59.94": 600
              },
              "8K": {
                "24": 1600,
                "25": 1600,
                "30": 1600,
                "60": 2400,
                "23.98": 1600,
                "29.97": 1600,
                "59.94": 2400
              }
            }
          },
          {
            "name": "BRAW 12:1",
            "description": "12:1 compression ratio",
            "bitrates": {
              "1080p": {
                "24": 67,
                "25": 67,
                "30": 67,
                "60": 100,
                "23.98": 67,
                "29.97": 67,
                "59.94": 100
              },
              "4K": {
                "24": 267,
                "25": 267,
                "30": 267,
                "60": 400,
                "23.98": 267,
                "29.97": 267,
                "59.94": 400
              },
              "8K": {
                "24": 1067,
                "25": 1067,
                "30": 1067,
                "60": 1600,
                "23.98": 1067,
                "29.97": 1067,
                "59.94": 1600
              }
            }
          }
        ]
      },
      {
        "id": "prores-raw",
        "name": "ProRes RAW",
        "description": "Apple's RAW format for professional workflows",
        "workflowNotes": "Integrates seamlessly with Final Cut Pro and other Apple tools",
        "variants": [
          {
            "name": "ProRes RAW",
            "description": "Standard ProRes RAW quality",
            "bitrates": {
              "1080p": {
                "24": 500,
                "25": 500,
                "30": 500,
                "60": 750,
                "23.98": 500,
                "29.97": 500,
                "59.94": 750
              },
              "4K": {
                "24": 2000,
                "25": 2000,
                "30": 2000,
                "60": 3000,
                "23.98": 2000,
                "29.97": 2000,
                "59.94": 3000
              },
              "8K": {
                "24": 8000,
                "25": 8000,
                "30": 8000,
                "60": 12000,
                "23.98": 8000,
                "29.97": 8000,
                "59.94": 12000
              }
            }
          },
          {
            "name": "ProRes RAW HQ",
            "description": "Higher quality ProRes RAW",
            "bitrates": {
              "1080p": {
                "24": 800,
                "25": 800,
                "30": 800,
                "60": 1200,
                "23.98": 800,
                "29.97": 800,
                "59.94": 1200
              },
              "4K": {
                "24": 3200,
                "25": 3200,
                "30": 3200,
                "60": 4800,
                "23.98": 3200,
                "29.97": 3200,
                "59.94": 4800
              },
              "8K": {
                "24": 12800,
                "25": 12800,
                "30": 12800,
                "60": 19200,
                "23.98": 12800,
                "29.97": 12800,
                "59.94": 19200
              }
            }
          }
        ]
      },
      {
        "id": "r3d",
        "name": "RED R3D",
        "description": "RED's proprietary RAW format",
        "workflowNotes": "Used in RED cameras for cinema production",
        "variants": [
          {
            "name": "REDCODE RAW 2:1",
            "description": "2:1 compression ratio",
            "bitrates": {
              "4K": {
                "24": 2400,
                "25": 2400,
                "30": 2400,
                "60": 3600,
                "23.98": 2400,
                "29.97": 2400,
                "59.94": 3600
              },
              "8K": {
                "24": 9600,
                "25": 9600,
                "30": 9600,
                "60": 14400,
                "23.98": 9600,
                "29.97": 9600,
                "59.94": 14400
              }
            }
          },
          {
            "name": "REDCODE RAW 3:1",
            "description": "3:1 compression ratio",
            "bitrates": {
              "4K": {
                "24": 1600,
                "25": 1600,
                "30": 1600,
                "60": 2400,
                "23.98": 1600,
                "29.97": 1600,
                "59.94": 2400
              },
              "8K": {
                "24": 6400,
                "25": 6400,
                "30": 6400,
                "60": 9600,
                "23.98": 6400,
                "29.97": 6400,
                "59.94": 9600
              }
            }
          },
          {
            "name": "REDCODE RAW 4:1",
            "description": "4:1 compression ratio",
            "bitrates": {
              "4K": {
                "24": 1200,
                "25": 1200,
                "30": 1200,
                "60": 1800,
                "23.98": 1200,
                "29.97": 1200,
                "59.94": 1800
              },
              "8K": {
                "24": 4800,
                "25": 4800,
                "30": 4800,
                "60": 7200,
                "23.98": 4800,
                "29.97": 4800,
                "59.94": 7200
              }
            }
          },
          {
            "name": "REDCODE RAW 5:1",
            "description": "5:1 compression ratio",
            "bitrates": {
              "4K": {
                "24": 960,
                "25": 960,
                "30": 960,
                "60": 1440,
                "23.98": 960,
                "29.97": 960,
                "59.94": 1440
              },
              "8K": {
                "24": 3840,
                "25": 3840,
                "30": 3840,
                "60": 5760,
                "23.98": 3840,
                "29.97": 3840,
                "59.94": 5760
              }
            }
          },
          {
            "name": "REDCODE RAW 8:1",
            "description": "8:1 compression ratio",
            "bitrates": {
              "4K": {
                "24": 600,
                "25": 600,
                "30": 600,
                "60": 900,
                "23.98": 600,
                "29.97": 600,
                "59.94": 900
              },
              "8K": {
                "24": 2400,
                "25": 2400,
                "30": 2400,
                "60": 3600,
                "23.98": 2400,
                "29.97": 2400,
                "59.94": 3600
              }
            }
          }
        ]
      },
      {
        "id": "cinema-raw",
        "name": "Canon Cinema RAW",
        "description": "Canon's cinema RAW format",
        "workflowNotes": "Used in Canon cinema cameras",
        "variants": [
          {
            "name": "Cinema RAW Light",
            "description": "Lighter compression for efficient workflows",
            "bitrates": {
              "4K": {
                "24": 1000,
                "25": 1000,
                "30": 1000,
                "60": 1500,
                "23.98": 1000,
                "29.97": 1000,
                "59.94": 1500
              },
              "8K": {
                "24": 4000,
                "25": 4000,
                "30": 4000,
                "60": 6000,
                "23.98": 4000,
                "29.97": 4000,
                "59.94": 6000
              }
            }
          },
          {
            "name": "Cinema RAW ST",
            "description": "Standard compression for high quality",
            "bitrates": {
              "4K": {
                "24": 2000,
                "25": 2000,
                "30": 2000,
                "60": 3000,
                "23.98": 2000,
                "29.97": 2000,
                "59.94": 3000
              },
              "8K": {
                "24": 8000,
                "25": 8000,
                "30": 8000,
                "60": 12000,
                "23.98": 8000,
                "29.97": 8000,
                "59.94": 12000
              }
            }
          }
        ]
      }
    ]
  }
];