// src/pages/admin/AdminLayout.tsx
// Shared layout for all admin pages (sidebar + header)

import { useNavigate, useLocation, Link } from 'react-router-dom';
import { adminLogout } from '@/utils/adminApi';

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/admin/translations', label: 'Translations', icon: '📝' },
  { path: '/admin/duas', label: 'Duas', icon: '🤲' },
  { path: '/admin/topics', label: 'Topics', icon: '📚' },
  { path: '/admin/shane-nuzul', label: 'Shane Nuzul', icon: '📖' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f14', fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', flexShrink: 0,
        background: 'rgba(255,255,255,0.03)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
        padding: '24px 16px',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '8px 12px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>🕌</span>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>Inside Quran</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '10px',
                  marginBottom: '4px',
                  background: isActive ? 'rgba(102,126,234,0.2)' : 'transparent',
                  border: isActive ? '1px solid rgba(102,126,234,0.3)' : '1px solid transparent',
                  color: isActive ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                  textDecoration: 'none', fontSize: '14px', fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s',
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          id="admin-logout-btn"
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '10px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#fca5a5', fontSize: '14px', fontWeight: 500,
            cursor: 'pointer', width: '100%', marginTop: '8px',
            transition: 'all 0.2s',
          }}
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', color: '#fff' }}>
        {children}
      </main>
    </div>
  );
}
