import { useCallback } from 'react';
import { PAGE_DELAY_MS, MAX_PAGES } from '../constants';

const RADIUS_TIGHT = 8000;  // 8km  — used first for dense cities
const RADIUS_WIDE  = 30000; // 30km — fallback for suburban/rural areas
const EXPAND_THRESHOLD = 20; // expand if fewer than this many results

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTacoBell(name) {
  return name?.toLowerCase().includes('taco bell');
}

function runSearch(service, lat, lng, radius) {
  return new Promise((resolve, reject) => {
    const allResults = [];
    let pageCount = 0;

    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius,
      keyword: 'Taco Bell',
      type: 'restaurant',
    };

    function handleResults(results, status, pagination) {
      pageCount++;
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK ||
        status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
      ) {
        if (results) allResults.push(...results.filter((r) => isTacoBell(r.name)));
        if (pagination?.hasNextPage && pageCount < MAX_PAGES) {
          delay(PAGE_DELAY_MS).then(() => pagination.nextPage());
        } else {
          resolve(allResults);
        }
      } else {
        reject(new Error(`Places search failed: ${status}`));
      }
    }

    service.nearbySearch(request, handleResults);
  });
}

/**
 * Returns fetchAllTacoBells(lat, lng, mapInstance).
 * Searches with a tight 8km radius first. If fewer than EXPAND_THRESHOLD
 * results come back, expands to 30km to cover suburban/rural areas.
 */
export function usePlacesSearch() {
  const fetchAllTacoBells = useCallback(async (lat, lng, mapInstance) => {
    if (!window.google || !mapInstance) {
      throw new Error('Google Maps not loaded.');
    }

    const service = new window.google.maps.places.PlacesService(mapInstance);

    const tightResults = await runSearch(service, lat, lng, RADIUS_TIGHT);

    if (tightResults.length >= EXPAND_THRESHOLD) {
      return tightResults;
    }

    // Not enough nearby — expand to wide radius
    return runSearch(service, lat, lng, RADIUS_WIDE);
  }, []);

  return { fetchAllTacoBells };
}
