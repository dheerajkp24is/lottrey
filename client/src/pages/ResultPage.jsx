import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state?.resultData;

  // If user visits this page directly without checking, send them back home
  useEffect(() => {
    if (!resultData) {
      navigate('/');
    }
  }, [resultData, navigate]);

  if (!resultData) return null;

  return (
    <div className="kg-main">
      <div className="result-page-wrapper">
        
        {/* === WINNER VIEW === */}
        {resultData.isWinner ? (
          <div className="win-theme">
            <div className="win-icon">🏆</div>
            <h1 className="win-title">Congratulations!</h1>
            <p style={{ color: '#b45309', fontWeight: 600 }}>You have a winning ticket!</p>
            
            <div className="win-prize-name">{resultData.data.prizeName}</div>
            <div className="win-prize-amount">
              ₹ {resultData.data.prizeAmount?.toLocaleString('en-IN')}
            </div>

            <div className="result-details" style={{ background: 'white' }}>
              <p><strong>Mobile Number:</strong> {resultData.data.mobile}</p>
              <p><strong>Draw Name:</strong> {resultData.data.drawName}</p>
              <p><strong>Draw Date:</strong> {new Date(resultData.data.drawDate).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        ) : (
          /* === LOSER VIEW === */
          <div className="lose-theme">
            <div className="lose-icon">😔</div>
            <h1 className="lose-title">Better Luck Next Time!</h1>
            <p style={{ color: '#64748b' }}>
              Unfortunately, your number did not match any winning prize.
            </p>

            <div className="result-details">
              <p><strong>Mobile Number:</strong> {resultData.data.mobile}</p>
              <p><strong>Draw Name:</strong> {resultData.data.drawName}</p>
              <p><strong>Status:</strong> Not a winner</p>
            </div>
          </div>
        )}

        <Link to="/" className="back-btn">
          Check Another Number
        </Link>
      </div>
    </div>
  );
};

export default ResultPage;