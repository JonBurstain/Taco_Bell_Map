const WORKER_URL = 'https://homebell-proxy.jonburstain.workers.dev';

/**
 * Geocode a US ZIP code via the Cloudflare Worker proxy.
 * Returns { lat, lng, bounds }.
 */
export async function geocodeZip(zip) {
  const res = await fetch(`${WORKER_URL}/geocode?zip=${encodeURIComponent(zip)}`);
  const data = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

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
