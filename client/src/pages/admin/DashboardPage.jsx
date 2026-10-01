import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { fetchDraws, fetchImages } from '../../services/api';

const DashboardPage = () => {
  const [draws, setDraws] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDraws(false), fetchImages()])
      .then(([d, i]) => {
        setDraws(d.data.data || []);
        setImages(i.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const published = draws.filter((d) => d.isPublished).length;
  const upcoming = draws.filter((d) => d.status === 'upcoming').length;

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of all lottery activity">
      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-box">
          <div className="stat-box-icon si-orange">🎰</div>
          <div>
            <div className="stat-box-num">{loading ? '—' : draws.length}</div>
            <div className="stat-box-label">Total Draws</div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-box-icon si-green">✅</div>
          <div>
            <div className="stat-box-num">{loading ? '—' : published}</div>
            <div className="stat-box-label">Published</div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-box-icon si-blue">⏳</div>
          <div>
            <div className="stat-box-num">{loading ? '—' : upcoming}</div>
            <div className="stat-box-label">Upcoming</div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-box-icon si-purple">🖼️</div>
          <div>
            <div className="stat-box-num">{loading ? '—' : images.length}</div>
            <div className="stat-box-label">Winner Images</div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h3>⚡ Quick Actions</h3>
            <p>Common administrative tasks</p>
          </div>
        </div>
        <div className="admin-panel-body" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/admin/create-draw" className="btn-ad btn-ad-primary">➕ Create New Draw</Link>
          <Link to="/admin/manage-draws" className="btn-ad btn-ad-dark">🎰 Manage Draws</Link>
          <Link to="/admin/manage-images" className="btn-ad btn-ad-ghost">🖼️ Winner Images</Link>
          <Link to="/" className="btn-ad btn-ad-ghost">🌐 View Website</Link>
        </div>
      </div>

      {/* Recent draws */}
      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h3>📋 Recent Draws</h3>
            <p>Latest lottery entries</p>
          </div>
          <Link to="/admin/manage-draws" className="btn-ad btn-ad-ghost btn-ad-sm">View All →</Link>
        </div>

        {loading ? (
          <div className="ad-empty"><p>Loading…</p></div>
        ) : draws.length === 0 ? (
          <div className="ad-empty">
            <div className="emo">📭</div>
            <p>No draws created yet.</p>
            <Link to="/admin/create-draw" className="btn-ad btn-ad-primary" style={{ marginTop: 14 }}>
              Create Your First Draw
            </Link>
          </div>
        ) : (
          <div className="ad-table-scroll">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Draw Name</th>
                  <th>Phone Number</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {draws.slice(0, 5).map((d) => (
                  <tr key={d._id}>
                    <td><strong>{d.drawName}</strong></td>
                    <td style={{ fontWeight: 700, color: '#ff5722' }}>{d.mobile || '—'}</td>
                    <td>{new Date(d.drawDate).toLocaleDateString('en-IN')}</td>
                    <td><span className="ad-pill pill-blue">{d.status}</span></td>
                    <td>
                      <span className={`ad-pill ${d.isPublished ? 'pill-green' : 'pill-yellow'}`}>
                        {d.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/set-winners/${d._id}`} className="btn-ad btn-ad-primary btn-ad-sm">
                        Set Winners
                      </Link>
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

export default DashboardPage;