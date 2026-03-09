import { useCallback } from 'react';
import { NEARBY_SEARCH_RADIUS, PAGE_DELAY_MS, MAX_PAGES } from '../constants';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTacoBell(name) {
  return name?.toLowerCase().includes('taco bell');
}

/**
 * Returns fetchAllTacoBells(lat, lng, mapInstance).
 * Paginates up to MAX_PAGES pages with PAGE_DELAY_MS between requests.
 */
export function usePlacesSearch() {
  const fetchAllTacoBells = useCallback((lat, lng, mapInstance) => {
    return new Promise((resolve, reject) => {
      if (!window.google || !mapInstance) {
        reject(new Error('Google Maps not loaded.'));
        return;
      }

      const service = new window.google.maps.places.PlacesService(mapInstance);
      const allResults = [];
      let pageCount = 0;

      const request = {
        location: new window.google.maps.LatLng(lat, lng),
        radius: NEARBY_SEARCH_RADIUS,
        keyword: 'Taco Bell',
        type: 'restaurant',
      };

      function handleResults(results, status, pagination) {
        pageCount++;

        if (
          status === window.google.maps.places.PlacesServiceStatus.OK ||
          status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
        ) {
          if (results) {
            const filtered = results.filter((r) => isTacoBell(r.name));
            allResults.push(...filtered);
          }

          if (
            pagination?.hasNextPage &&
            pageCount < MAX_PAGES
          ) {
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
  }, []);

  return { fetchAllTacoBells };
}
