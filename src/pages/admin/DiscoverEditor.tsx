// src/pages/admin/DiscoverEditor.tsx
// Reusable editor for Duas, Topics, and Shane Nuzul (JSON editing)
import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { fetchDiscoverData, updateDiscoverData } from '@/utils/adminApi';

type DiscoverType = 'duas' | 'topics' | 'shane-nuzul';

const CONFIG: Record<DiscoverType, { label: string; icon: string; desc: string }> = {
  duas: { label: 'Duas', icon: '🤲', desc: 'Edit the list of Islamic Duas shown in the app.' },
  topics: { label: 'Topics', icon: '📚', desc: 'Edit Quranic topics and their associated verses.' },
  'shane-nuzul': { label: 'Shane Nuzul', icon: '📖', desc: 'Edit the revelation context for each Surah.' },
};

export default function DiscoverEditor({ type }: { type: DiscoverType }) {
  const [data, setData] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parseError, setParseError] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const config = CONFIG[type];

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    setLoading(true);
    fetchDiscoverData(type)
      .then(json => {
        setData(JSON.stringify(json, null, 2));
        setLoading(false);
      })
      .catch(() => {
        showToast('error', `Failed to load ${config.label} data`);
        setLoading(false);
      });
  }, [type]);

  const handleSave = async () => {
    setParseError('');
    let parsed: unknown;
    try {
      parsed = JSON.parse(data);
    } catch {
      setParseError('Invalid JSON! Please fix the syntax before saving.');
      return;
    }
    setSaving(true);
    try {
      await updateDiscoverData(type, parsed);
      showToast('success', `${config.label} saved successfully!`);
    } catch {
      showToast('error', `Failed to save ${config.label}`);
    } finally {
      setSaving(false);
    }
  };

  const handleFormat = () => {
    try {
      setData(JSON.stringify(JSON.parse(data), null, 2));
      setParseError('');
    } catch {
      setParseError('Cannot format: Invalid JSON syntax.');
    }
  };

  return (
    <AdminLayout>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 1000,
          background: toast.type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: toast.type === 'success' ? '#86efac' : '#fca5a5',
          padding: '12px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 500,
        }}>
          {toast.type === 'success' ? '✅ ' : '❌ '}{toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px' }}>
            {config.icon} {config.label} Editor
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>{config.desc}</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            id={`format-${type}-btn`}
            onClick={handleFormat}
            style={{
              padding: '10px 20px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
            }}
          >
            ✨ Format JSON
          </button>
          <button
            id={`save-${type}-btn`}
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 24px', borderRadius: '10px',
              background: saving ? 'rgba(34,197,94,0.3)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
              border: 'none', color: '#fff', fontSize: '14px', fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      {/* Parse Error */}
      {parseError && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '10px', padding: '12px 16px',
          color: '#fca5a5', fontSize: '13px', marginBottom: '16px',
        }}>
          ⚠️ {parseError}
        </div>
      )}

      {/* JSON Editor */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: 'monospace' }}>
            JSON • {type}.json
          </span>
        </div>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
            Loading data...
          </div>
        ) : (
          <textarea
            id={`${type}-json-editor`}
            value={data}
            onChange={e => { setData(e.target.value); setParseError(''); }}
            style={{
              width: '100%', minHeight: '550px', padding: '20px',
              background: 'transparent', border: 'none', outline: 'none',
              color: '#a5f3fc', fontSize: '13px', fontFamily: 'monospace',
              lineHeight: 1.7, resize: 'vertical', boxSizing: 'border-box',
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
