import { useCallback } from 'react';
import { Marker } from '@react-google-maps/api';

export default function TacoBellMarker({ location, isHovered, onMouseOver, onMouseOut }) {
  const handleMouseOver = useCallback(() => {
    onMouseOver(location.place_id);
  }, [location.place_id, onMouseOver]);

  const handleMouseOut = useCallback(() => {
    onMouseOut();
  }, [onMouseOut]);

  const icon = {
    path: window.google?.maps?.SymbolPath?.CIRCLE ?? 0,
    fillColor: location.color,
    fillOpacity: 0.95,
    strokeColor: '#ffffff',
    strokeWeight: isHovered ? 2.5 : 1.5,
    scale: isHovered ? 14 : 10,
  };

  const label =
    location.rank !== null
      ? {
          text: String(location.rank),
          color: '#ffffff',
          fontSize: isHovered ? '11px' : '9px',
          fontWeight: 'bold',
        }
      : undefined;

  return (
    <Marker
      position={location.geometry.location}
      icon={icon}
      label={label}
      title={location.name}
      zIndex={isHovered ? 1000 : location.rank ?? 500}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    />
  );
}
