import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { createDraw } from '../../services/api';

const CreateDrawPage = () => {
  const [form, setForm] = useState({
    drawName: '',
    mobile: '',
    drawDate: '',
    ticketPrice: 50,
    status: 'upcoming',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createDraw(form);
      navigate('/admin/manage-draws');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create draw');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Create New Draw" subtitle="Dashboard / Create Draw">
      <div className="admin-panel" style={{ maxWidth: 760 }}>
        <div className="admin-panel-head">
          <div>
            <h3>🎰 Create New Draw Entry</h3>
            <p>Fill in the details including the phone number</p>
          </div>
          <Link to="/admin/manage-draws" className="btn-ad btn-ad-ghost btn-ad-sm">
            ← Back
          </Link>
        </div>

        <div className="admin-panel-body">
          {error && <div className="ad-alert alert-err">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="ad-form-grid">
              <div className="ad-field">
                <label>Draw Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kerala State Lottery - Karunya KR"
                  value={form.drawName}
                  onChange={(e) => setForm({ ...form, drawName: e.target.value })}
                />
              </div>

              <div className="ad-field">
                <label>Phone Number / Mobile *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                />
                <span className="hint">Used by users to check results</span>
              </div>

              <div className="ad-field">
                <label>Draw Date *</label>
                <input
                  type="date"
                  required
                  value={form.drawDate}
                  onChange={(e) => setForm({ ...form, drawDate: e.target.value })}
                />
              </div>

              <div className="ad-field">
                <label>Ticket Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={form.ticketPrice}
                  onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })}
                />
              </div>

              <div className="ad-field">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button type="submit" className="btn-ad btn-ad-primary" disabled={loading}>
                {loading ? 'Saving…' : '💾 Save Draw'}
              </button>
              <Link to="/admin/manage-draws" className="btn-ad btn-ad-ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateDrawPage;