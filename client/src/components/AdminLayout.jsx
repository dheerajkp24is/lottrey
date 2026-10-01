import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminLayout = ({ title, subtitle, children }) => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/admin/login');
    }
  };

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const navItems = [
  {
    group: 'Main',
    items: [
      { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    ],
  },
  {
    group: 'Lottery Management',
    items: [
      { path: '/admin/create-draw', icon: '➕', label: 'Create Draw' },
      { path: '/admin/manage-draws', icon: '🎰', label: 'Manage Draws' },
      { path: '/admin/set-winners', icon: '🏆', label: 'Set Winners' },
      { path: '/admin/manage-buyers', icon: '👥', label: 'Ticket Buyers' },
    ],
  },
  {
    group: 'Website Content',
    items: [
      { path: '/admin/manage-images', icon: '🖼️', label: 'Winner Images' },
    ],
  },
  {
    group: 'Public Site',
    items: [
      { path: '/', icon: '🌐', label: 'View Website' },
    ],
  },
];
  const initial = admin?.username ? admin.username.charAt(0).toUpperCase() : 'A';

  return (
    <div className="admin-wrapper">
      {/* Mobile overlay */}
      <div className={`sidebar-overlay ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="logo-sq">🏛️</div>
          <div>
            <h2>Kerala Lottery</h2>
            <p>Admin Console</p>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map((group, gi) => (
            <div key={gi}>
              <div className="admin-nav-title">{group.group}</div>
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-nav-item ${isActive(item.path)}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-box">
            <div className="admin-avatar">{initial}</div>
            <div>
              <div className="uname">{admin?.username || 'Administrator'}</div>
              <div className="urole">Super Admin</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            ⏻ Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="admin-content">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="admin-hamburger" onClick={() => setOpen(!open)}>☰</button>
            <div>
              <h1>{title}</h1>
              {subtitle && <div className="crumb">{subtitle}</div>}
            </div>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </header>

        <div className="admin-body">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;