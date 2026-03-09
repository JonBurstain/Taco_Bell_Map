import { useCallback, useRef } from 'react';

const DETAIL_FIELDS = [
  'name',
  'formatted_address',
  'rating',
  'user_ratings_total',
  'opening_hours',
  'photos',
];

/**
 * Returns fetchDetails(placeId, mapInstance).
 * Results are cached in a ref (no re-render on cache write).
 */
export function usePlaceDetails() {
  const cache = useRef(new Map());

  const fetchDetails = useCallback((placeId, mapInstance) => {
    if (cache.current.has(placeId)) {
      return Promise.resolve(cache.current.get(placeId));
    }

    return new Promise((resolve, reject) => {
      if (!window.google || !mapInstance) {
        reject(new Error('Google Maps not loaded.'));
        return;
      }

      const service = new window.google.maps.places.PlacesService(mapInstance);

      service.getDetails(
        { placeId, fields: DETAIL_FIELDS },
        (result, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            cache.current.set(placeId, result);
            resolve(result);
          } else {
            reject(new Error(`Place details failed: ${status}`));
          }
        }
      );
    });
  }, []);

  return { fetchDetails };
}
