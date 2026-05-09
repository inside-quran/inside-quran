// src/pages/admin/AdminDashboard.tsx
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';

const QUICK_LINKS = [
  { to: '/admin/translations', icon: '📝', label: 'Edit Translations', desc: 'Edit EN, BN, HI, UR translations for any verse' },
  { to: '/admin/duas', icon: '🤲', label: 'Edit Duas', desc: 'Add or edit Islamic duas content' },
  { to: '/admin/topics', icon: '📚', label: 'Edit Topics', desc: 'Manage Quranic topics and references' },
  { to: '/admin/shane-nuzul', icon: '📖', label: 'Edit Shane Nuzul', desc: 'Update revelation context for Surahs' },
];

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px', padding: '24px',
      display: 'flex', alignItems: 'center', gap: '16px',
    }}>
      <div style={{ fontSize: '36px' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#a5b4fc' }}>{value}</div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{label}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px' }}>Dashboard</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: '0 0 40px' }}>
          Welcome back! Manage your Quran content from here.
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          <StatCard icon="📖" label="Total Surahs" value="114" />
          <StatCard icon="🌍" label="Languages" value="4" />
          <StatCard icon="🤲" label="Duas" value="∞" />
          <StatCard icon="📚" label="Topics" value="15+" />
        </div>

        {/* Quick Links */}
        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {QUICK_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '24px',
                textDecoration: 'none', color: '#fff',
                display: 'flex', flexDirection: 'column', gap: '10px',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '28px' }}>{link.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{link.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px' }}>{link.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
