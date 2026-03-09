import { useCallback, useRef } from 'react';
import { WORKER_URL } from '../constants';

/**
 * Fetch place details via Cloudflare Worker REST proxy.
 * Results cached in a ref — no mapInstance needed.
 */
export function usePlaceDetails() {
  const cache = useRef(new Map());

  const fetchDetails = useCallback(async (placeId) => {
    if (cache.current.has(placeId)) {
      return cache.current.get(placeId);
    }

    const res = await fetch(`${WORKER_URL}/places/details?place_id=${encodeURIComponent(placeId)}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error);
    if (data.status !== 'OK') throw new Error(`Place details failed: ${data.status}`);

    const result = data.result;
    cache.current.set(placeId, result);
    return result;
  }, []);

  return { fetchDetails };
}
