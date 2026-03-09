import '../styles/App.css';

export default function LoadingOverlay() {
  return (
    <div className="loading-overlay" aria-busy="true" aria-label="Searching for Taco Bell locations">
      <div className="loading-content">
        <div className="loading-spinner" />
        <p className="loading-text">Searching for Taco Bells…</p>
        <p className="loading-subtext">May take a few seconds to fetch all locations</p>
      </div>
    </div>
  );
}
