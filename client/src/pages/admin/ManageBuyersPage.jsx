import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { fetchDraws, fetchBuyers, addBuyer, deleteBuyer, bulkAddBuyers } from '../../services/api';

const ManageBuyersPage = () => {
  const [draws, setDraws] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterDraw, setFilterDraw] = useState('');

  // Single add form
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    ticketNumber: '',
    drawId: '',
    notes: '',
  });

  // Bulk paste area: name,mobile,ticket  (one per line)
  const [bulkText, setBulkText] = useState('');
  const [bulkDrawId, setBulkDrawId] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  const loadDraws = async () => {
    try {
      const res = await fetchDraws(false);
      const list = res.data.data || [];
      setDraws(list);
      if (list.length > 0) {
        setForm((f) => ({ ...f, drawId: f.drawId || list[0]._id }));
        setBulkDrawId((id) => id || list[0]._id);
      }
    } catch (e) {}
  };

  const loadBuyers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterDraw) params.drawId = filterDraw;
      if (search) params.search = search;
      const res = await fetchBuyers(params);
      setBuyers(res.data.data || []);
    } catch (e) {
      setError('Failed to load buyers');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDraws();
  }, []);

  useEffect(() => {
    loadBuyers();
  }, [filterDraw]);

  const flash = (text, isError = false) => {
    if (isError) setError(text);
    else setMsg(text);
    setTimeout(() => {
      setMsg('');
      setError('');
    }, 3000);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await addBuyer(form);
      setForm((f) => ({
        ...f,
        name: '',
        mobile: '',
        ticketNumber: '',
        notes: '',
      }));
      flash('Ticket buyer added successfully!');
      loadBuyers();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to add buyer', true);
    } finally {
      setSaving(false);
    }
  };

  const handleBulk = async (e) => {
    e.preventDefault();
    if (!bulkDrawId || !bulkText.trim()) {
      flash('Select draw and paste buyer list', true);
      return;
    }

    const lines = bulkText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const buyersList = lines.map((line) => {
      // formats: name,mobile,ticket   OR  name | mobile | ticket
      const parts = line.split(/[,|\t]/).map((p) => p.trim());
      return {
        name: parts[0] || '',
        mobile: parts[1] || '',
        ticketNumber: parts[2] || '',
      };
    }).filter((b) => b.name && b.mobile && b.ticketNumber);

    if (buyersList.length === 0) {
      flash('No valid rows found. Use: Name, Mobile, TicketNumber', true);
      return;
    }

    setSaving(true);
    try {
      const res = await bulkAddBuyers({ drawId: bulkDrawId, buyers: buyersList });
      flash(res.data.message || 'Buyers added');
      setBulkText('');
      loadBuyers();
    } catch (err) {
      flash(err.response?.data?.message || 'Bulk add failed', true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete buyer "${name}"?`)) return;
    await deleteBuyer(id);
    flash('Buyer deleted');
    loadBuyers();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadBuyers();
  };

  return (
    <AdminLayout title="Ticket Buyers" subtitle="Dashboard / Ticket Buyers">
      {msg && <div className="ad-alert alert-ok">✅ {msg}</div>}
      {error && <div className="ad-alert alert-err">⚠️ {error}</div>}

      {/* Add single buyer */}
      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h3>➕ Register Ticket Buyer</h3>
            <p>Add a person who bought a lottery ticket (mobile + ticket number)</p>
          </div>
          <button
            type="button"
            className="btn-ad btn-ad-ghost btn-ad-sm"
            onClick={() => setShowBulk(!showBulk)}
          >
            {showBulk ? 'Single Entry' : '📋 Bulk Upload'}
          </button>
        </div>

        <div className="admin-panel-body">
          {!showBulk ? (
            <form onSubmit={handleAdd}>
              <div className="ad-form-grid">
                <div className="ad-field">
                  <label>Buyer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="ad-field">
                  <label>Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  />
                  <span className="hint">Used on homepage to check result</span>
                </div>

                <div className="ad-field">
                  <label>Ticket Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KR624001"
                    value={form.ticketNumber}
                    onChange={(e) => setForm({ ...form, ticketNumber: e.target.value })}
                  />
                </div>

                <div className="ad-field">
                  <label>Select Draw *</label>
                  <select
                    required
                    value={form.drawId}
                    onChange={(e) => setForm({ ...form, drawId: e.target.value })}
                  >
                    <option value="">-- Choose Draw --</option>
                    {draws.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.drawName} ({d.drawCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ad-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Notes (optional)</label>
                  <input
                    type="text"
                    placeholder="Any extra note"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn-ad btn-ad-primary" disabled={saving}>
                {saving ? 'Saving…' : '💾 Add Ticket Buyer'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleBulk}>
              <div className="ad-field">
                <label>Select Draw *</label>
                <select
                  required
                  value={bulkDrawId}
                  onChange={(e) => setBulkDrawId(e.target.value)}
                >
                  <option value="">-- Choose Draw --</option>
                  {draws.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.drawName} ({d.drawCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="ad-field">
                <label>Paste Buyers List *</label>
                <textarea
                  rows="8"
                  required
                  placeholder={`One buyer per line:\nName, Mobile, TicketNumber\n\nExample:\nRamesh Kumar, 9876543210, KR624001\nAnita Sharma, 9123456780, KR624002`}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                />
                <span className="hint">Format: Name, Mobile, TicketNumber (comma or | separated)</span>
              </div>

              <button type="submit" className="btn-ad btn-ad-primary" disabled={saving}>
                {saving ? 'Importing…' : '📥 Import Buyers'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Buyers list */}
      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h3>👥 Registered Buyers</h3>
            <p>{buyers.length} buyer(s) found</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <select
              value={filterDraw}
              onChange={(e) => setFilterDraw(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1.5px solid #e2e8f0',
                borderRadius: 8,
                fontSize: '0.82rem',
              }}
            >
              <option value="">All Draws</option>
              {draws.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.drawCode}
                </option>
              ))}
            </select>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                placeholder="🔍 Name / Mobile / Ticket"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: '0.82rem',
                  minWidth: 160,
                }}
              />
              <button type="submit" className="btn-ad btn-ad-ghost btn-ad-sm">
                Search
              </button>
            </form>
          </div>
        </div>

        {loading ? (
          <div className="ad-empty"><p>Loading buyers…</p></div>
        ) : buyers.length === 0 ? (
          <div className="ad-empty">
            <div className="emo">👥</div>
            <p>No ticket buyers registered yet.</p>
          </div>
        ) : (
          <div className="ad-table-scroll">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile Number</th>
                  <th>Ticket No.</th>
                  <th>Draw</th>
                  <th>Added</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((b) => (
                  <tr key={b._id}>
                    <td><strong>{b.name}</strong></td>
                    <td style={{ fontWeight: 700, color: '#ff5722' }}>{b.mobile}</td>
                    <td><code>{b.ticketNumber}</code></td>
                    <td>
                      {b.drawId?.drawName || '—'}
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {b.drawId?.drawCode}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(b.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(b._id, b.name)}
                        className="btn-ad btn-ad-red btn-ad-sm"
                      >
                        Delete
                      </button>
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

export default ManageBuyersPage;