// OpenStreetMap Nominatim Geocoding Service with Resilient Fallback

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

// Local curated quick suggestions for Indian hotspots
const CURATED_SUGGESTIONS = [
  { name: 'Connaught Place, New Delhi', lat: 28.6315, lng: 77.2167, city: 'Delhi' },
  { name: 'India Gate, New Delhi', lat: 28.6129, lng: 77.2295, city: 'Delhi' },
  { name: 'Hauz Khas Village, New Delhi', lat: 28.5535, lng: 77.1945, city: 'Delhi' },
  { name: 'DLF Cyber Hub, Gurugram', lat: 28.4950, lng: 77.0895, city: 'Gurugram' },
  { name: 'Saket City Centre, New Delhi', lat: 28.5283, lng: 77.2185, city: 'Delhi' },
  { name: 'Indiranagar 100ft Road, Bengaluru', lat: 12.9716, lng: 77.6412, city: 'Bengaluru' },
  { name: 'Koramangala 5th Block, Bengaluru', lat: 12.9352, lng: 77.6245, city: 'Bengaluru' },
  { name: 'Electronic City Phase 1, Bengaluru', lat: 12.8452, lng: 77.6602, city: 'Bengaluru' },
  { name: 'MG Road Metro Station, Bengaluru', lat: 12.9756, lng: 77.6066, city: 'Bengaluru' },
  { name: 'Bandra Kurla Complex (BKC), Mumbai', lat: 19.0662, lng: 72.8646, city: 'Mumbai' },
  { name: 'Marine Drive, Nariman Point, Mumbai', lat: 18.9256, lng: 72.8242, city: 'Mumbai' },
  { name: 'Phoenix Palladium, Lower Parel, Mumbai', lat: 18.9953, lng: 72.8242, city: 'Mumbai' },
  { name: 'Koregaon Park, Pune', lat: 18.5362, lng: 73.8940, city: 'Pune' },
  { name: 'Viman Nagar, Pune', lat: 18.5621, lng: 73.9168, city: 'Pune' },
  { name: 'Hinjewadi Rajiv Gandhi IT Park, Pune', lat: 18.5913, lng: 73.7389, city: 'Pune' },
  { name: 'HITEC City Cyber Towers, Hyderabad', lat: 17.4504, lng: 78.3808, city: 'Hyderabad' },
  { name: 'Jubilee Hills, Hyderabad', lat: 17.4319, lng: 78.4073, city: 'Hyderabad' },
  { name: 'Park Street, Kolkata', lat: 22.5518, lng: 88.3524, city: 'Kolkata' },
  { name: 'Salt Lake Sector V, Kolkata', lat: 22.5802, lng: 88.4328, city: 'Kolkata' }
];

export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim().toLowerCase();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(
      `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&countrycodes=in&limit=6`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'SafeHer-AI-SafetyApp/1.0'
        }
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(item => ({
          name: item.display_name.split(',').slice(0, 3).join(', ').trim(),
          fullName: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          type: item.type || 'place'
        }));
      }
    }
  } catch {
    // If network fails or times out, seamlessly search curated fallback
  }

  // Filter curated fallback locations
  return CURATED_SUGGESTIONS
    .filter(item => item.name.toLowerCase().includes(cleanQuery) || item.city.toLowerCase().includes(cleanQuery))
    .slice(0, 5);
}

export async function reverseGeocode(lat, lng) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(
      `${NOMINATIM_BASE}/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'SafeHer-AI-SafetyApp/1.0'
        }
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        name: data.display_name ? data.display_name.split(',').slice(0, 3).join(', ').trim() : 'Current Location',
        lat,
        lng
      };
    }
  } catch {
    // Fallback
  }

  return {
    name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    lat,
    lng
  };
}
