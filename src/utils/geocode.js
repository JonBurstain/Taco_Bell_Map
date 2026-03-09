/**
 * Geocode a US ZIP code using the Google Maps JS SDK Geocoder.
 * Returns { lat, lng, bounds }.
 */
export function geocodeZip(zip) {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google Maps not loaded.'));
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      { address: zip, componentRestrictions: { country: 'US' } },
      (results, status) => {
        if (status === 'OK' && results?.length) {
          const { lat, lng } = results[0].geometry.location;
          const viewport = results[0].geometry.viewport;
          resolve({
            lat: lat(),
            lng: lng(),
            bounds: viewport
              ? {
                  north: viewport.getNorthEast().lat(),
                  south: viewport.getSouthWest().lat(),
                  east: viewport.getNorthEast().lng(),
                  west: viewport.getSouthWest().lng(),
                }
              : null,
          });
        } else if (status === 'ZERO_RESULTS') {
          reject(new Error(`No US location found for ZIP code "${zip}". Please try another.`));
        } else {
          reject(new Error(`Geocoding error: ${status}`));
        }
      }
    );
  });
}
