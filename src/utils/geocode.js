/**
 * Geocode a US ZIP code to { lat, lng, bounds } using the Geocoding REST API.
 */
export async function geocodeZip(zip) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(zip)}&components=country:US&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Network error contacting Geocoding API.');

  const data = await res.json();

  if (data.status === 'ZERO_RESULTS' || !data.results?.length) {
    throw new Error(`No US location found for ZIP code "${zip}". Please try another.`);
  }
  if (data.status !== 'OK') {
    throw new Error(`Geocoding error: ${data.status}`);
  }

  const result = data.results[0];
  const { lat, lng } = result.geometry.location;
  const viewport = result.geometry.viewport;

  return {
    lat,
    lng,
    bounds: viewport
      ? {
          north: viewport.northeast.lat,
          south: viewport.southwest.lat,
          east: viewport.northeast.lng,
          west: viewport.southwest.lng,
        }
      : null,
  };
}
