import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LoadScript } from '@react-google-maps/api';
import App from './App.jsx';
import './styles/App.css';

// IMPORTANT: defined at module scope to prevent SDK reload loop
const LIBRARIES = ['places'];

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={LIBRARIES}
    >
      <App />
    </LoadScript>
  </StrictMode>
);
