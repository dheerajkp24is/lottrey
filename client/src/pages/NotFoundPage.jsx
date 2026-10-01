import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
    <h1 style={{ fontSize: '4rem', color: 'var(--primary)' }}>404</h1>
    <h2>Page Not Found</h2>
    <p style={{ color: 'var(--text-medium)', margin: '12px 0 24px' }}>The requested resource does not exist.</p>
    <Link to="/" className="btn btn-primary">Return to Homepage</Link>
  </div>
);

export default NotFoundPage;