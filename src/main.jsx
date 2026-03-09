import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LoadScript } from '@react-google-maps/api';
import App from './App.jsx';
import PinGate from './components/PinGate.jsx';
import './styles/App.css';

// IMPORTANT: defined at module scope to prevent SDK reload loop
const LIBRARIES = ['places'];

function Root() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem('hb_unlocked') === '1'
  );

  if (!unlocked) {
    return <PinGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={LIBRARIES}
    >
      <App />
    </LoadScript>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
