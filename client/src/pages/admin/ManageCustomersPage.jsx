import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { fetchCustomers, deleteCustomer } from '../../services/api';

const ManageCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async (q = '') => {
    setLoading(true);
    try {
      const res = await fetchCustomers(q);
      setCustomers(res.data.data || []);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(search);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete profile of "${name}"?`)) return;
    await deleteCustomer(id);
    setMsg('Customer deleted');
    setSelected(null);
    load(search);
    setTimeout(() => setMsg(''), 2500);
  };

  return (
    <AdminLayout title="Customer Profiles" subtitle="Dashboard / Customers">
      {msg && <div className="ad-alert alert-ok">✅ {msg}</div>}

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h3>👥 Registered Customers</h3>
            <p>{customers.length} profile(s) found</p>
          </div>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Search name / mobile / city"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1.5px solid #e2e8f0',
                borderRadius: 8,
                fontSize: '0.82rem',
                minWidth: 200,
              }}
            />
            <button type="submit" className="btn-ad btn-ad-ghost btn-ad-sm">
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="ad-empty"><p>Loading customers…</p></div>
        ) : customers.length === 0 ? (
          <div className="ad-empty">
            <div className="emo">👥</div>
            <p>No customer profiles yet.</p>
          </div>
        ) : (
          <div className="ad-table-scroll">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>City</th>
                  <th>Gender</th>
                  <th>Registered</th>
                  <th>Last Checked</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id}>
                    <td><strong>{c.name}</strong></td>
                    <td style={{ fontWeight: 700, color: '#ff5722' }}>{c.mobile}</td>
                    <td>{c.city || '—'}</td>
                    <td>{c.gender || '—'}</td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {new Date(c.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {c.lastCheckedAt
                        ? new Date(c.lastCheckedAt).toLocaleString('en-IN')
                        : '—'}
                    </td>
                    <td>
                      <div className="ad-actions">
                        <button
                          className="btn-ad btn-ad-primary btn-ad-sm"
                          onClick={() => setSelected(c)}
                        >
                          View
                        </button>
                        <button
                          className="btn-ad btn-ad-red btn-ad-sm"
                          onClick={() => handleDelete(c._id, c.name)}
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

      {/* Profile Detail Modal-like panel */}
      {selected && (
        <div className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h3>📄 Profile Details — {selected.name}</h3>
              <p>Full bio data submitted by customer</p>
            </div>
            <button className="btn-ad btn-ad-ghost btn-ad-sm" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
          <div className="admin-panel-body">
            <div className="ad-form-grid">
              <div><strong>Name:</strong> {selected.name}</div>
              <div><strong>Mobile:</strong> {selected.mobile}</div>
              <div><strong>Email:</strong> {selected.email || '—'}</div>
              <div><strong>Age:</strong> {selected.age || '—'}</div>
              <div><strong>Gender:</strong> {selected.gender || '—'}</div>
              <div><strong>City:</strong> {selected.city || '—'}</div>
              <div><strong>State:</strong> {selected.state || '—'}</div>
              <div><strong>Pincode:</strong> {selected.pincode || '—'}</div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Address:</strong> {selected.address || '—'}
              </div>
              <div>
                <strong>Registered On:</strong>{' '}
                {new Date(selected.createdAt).toLocaleString('en-IN')}
              </div>
              <div>
                <strong>Last Result Check:</strong>{' '}
                {selected.lastCheckedAt
                  ? new Date(selected.lastCheckedAt).toLocaleString('en-IN')
                  : 'Never'}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageCustomersPage;