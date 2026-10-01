import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { fetchDraws, fetchDrawById, setWinningNumbers } from '../../services/api';

const SetWinnersPage = () => {
  const { drawId: paramDrawId } = useParams();
  const navigate = useNavigate();

  const [draws, setDraws] = useState([]);
  const [selectedDrawId, setSelectedDrawId] = useState(paramDrawId || '');
  const [draw, setDraw] = useState(null);

  const [prizes, setPrizes] = useState([
    { prizeName: '1st Prize', prizeAmount: 10000000, winningTickets: '' },
    { prizeName: '2nd Prize', prizeAmount: 2500000, winningTickets: '' },
    { prizeName: '3rd Prize', prizeAmount: 500000, winningTickets: '' },
  ]);

  const [publishNow, setPublishNow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingDraw, setLoadingDraw] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  // Load all draws for dropdown
  useEffect(() => {
    fetchDraws(false)
      .then((res) => {
        const list = res.data.data || [];
        setDraws(list);
        if (!selectedDrawId && list.length > 0) {
          setSelectedDrawId(list[0]._id);
        }
      })
      .catch(() => {});
  }, []);

  // Load selected draw details + existing winners
  useEffect(() => {
    if (!selectedDrawId) {
      setDraw(null);
      return;
    }

    setLoadingDraw(true);
    setError('');

    fetchDrawById(selectedDrawId)
      .then((res) => {
        const d = res.data.data;
        setDraw(d);
        setPublishNow(!!d.isPublished);

        if (d.prizes && d.prizes.length > 0) {
          setPrizes(
            d.prizes.map((p) => ({
              prizeName: p.prizeName,
              prizeAmount: p.prizeAmount,
              winningTickets: (p.winningTickets || []).join(', '),
            }))
          );
        } else {
          setPrizes([
            { prizeName: '1st Prize', prizeAmount: 10000000, winningTickets: '' },
            { prizeName: '2nd Prize', prizeAmount: 2500000, winningTickets: '' },
            { prizeName: '3rd Prize', prizeAmount: 500000, winningTickets: '' },
          ]);
        }
      })
      .catch(() => setError('Could not load draw details.'))
      .finally(() => setLoadingDraw(false));
  }, [selectedDrawId]);

  const update = (i, field, value) => {
    const copy = [...prizes];
    copy[i][field] = value;
    setPrizes(copy);
  };

  const addTier = () => {
    setPrizes([
      ...prizes,
      { prizeName: 'Consolation Prize', prizeAmount: 10000, winningTickets: '' },
    ]);
  };

  const removeTier = (i) => {
    if (prizes.length <= 1) return;
    setPrizes(prizes.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDrawId) {
      setError('Please select a draw first.');
      return;
    }

    setLoading(true);
    setError('');
    setMsg('');

    try {
      const payload = prizes.map((p) => ({
        prizeName: p.prizeName,
        prizeAmount: Number(p.prizeAmount),
        // Store phone numbers in winningTickets array
        winningTickets: p.winningTickets
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      }));

      await setWinningNumbers(selectedDrawId, {
        prizes: payload,
        publishNow,
      });

      setMsg('Winner phone numbers saved successfully!');
      setTimeout(() => {
        navigate('/admin/manage-draws');
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save winners.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Set Winners" subtitle="Dashboard / Set Winners">
      {msg && <div className="ad-alert alert-ok">✅ {msg}</div>}
      {error && <div className="ad-alert alert-err">⚠️ {error}</div>}

      {/* Select Draw */}
      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h3>🎰 Select Draw</h3>
            <p>Choose which lottery draw you want to set winners for</p>
          </div>
          <Link to="/admin/manage-draws" className="btn-ad btn-ad-ghost btn-ad-sm">
            ← Manage Draws
          </Link>
        </div>

        <div className="admin-panel-body">
          <div className="ad-field" style={{ maxWidth: 480, marginBottom: 0 }}>
            <label>Lottery Draw *</label>
            <select
              value={selectedDrawId}
              onChange={(e) => setSelectedDrawId(e.target.value)}
            >
              <option value="">-- Choose Draw --</option>
              {draws.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.drawName} {d.mobile ? `(${d.mobile})` : ''} —{' '}
                  {new Date(d.drawDate).toLocaleDateString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          {draw && (
            <div
              style={{
                marginTop: 16,
                padding: 14,
                background: '#f8fafc',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem',
                color: '#475569',
              }}
            >
              <strong style={{ color: '#0f172a' }}>{draw.drawName}</strong>
              <div style={{ marginTop: 4 }}>
                Phone linked to draw: <strong style={{ color: '#ff5722' }}>{draw.mobile || '—'}</strong>
                &nbsp;|&nbsp; Date: {new Date(draw.drawDate).toLocaleDateString('en-IN')}
                &nbsp;|&nbsp; Status: {draw.status}
                &nbsp;|&nbsp; {draw.isPublished ? 'Published' : 'Draft'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prize tiers */}
      {selectedDrawId && (
        <div className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h3>🏆 Prize Tiers & Winner Phone Numbers</h3>
              <p>Enter winner mobile numbers separated by commas</p>
            </div>
            <button type="button" onClick={addTier} className="btn-ad btn-ad-dark btn-ad-sm">
              ➕ Add Prize Tier
            </button>
          </div>

          <div className="admin-panel-body">
            {loadingDraw ? (
              <div className="ad-empty"><p>Loading draw details…</p></div>
            ) : (
              <form onSubmit={handleSubmit}>
                {prizes.map((p, i) => (
                  <div className="prize-block" key={i}>
                    <div className="prize-block-head">
                      <span>Prize Tier #{i + 1}</span>
                      {prizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTier(i)}
                          className="btn-ad btn-ad-red btn-ad-sm"
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>

                    <div className="ad-form-grid">
                      <div className="ad-field">
                        <label>Prize Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 1st Prize / 1 Crore Win"
                          value={p.prizeName}
                          onChange={(e) => update(i, 'prizeName', e.target.value)}
                        />
                      </div>

                      <div className="ad-field">
                        <label>Prize Amount (₹)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={p.prizeAmount}
                          onChange={(e) => update(i, 'prizeAmount', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="ad-field" style={{ marginBottom: 0 }}>
                      <label>Winner Phone Numbers *</label>
                      <textarea
                        rows="2"
                        required
                        placeholder="e.g. 9876543210, 9123456780, 9988776655"
                        value={p.winningTickets}
                        onChange={(e) => update(i, 'winningTickets', e.target.value)}
                      />
                      <span className="hint">
                        Enter mobile numbers separated by commas. Currently:{' '}
                        <strong>
                          {
                            p.winningTickets
                              .split(',')
                              .map((t) => t.trim())
                              .filter(Boolean).length
                          }
                        </strong>{' '}
                        phone number(s)
                      </span>
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: 14,
                    background: '#f8fafc',
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: 10,
                    margin: '18px 0',
                  }}
                >
                  <input
                    type="checkbox"
                    id="pub"
                    checked={publishNow}
                    onChange={(e) => setPublishNow(e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <label
                    htmlFor="pub"
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: '#334155',
                    }}
                  >
                    Publish results immediately — make visible on public website
                  </label>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button type="submit" className="btn-ad btn-ad-green" disabled={loading}>
                    {loading ? 'Saving…' : '💾 Save Winner Phone Numbers'}
                  </button>
                  <Link to="/admin/manage-draws" className="btn-ad btn-ad-ghost">
                    Cancel
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {!selectedDrawId && (
        <div className="admin-panel">
          <div className="ad-empty">
            <div className="emo">🏆</div>
            <p>Select a draw above to set winner phone numbers.</p>
            <Link to="/admin/create-draw" className="btn-ad btn-ad-primary" style={{ marginTop: 14 }}>
              Create Draw First
            </Link>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default SetWinnersPage;