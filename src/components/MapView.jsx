import { useEffect, useCallback, useRef } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import TacoBellMarker from './TacoBellMarker';
import '../styles/MapView.css';

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };

const MAP_OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export default function MapView({
  center,
  zoom,
  bounds,
  locations,
  hoveredPlaceId,
  onMapLoad,
  onMarkerHover,
  onMarkerOut,
}) {
  const mapInstanceRef = useRef(null);

  const handleLoad = useCallback(
    (map) => {
      mapInstanceRef.current = map;
      onMapLoad(map);
    },
    [onMapLoad]
  );

  // Fit to bounds whenever bounds change
  useEffect(() => {
    if (bounds && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds({
        north: bounds.north,
        south: bounds.south,
        east: bounds.east,
        west: bounds.west,
      });
    }
  }, [bounds]);

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={center}
        zoom={zoom}
        options={MAP_OPTIONS}
        onLoad={handleLoad}
      >
        {locations.map((loc) => (
          <TacoBellMarker
            key={loc.place_id}
            location={loc}
            isHovered={loc.place_id === hoveredPlaceId}
            onMouseOver={onMarkerHover}
            onMouseOut={onMarkerOut}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
