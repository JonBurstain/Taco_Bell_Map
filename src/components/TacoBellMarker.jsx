import { useCallback } from 'react';
import { Marker } from '@react-google-maps/api';

export default function TacoBellMarker({ location, isActive, isPinned, onMouseOver, onMouseOut, onClick }) {
  const handleMouseOver = useCallback(() => onMouseOver(location.place_id), [location.place_id, onMouseOver]);
  const handleMouseOut = useCallback(() => onMouseOut(), [onMouseOut]);
  const handleClick = useCallback(() => onClick(location.place_id), [location.place_id, onClick]);

  const icon = {
    path: window.google?.maps?.SymbolPath?.CIRCLE ?? 0,
    fillColor: location.color,
    fillOpacity: 0.95,
    strokeColor: isPinned ? '#ffffff' : '#ffffff',
    strokeWeight: isActive ? 3 : 1.5,
    scale: isActive ? 14 : 10,
  };

  const label = location.rank !== null
    ? {
        text: String(location.rank),
        color: '#ffffff',
        fontSize: isActive ? '11px' : '9px',
        fontWeight: 'bold',
      }
    : undefined;

  return (
    <Marker
      position={location.geometry.location}
      icon={icon}
      label={label}
      title={location.name}
      zIndex={isActive ? 1000 : (location.rank ?? 500)}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={handleClick}
    />
  );
}
