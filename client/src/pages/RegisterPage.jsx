import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { registerCustomer } from '../services/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillMobile = location.state?.mobile || '';

  const [form, setForm] = useState({
    name: '',
    mobile: prefillMobile,
    email: '',
    age: '',
    gender: '',
    address: '',
    city: '',
    state: 'Kerala',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (prefillMobile) {
      setForm((f) => ({ ...f, mobile: prefillMobile }));
    }
  }, [prefillMobile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await registerCustomer({
        ...form,
        age: form.age ? Number(form.age) : null,
      });

      // Save profile lightly in localStorage for convenience
      localStorage.setItem('lottery_customer_mobile', res.data.data.mobile);
      localStorage.setItem('lottery_customer_name', res.data.data.name);

      // After register → go check result with this mobile
      navigate('/', {
        state: {
          registeredMobile: res.data.data.mobile,
          justRegistered: true,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kg-main">
      <div className="kg-padding" style={{ paddingTop: 20 }}>
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1a1a1a', marginBottom: 6 }}>
            📝 Create Your Profile
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 18 }}>
            Please enter your bio details before checking lottery results.
          </p>

          {error && (
            <div className="kg-result-lose" style={{ marginBottom: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Full Name *</label>
            <input
              className="kg-input"
              name="name"
              required
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
            />

            <label style={labelStyle}>Mobile Number *</label>
            <input
              className="kg-input"
              name="mobile"
              required
              placeholder="10-digit mobile number"
              value={form.mobile}
              onChange={handleChange}
            />

            <label style={labelStyle}>Email (optional)</label>
            <input
              className="kg-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Age</label>
                <input
                  className="kg-input"
                  type="number"
                  name="age"
                  min="18"
                  placeholder="Age"
                  value={form.age}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={labelStyle}>Gender</label>
                <select
                  className="kg-input"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <label style={labelStyle}>Address</label>
            <input
              className="kg-input"
              name="address"
              placeholder="House / Street"
              value={form.address}
              onChange={handleChange}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>City</label>
                <input
                  className="kg-input"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={labelStyle}>Pincode</label>
                <input
                  className="kg-input"
                  name="pincode"
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label style={labelStyle}>State</label>
            <input
              className="kg-input"
              name="state"
              value={form.state}
              onChange={handleChange}
            />

            <button type="submit" className="kg-btn-blue" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'SAVING PROFILE...' : 'REGISTER & CONTINUE'}
            </button>
          </form>

          <Link
            to="/"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: 14,
              fontSize: '0.8rem',
              color: '#6b7280',
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '#374151',
  marginBottom: 4,
  textTransform: 'uppercase',
};

export default RegisterPage;