import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="kg-footer">
      <p style={{ marginBottom: 8 }}>
        © {new Date().getFullYear()} Kerala State Lottery Portal. All rights reserved.
      </p>
      <div>
        <Link to="/">Home</Link>
        <Link to="/check">Check Result</Link>
        <Link to="/past-results">Past Results</Link>
        <Link to="/admin/login">Admin</Link>
      </div>
    </footer>
  );
};

export default Footer;