import { useState } from 'react';
import '../styles/SearchBar.css';

export default function SearchBar({ onSearch, isLoading }) {
  const [zip, setZip] = useState('');
  const [validationError, setValidationError] = useState('');

  function handleChange(e) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZip(val);
    if (validationError) setValidationError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (zip.length !== 5) {
      setValidationError('Please enter a valid 5-digit ZIP code.');
      return;
    }
    onSearch(zip);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} aria-label="ZIP code search">
      <div className="search-input-wrapper">
        <span className="search-pin-icon">📍</span>
        <input
          className="search-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{5}"
          placeholder="Enter ZIP code"
          value={zip}
          onChange={handleChange}
          maxLength={5}
          aria-label="ZIP code"
          disabled={isLoading}
        />
      </div>
      <button
        className="search-btn"
        type="submit"
        disabled={isLoading || zip.length !== 5}
        aria-label="Search"
      >
        {isLoading ? (
          <span className="search-spinner" aria-hidden="true" />
        ) : (
          'Find Tacos'
        )}
      </button>
      {validationError && (
        <p className="search-validation-error" role="alert">
          {validationError}
        </p>
      )}
    </form>
  );
}
