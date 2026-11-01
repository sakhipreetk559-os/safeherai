// Indian Metro City Demo Presets for One-Click Testing

export const CITY_PRESETS = [
  {
    id: 'delhi-night',
    name: 'Delhi NCR — Commuter Corridor',
    city: 'Delhi NCR',
    description: 'Connaught Place to Cyber Hub Gurgaon via Hauz Khas Village',
    start: {
      name: 'Connaught Place, New Delhi',
      lat: 28.6315,
      lng: 77.2167
    },
    waypoints: [
      {
        id: 'wp-1',
        name: 'Hauz Khas Village, New Delhi',
        lat: 28.5535,
        lng: 77.1945
      }
    ],
    destination: {
      name: 'DLF Cyber City, Gurugram',
      lat: 28.4950,
      lng: 77.0895
    }
  },
  {
    id: 'bangalore-tech',
    name: 'Bengaluru — Tech Corridor Commute',
    city: 'Bengaluru',
    description: 'Indiranagar 100ft Rd to Electronic City via Koramangala',
    start: {
      name: 'Indiranagar 100ft Rd, Bengaluru',
      lat: 12.9716,
      lng: 77.6412
    },
    waypoints: [
      {
        id: 'wp-1',
        name: 'Koramangala 5th Block, Bengaluru',
        lat: 12.9352,
        lng: 77.6245
      }
    ],
    destination: {
      name: 'Electronic City Phase 1, Bengaluru',
      lat: 12.8452,
      lng: 77.6602
    }
  },
  {
    id: 'mumbai-coastal',
    name: 'Mumbai — Commercial to South Bombay',
    city: 'Mumbai',
    description: 'BKC to Marine Drive via Lower Parel Palladium',
    start: {
      name: 'Bandra Kurla Complex (BKC), Mumbai',
      lat: 19.0662,
      lng: 77.2167 ? 72.8646 : 72.8646
    },
    waypoints: [
      {
        id: 'wp-1',
        name: 'Phoenix Palladium, Lower Parel',
        lat: 18.9953,
        lng: 72.8242
      }
    ],
    destination: {
      name: 'Marine Drive, Nariman Point, Mumbai',
      lat: 18.9256,
      lng: 72.8242
    }
  },
  {
    id: 'pune-evening',
    name: 'Pune — Night Transit Route',
    city: 'Pune',
    description: 'Koregaon Park to Viman Nagar & Phoenix Marketcity',
    start: {
      name: 'Koregaon Park (North Main Rd), Pune',
      lat: 18.5362,
      lng: 73.8940
    },
    waypoints: [
      {
        id: 'wp-1',
        name: 'Kalyani Nagar Bridge, Pune',
        lat: 18.5482,
        lng: 73.9025
      }
    ],
    destination: {
      name: 'Phoenix Marketcity, Viman Nagar, Pune',
      lat: 18.5621,
      lng: 73.9168
    }
  },
  {
    id: 'hyderabad-it',
    name: 'Hyderabad — HITEC to Financial District',
    city: 'Hyderabad',
    description: 'Cyber Towers to Gachibowli via Jubilee Hills',
    start: {
      name: 'Cyber Towers, HITEC City, Hyderabad',
      lat: 17.4504,
      lng: 78.3808
    },
    waypoints: [
      {
        id: 'wp-1',
        name: 'Jubilee Hills Check Post, Hyderabad',
        lat: 17.4319,
        lng: 78.4073
      }
    ],
    destination: {
      name: 'DLF Cybercity, Gachibowli, Hyderabad',
      lat: 17.4435,
      lng: 78.3582
    }
  }
];
