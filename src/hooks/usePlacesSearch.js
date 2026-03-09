import { useCallback } from 'react';
import { PAGE_DELAY_MS, MAX_PAGES, WORKER_URL, RADIUS_TIGHT, RADIUS_WIDE, EXPAND_THRESHOLD } from '../constants';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTacoBell(name) {
  return name?.toLowerCase().includes('taco bell');
}

async function fetchPage(lat, lng, radius, pagetoken = null) {
  let url;
  if (pagetoken) {
    url = `${WORKER_URL}/places/nearby?pagetoken=${encodeURIComponent(pagetoken)}`;
  } else {
    url = `${WORKER_URL}/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`;
  }
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

async function runSearch(lat, lng, radius) {
  const allResults = [];
  let pageCount = 0;
  let pagetoken = null;

  do {
    if (pagetoken) await delay(PAGE_DELAY_MS);
    const data = await fetchPage(lat, lng, radius, pagetoken);

    if (data.status === 'OK' || data.status === 'ZERO_RESULTS') {
      if (data.results) {
        allResults.push(...data.results.filter((r) => isTacoBell(r.name)));
      }
      pagetoken = data.next_page_token || null;
      pageCount++;
    } else {
      throw new Error(`Places search failed: ${data.status}`);
    }
  } while (pagetoken && pageCount < MAX_PAGES);

  return allResults;
}

/**
 * Adaptive search: tight radius first, expands if too few results.
 * Uses REST API via Cloudflare Worker — no mapInstance needed.
 */
export function usePlacesSearch() {
  const fetchAllTacoBells = useCallback(async (lat, lng) => {
    const tightResults = await runSearch(lat, lng, RADIUS_TIGHT);
    if (tightResults.length >= EXPAND_THRESHOLD) return tightResults;
    return runSearch(lat, lng, RADIUS_WIDE);
  }, []);

  return { fetchAllTacoBells };
}
