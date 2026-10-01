import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { adminLogin } from '../../services/api';

const LoginPage = () => {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminLogin(form);
      login(res.data.data, res.data.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-box">
        <div className="login-logo">🔐</div>
        <h2>Admin Console</h2>
        <p className="login-sub">Kerala State Lottery — Secure Access</p>

        {error && <div className="ad-alert alert-err">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="ad-field">
            <label>Username or Email</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="admin"
              value={form.usernameOrEmail}
              onChange={(e) => setForm({ ...form, usernameOrEmail: e.target.value })}
            />
          </div>

          <div className="ad-field">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                required
                placeholder="••••••••"
                style={{ width: '100%', paddingRight: '48px' }}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem',
                }}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Authenticating…' : 'Sign In Securely'}
          </button>
        </form>

        <div className="login-hint">
          <strong>Default credentials</strong><br />
          Username: <code>admin</code> &nbsp;|&nbsp; Password: <code>admin12345</code>
        </div>

        <Link to="/" className="login-back">← Back to Website</Link>
      </div>
    </div>
  );
};

export default LoginPage;