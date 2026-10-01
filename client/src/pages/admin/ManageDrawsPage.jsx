import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { fetchDraws, deleteDraw, updateDraw } from '../../services/api';

const ManageDrawsPage = () => {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchDraws(false);
      setDraws(res.data.data || []);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}" and all its winning numbers?`)) return;
    await deleteDraw(id);
    setMsg('Draw deleted successfully.');
    load();
    setTimeout(() => setMsg(''), 3000);
  };

  const togglePublish = async (draw) => {
    await updateDraw(draw._id, { isPublished: !draw.isPublished });
    setMsg(`Draw ${!draw.isPublished ? 'published' : 'unpublished'} successfully.`);
    load();
    setTimeout(() => setMsg(''), 3000);
  };

  const filtered = draws.filter(
    (d) =>
      d.drawName.toLowerCase().includes(search.toLowerCase()) ||
      (d.mobile && d.mobile.includes(search))
  );

  return (
    <AdminLayout title="Manage Draws" subtitle="Dashboard / Manage Draws">
      {msg && <div className="ad-alert alert-ok">✅ {msg}</div>}

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h3>🎰 All Lottery Draws</h3>
            <p>{draws.length} draw(s) in the system</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Search by name or mobile…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1.5px solid #e2e8f0',
                borderRadius: 8,
                fontSize: '0.82rem',
                outline: 'none',
                minWidth: 200,
              }}
            />
            <Link to="/admin/create-draw" className="btn-ad btn-ad-primary btn-ad-sm">
              ➕ New Draw
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="ad-empty"><p>Loading draws…</p></div>
        ) : filtered.length === 0 ? (
          <div className="ad-empty">
            <div className="emo">📭</div>
            <p>{search ? 'No draws match your search.' : 'No draws created yet.'}</p>
          </div>
        ) : (
          <div className="ad-table-scroll">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Draw Name</th>
                  <th>Phone Number</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Visibility</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d._id}>
                    <td><strong>{d.drawName}</strong></td>
                    <td style={{ fontWeight: 700, color: '#ff5722' }}>{d.mobile || '—'}</td>
                    <td>{new Date(d.drawDate).toLocaleDateString('en-IN')}</td>
                    <td>₹{d.ticketPrice}</td>
                    <td><span className="ad-pill pill-blue">{d.status}</span></td>
                    <td>
                      <span className={`ad-pill ${d.isPublished ? 'pill-green' : 'pill-yellow'}`}>
                        {d.isPublished ? '● Live' : '○ Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="ad-actions">
                        <Link to={`/admin/set-winners/${d._id}`} className="btn-ad btn-ad-primary btn-ad-sm">
                          🏆 Winners
                        </Link>
                        <button
                          onClick={() => togglePublish(d)}
                          className={`btn-ad btn-ad-sm ${d.isPublished ? 'btn-ad-ghost' : 'btn-ad-green'}`}
                        >
                          {d.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDelete(d._id, d.drawName)}
                          className="btn-ad btn-ad-red btn-ad-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageDrawsPage;