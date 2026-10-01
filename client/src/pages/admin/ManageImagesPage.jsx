import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { fetchImages, addImage, deleteImage } from '../../services/api';

const ManageImagesPage = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [label, setLabel] = useState('');
  const [order, setOrder] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchImages();
      setImages(res.data.data || []);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Handle local file selection and create instant preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file to upload.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('label', label);
      formData.append('order', order);

      await addImage(formData);

      // Reset form
      setSelectedFile(null);
      setPreviewUrl('');
      setLabel('');
      setOrder(0);
      setMsg('Image uploaded and published successfully!');

      load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, imageLabel) => {
    if (!window.confirm(`Remove "${imageLabel}" from the homepage?`)) return;
    await deleteImage(id);
    setMsg('Image deleted successfully.');
    load();
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <AdminLayout title="Winner Images" subtitle="Dashboard / Winner Images">
      {msg && <div className="ad-alert alert-ok">✅ {msg}</div>}
      {error && <div className="ad-alert alert-err">⚠️ {error}</div>}

      {/* Upload Form */}
      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h3>📁 Upload Winner Photo Directly</h3>
            <p>Select an image file from your computer and set its prize label</p>
          </div>
        </div>

        <div className="admin-panel-body">
          <form onSubmit={handleAdd}>
            <div className="ad-form-grid">
              <div className="ad-field">
                <label>Choose Image File *</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  required
                  onChange={handleFileChange}
                />
                <span className="hint">Supports PNG, JPG, JPEG, WEBP (Max 5MB)</span>
              </div>

              <div className="ad-field">
                <label>Prize Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 Crore 20 Lakh Win"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
                <span className="hint">Text displayed below the photo</span>
              </div>

              <div className="ad-field">
                <label>Display Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                />
                <span className="hint">Lower numbers appear first</span>
              </div>
            </div>

            {/* Instant local preview before upload */}
            {previewUrl && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                  Selected File Preview
                </label>
                <div style={{ marginTop: 8, width: 240, border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ width: '100%', height: 140, objectFit: 'cover' }}
                  />
                  <div style={{ padding: 10, fontSize: '0.85rem', fontWeight: 800, color: '#dc2626' }}>
                    {label || 'Prize Label'}
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="btn-ad btn-ad-primary" disabled={saving}>
              {saving ? 'Uploading Image…' : '📤 Upload & Publish to Homepage'}
            </button>
          </form>
        </div>
      </div>

      {/* Existing Images Gallery */}
      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h3>🖼️ Active Winner Photos</h3>
            <p>{images.length} photo(s) currently displayed on the website</p>
          </div>
        </div>

        <div className="admin-panel-body">
          {loading ? (
            <div className="ad-empty"><p>Loading images…</p></div>
          ) : images.length === 0 ? (
            <div className="ad-empty">
              <div className="emo">🖼️</div>
              <p>No winner photos added yet. Upload one above.</p>
            </div>
          ) : (
            <div className="img-manage-grid">
              {images.map((img) => (
                <div className="img-manage-card" key={img._id}>
                  <img src={img.imageUrl} alt={img.label} />
                  <div className="img-manage-info">
                    <h4>{img.label}</h4>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span className="ad-pill pill-gray">Order {img.order}</span>
                      <button
                        onClick={() => handleDelete(img._id, img.label)}
                        className="btn-ad btn-ad-red btn-ad-sm"
                        style={{ marginLeft: 'auto' }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageImagesPage;