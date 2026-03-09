import { useState } from 'react';
import '../styles/PinGate.css';

const CORRECT_PIN = 'livemas';

export default function PinGate({ onUnlock }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim().toLowerCase() === CORRECT_PIN) {
      sessionStorage.setItem('hb_unlocked', '1');
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setValue('');
    }
  }

  return (
    <div className="pin-shell">
      <div className={`pin-card ${shake ? 'shake' : ''}`}>
        <div className="pin-logo">
          <span>🔔</span>
          <h1>Home Bell</h1>
        </div>
        <p className="pin-subtitle">Enter the passphrase to continue</p>
        <form onSubmit={handleSubmit} className="pin-form">
          <input
            className={`pin-input ${error ? 'pin-input-error' : ''}`}
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="Passphrase"
            autoFocus
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
          />
          {error && <p className="pin-error">Incorrect passphrase. Try again.</p>}
          <button className="pin-btn" type="submit">Enter</button>
        </form>
      </div>
    </div>
  );
}
