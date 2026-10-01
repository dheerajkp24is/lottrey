import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchDraws, checkTicketResult, fetchImages } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate(); // ADDED NAVIGATION
  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [winnerImages, setWinnerImages] = useState([]);

  useEffect(() => {
    fetchDraws(true)
      .then((res) => {
        const list = res.data.data || [];
        setDraws(list);
        if (list.length > 0) setSelectedDraw(list[0]._id);
      })
      .catch(() => {});

    fetchImages()
      .then((res) => {
        const imgs = res.data.data || [];
        if (imgs.length > 0) {
          setWinnerImages(imgs.map((i) => ({ id: i._id, photo: i.imageUrl, label: i.label })));
        }
      })
      .catch(() => {});
  }, []);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!ticketNumber.trim()) {
      setError('Please enter your mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await checkTicketResult({
        drawId: selectedDraw,
        mobile: ticketNumber.trim(),
        ticketNumber: ticketNumber.trim(),
      });
      
      // ✅ REDIRECT TO RESULT PAGE WITH DATA
      navigate('/result', { state: { resultData: res.data } });

    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="kg-main">
      {/* ORANGE CHECK BOX */}
      <div className="kg-orange-box">
        <h2>Enter mobile number to check result by clicking below button</h2>
        <form onSubmit={handleCheck}>
          {draws.length > 0 && (
            <select
              className="kg-input"
              value={selectedDraw}
              onChange={(e) => setSelectedDraw(e.target.value)}
            >
              {draws.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.drawName}
                </option>
              ))}
            </select>
          )}

          <input
            type="text"
            className="kg-input"
            placeholder="Enter Mobile Number"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
          />

          <button type="submit" className="kg-btn-blue" disabled={loading}>
            {loading ? 'CHECKING...' : 'CHECK YOUR RESULT'}
          </button>
        </form>
      </div>

      <div className="kg-padding">
        {/* Only show Validation Errors here (like empty input or network error) */}
        {error && <div className="kg-result-lose" style={{marginTop: 16}}>{error}</div>}

        {/* INFO TEXT */}
        <div className="kg-info-text">
          <h3>Kerala State Lottery – Karunya KR</h3>
          <p>
            Kerala Lottery Karunya KR draw is one of the most trusted lottery schemes in Kerala.
            Results are published officially and updated regularly. Every week thousands of participants check their results through this portal.
          </p>
        </div>

        {/* DYNAMIC WINNER IMAGES */}
        {winnerImages.map((img) => (
          <div className="kg-winner-card" key={img.id}>
            <img src={img.photo} alt={img.label} />
            <div className="kg-winner-label">{img.label}</div>
          </div>
        ))}

        {/* ADDRESS */}
        <div className="kg-address">
          3rd Floor KSRTC building<br />
          Thampanoor, Thiruvananthapuram,<br />
          695001
        </div>
      </div>

      {/* MORE ABOUT BOX */}
      <div className="kg-more-box">
        <h3>More About Kerala Lottery Ticket</h3>
        <ul>
          <li>100% Authentic Lottery Information</li>
          <li>Realtime Result Updates</li>
          <li>Government Certified Information</li>
          <li>Daily Result Monitoring</li>
        </ul>
        <Link
          to="/check"
          className="kg-play-btn-red"
          style={{ padding: '10px', display: 'block', textAlign: 'center', marginTop: 10 }}
        >
          PLAY NOW
        </Link>
      </div>

      <Link to="/admin/login" className="kg-admin-link">
        Admin Login
      </Link>
    </div>
  );
};

export default HomePage;