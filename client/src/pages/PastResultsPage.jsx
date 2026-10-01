import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDraws } from '../services/api';

const PastResultsPage = () => {
  const [draws, setDraws] = useState([]);

  useEffect(() => {
    fetchDraws(true).then((res) => setDraws(res.data.data)).catch(() => {});
  }, []);

  return (
    <div className="kg-main">
      <div className="kg-card">
        <h2 style={{ color: '#1a1a1a', textAlign: 'center' }}>Past Results Archive</h2>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', marginBottom: 20 }}>
          View officially published results of previous draws.
        </p>

        {draws.map((d) => (
          <div className="kg-list-card" key={d._id}>
            <div className="kg-list-info">
              <h4>{d.drawName}</h4>
              <p>Code: {d.drawCode} | {new Date(d.drawDate).toLocaleDateString()}</p>
            </div>
            <Link to="/check" className="kg-play-btn" style={{ padding: '6px 12px', fontSize: '0.7rem' }}>
              CHECK
            </Link>
          </div>
        ))}

        {draws.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            No past draws published yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default PastResultsPage;