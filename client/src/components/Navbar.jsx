import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="kg-header">
      <div className="kg-header-logo">
        {/* Kerala-style emblem using emoji/svg */}
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', color: '#fbbf24', flexShrink: 0
        }}>
          🏛️
        </div>
        <h1>THE KERALA GOVERNMENT</h1>
      </div>
      <Link to="/check" className="kg-play-btn">PLAY NOW</Link>
    </header>
  );
};

export default Navbar;