import { useState, useCallback, useRef } from 'react';
import SearchBar from './components/SearchBar';
import MapView from './components/MapView';
import HoverCard from './components/HoverCard';
import LoadingOverlay from './components/LoadingOverlay';
import { geocodeZip } from './utils/geocode';
import { sortLocations } from './utils/sortLocations';
import { assignColors } from './utils/colorGradient';
import { usePlacesSearch } from './hooks/usePlacesSearch';
import { usePlaceDetails } from './hooks/usePlaceDetails';

export default function App() {
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState({ lat: 39.8283, lng: -98.5795 }); // geographic center of US
  const [zoom, setZoom] = useState(4);
  const [bounds, setBounds] = useState(null);
  const [hoveredPlaceId, setHoveredPlaceId] = useState(null);
  const [hoveredDetails, setHoveredDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const mapRef = useRef(null);
  const { fetchAllTacoBells } = usePlacesSearch();
  const { fetchDetails } = usePlaceDetails();

  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const handleSearch = useCallback(async (zip) => {
    setError('');
    setIsLoading(true);
    setLocations([]);
    setHoveredPlaceId(null);
    setHoveredDetails(null);

    try {
      const { lat, lng, bounds: zipBounds } = await geocodeZip(zip);
      setCenter({ lat, lng });
      setZoom(11);
      setBounds(zipBounds);

      if (!mapRef.current) {
        throw new Error('Map not ready. Please try again.');
      }

      const raw = await fetchAllTacoBells(lat, lng, mapRef.current);

      if (raw.length === 0) {
        setError('No Taco Bell locations found within 30km of this ZIP code.');
        setIsLoading(false);
        return;
      }

      const sorted = sortLocations(raw);
      const colored = assignColors(sorted);
      setLocations(colored);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchAllTacoBells]);

  const handleMarkerHover = useCallback(async (placeId) => {
    setHoveredPlaceId(placeId);
    setHoveredDetails(null);

    if (!placeId || !mapRef.current) return;

    setDetailsLoading(true);
    try {
      const details = await fetchDetails(placeId, mapRef.current);
      setHoveredDetails(details);
    } catch {
      setHoveredDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  }, [fetchDetails]);

  const handleMarkerOut = useCallback(() => {
    setHoveredPlaceId(null);
    setHoveredDetails(null);
    setDetailsLoading(false);
  }, []);

  const hoveredLocation = locations.find((l) => l.place_id === hoveredPlaceId) ?? null;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-bell">🔔</span>
          <span className="logo-text">Home Bell</span>
        </div>
        <p className="app-tagline">Find your nearest Taco Bell, ranked by rating</p>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        {error && <p className="app-error">{error}</p>}
      </header>

      <main className="app-main">
        <MapView
          center={center}
          zoom={zoom}
          bounds={bounds}
          locations={locations}
          hoveredPlaceId={hoveredPlaceId}
          onMapLoad={handleMapLoad}
          onMarkerHover={handleMarkerHover}
          onMarkerOut={handleMarkerOut}
        />
        {isLoading && <LoadingOverlay />}
        {(hoveredPlaceId) && (
          <HoverCard
            location={hoveredLocation}
            details={hoveredDetails}
            isLoading={detailsLoading}
          />
        )}
      </main>

      {locations.length > 0 && (
        <footer className="app-footer">
          <span>
            {locations.filter((l) => l.rank !== null).length} ranked ·{' '}
            {locations.filter((l) => l.rank === null).length} unranked (fewer than 100 reviews)
          </span>
          <div className="legend">
            <span className="legend-swatch" style={{ background: '#e74c3c' }} /> Low
            <span className="legend-swatch" style={{ background: '#f1c40f' }} /> Mid
            <span className="legend-swatch" style={{ background: '#2ecc71' }} /> High
            <span className="legend-swatch" style={{ background: '#95a5a6' }} /> Unranked
          </div>
        </footer>
      )}
    </div>
  );
}
