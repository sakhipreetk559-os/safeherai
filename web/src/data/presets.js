// Indian Metro City Demo Presets with High-Fidelity Road Polylines
// Ensures all routes show realistic city road trajectories even if public OSRM is offline

export const CITY_PRESETS = [
  {
    id: 'delhi-night',
    name: 'Delhi NCR — Commuter Corridor',
    city: 'Delhi NCR',
    description: 'Connaught Place ➔ Hauz Khas Village ➔ DLF Cyber City Gurugram',
    start: {
      name: 'Connaught Place, New Delhi',
      lat: 28.6315,
      lng: 77.2167
    },
    waypoints: [
      {
        id: 'wp-delhi-1',
        name: 'Hauz Khas Village, New Delhi',
        lat: 28.5535,
        lng: 77.1945
      }
    ],
    destination: {
      name: 'DLF Cyber City, Gurugram',
      lat: 28.4950,
      lng: 77.0895
    },
    // Detailed road waypoint corridors
    roadKeypoints: [
      [28.6315, 77.2167], // CP Inner Circle
      [28.6220, 77.2180], // Janpath
      [28.6129, 77.2295], // India Gate
      [28.5950, 77.2220], // Lodhi Garden
      [28.5720, 77.2120], // AIIMS Flyover
      [28.5535, 77.1945], // Hauz Khas Village
      [28.5410, 77.1890], // IIT Flyover
      [28.5280, 77.1750], // Adchini / Aurobindo Marg
      [28.5120, 77.1520], // Mahipalpur / Mehrauli Rd
      [28.5020, 77.1180], // Rajokri NH48 Border
      [28.4950, 77.0895]  // DLF Cyber City
    ]
  },
  {
    id: 'mumbai-coastal',
    name: 'Mumbai — Commercial to South Bombay',
    city: 'Mumbai',
    description: 'BKC ➔ Phoenix Palladium Lower Parel ➔ Marine Drive',
    start: {
      name: 'Bandra Kurla Complex (BKC), Mumbai',
      lat: 19.0662,
      lng: 72.8646
    },
    waypoints: [
      {
        id: 'wp-mumbai-1',
        name: 'Phoenix Palladium, Lower Parel',
        lat: 18.9953,
        lng: 72.8242
      }
    ],
    destination: {
      name: 'Marine Drive, Nariman Point, Mumbai',
      lat: 18.9256,
      lng: 72.8242
    },
    roadKeypoints: [
      [19.0662, 72.8646], // BKC G Block
      [19.0550, 72.8580], // Kalanagar Junction
      [19.0430, 72.8460], // Bandra Station West
      [19.0350, 72.8400], // Mahim Causeway
      [19.0220, 72.8340], // Shivaji Park Dadar
      [19.0080, 72.8290], // Prabhadevi / Siddhivinayak
      [18.9953, 72.8242], // Phoenix Palladium Lower Parel
      [18.9830, 72.8180], // Worli Naka
      [18.9720, 72.8110], // Haji Ali Dargah
      [18.9610, 72.8060], // Kemps Corner / Pedder Rd
      [18.9480, 72.8140], // Girgaon Chowpatty
      [18.9360, 72.8210], // Marine Drive Promenade
      [18.9256, 72.8242]  // Nariman Point
    ]
  },
  {
    id: 'bangalore-tech',
    name: 'Bengaluru — Tech Corridor Commute',
    city: 'Bengaluru',
    description: 'Indiranagar 100ft Rd ➔ Koramangala ➔ Electronic City',
    start: {
      name: 'Indiranagar 100ft Rd, Bengaluru',
      lat: 12.9716,
      lng: 77.6412
    },
    waypoints: [
      {
        id: 'wp-blr-1',
        name: 'Koramangala 5th Block, Bengaluru',
        lat: 12.9352,
        lng: 77.6245
      }
    ],
    destination: {
      name: 'Electronic City Phase 1, Bengaluru',
      lat: 12.8452,
      lng: 77.6602
    },
    roadKeypoints: [
      [12.9716, 77.6412], // Indiranagar 100ft Rd
      [12.9610, 77.6380], // Domlur Flyover / Inner Ring Rd
      [12.9480, 77.6320], // EGL Embassy Golf Links
      [12.9352, 77.6245], // Koramangala 5th Block (Sony World)
      [12.9270, 77.6200], // St. John's Hospital Signal
      [12.9172, 77.6228], // Central Silk Board Junction
      [12.9050, 77.6320], // Bommanahalli / Hosur Rd
      [12.8910, 77.6410], // Garvebhavipalya
      [12.8760, 77.6520], // Kudlu Gate Flyover
      [12.8610, 77.6580], // Hosa Road Junction
      [12.8452, 77.6602]  // Electronic City Phase 1 Toll
    ]
  },
  {
    id: 'pune-evening',
    name: 'Pune — Night Transit Route',
    city: 'Pune',
    description: 'Koregaon Park ➔ Kalyani Nagar ➔ Phoenix Marketcity',
    start: {
      name: 'Koregaon Park (North Main Rd), Pune',
      lat: 18.5362,
      lng: 73.8940
    },
    waypoints: [
      {
        id: 'wp-pune-1',
        name: 'Kalyani Nagar Bridge, Pune',
        lat: 18.5482,
        lng: 73.9025
      }
    ],
    destination: {
      name: 'Phoenix Marketcity, Viman Nagar, Pune',
      lat: 18.5621,
      lng: 73.9168
    },
    roadKeypoints: [
      [18.5362, 73.8940], // Koregaon Park Lane 1
      [18.5410, 73.8980], // ABC Farms Corner
      [18.5482, 73.9025], // Kalyani Nagar Bridge
      [18.5520, 73.9070], // Central Avenue Kalyani Nagar
      [18.5570, 73.9120], // Nagar Road Junction
      [18.5621, 73.9168]  // Phoenix Marketcity Viman Nagar
    ]
  },
  {
    id: 'hyderabad-it',
    name: 'Hyderabad — Cyber Corridor',
    city: 'Hyderabad',
    description: 'HITEC City ➔ Jubilee Hills ➔ DLF Gachibowli',
    start: {
      name: 'Cyber Towers, HITEC City, Hyderabad',
      lat: 17.4504,
      lng: 78.3808
    },
    waypoints: [
      {
        id: 'wp-hyd-1',
        name: 'Jubilee Hills Check Post, Hyderabad',
        lat: 17.4319,
        lng: 78.4073
      }
    ],
    destination: {
      name: 'DLF Cybercity, Gachibowli, Hyderabad',
      lat: 17.4435,
      lng: 78.3582
    },
    roadKeypoints: [
      [17.4504, 78.3808], // Cyber Towers
      [17.4420, 78.3880], // Inorbit Mall Junction
      [17.4350, 78.3960], // Durgam Cheruvu Cable Bridge
      [17.4319, 78.4073], // Jubilee Hills Check Post
      [17.4260, 78.3990], // Road No. 36
      [17.4340, 78.3820], // Madhapur Metro
      [17.4380, 78.3680], // Biodiversity Junction
      [17.4435, 78.3582]  // DLF Cybercity Gachibowli
    ]
  }
];

/**
 * Generate smooth road polyline from keypoints with micro-curves
 */
export function generateSmoothRoadPath(keypoints, stepsPerSegment = 8) {
  if (!keypoints || keypoints.length < 2) return [];

  const path = [];
  for (let i = 0; i < keypoints.length - 1; i++) {
    const p1 = keypoints[i];
    const p2 = keypoints[i + 1];

    for (let s = (i === 0 ? 0 : 1); s <= stepsPerSegment; s++) {
      const t = s / stepsPerSegment;
      // Natural sine road curvature
      const jitter = Math.sin(t * Math.PI) * 0.0006;
      path.push([
        p1[0] + (p2[0] - p1[0]) * t + jitter,
        p1[1] + (p2[1] - p1[1]) * t - jitter * 0.5
      ]);
    }
  }

  return path;
}
