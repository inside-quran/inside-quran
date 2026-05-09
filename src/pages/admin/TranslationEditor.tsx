// src/pages/admin/TranslationEditor.tsx
import { useState } from 'react';
import AdminLayout from './AdminLayout';
import { fetchVerses, updateTranslation } from '@/utils/adminApi';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'bn', label: 'Bengali' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ur', label: 'Urdu' },
];

const SURAH_NAMES: Record<number, string> = {};
for (let i = 1; i <= 114; i++) SURAH_NAMES[i] = `Surah ${i}`;

export default function TranslationEditor() {
  const [surahId, setSurahId] = useState<number>(1);
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<any>(null);
  const [activeLang, setActiveLang] = useState('en');
  const [editText, setEditText] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const loadVerses = async () => {
    setLoading(true);
    setSelectedVerse(null);
    try {
      const data = await fetchVerses(surahId);
      setVerses(data.verses || []);
    } catch {
      showToast('error', 'Failed to load verses');
    } finally {
      setLoading(false);
    }
  };

  const handleVerseClick = (verse: any) => {
    setSelectedVerse(verse);
    setEditText(verse.translations?.[activeLang] || '');
  };

  const handleLangChange = (lang: string) => {
    setActiveLang(lang);
    if (selectedVerse) {
      setEditText(selectedVerse.translations?.[lang] || '');
    }
  };

  const handleSave = async () => {
    if (!selectedVerse) return;
    setSaving(true);
    try {
      await updateTranslation(surahId, selectedVerse.verse_number || selectedVerse.id, activeLang, editText);
      // Update local state
      setVerses(prev => prev.map(v => {
        if ((v.verse_number || v.id) === (selectedVerse.verse_number || selectedVerse.id)) {
          return { ...v, translations: { ...v.translations, [activeLang]: editText } };
        }
        return v;
      }));
      setSelectedVerse((prev: any) => ({ ...prev, translations: { ...prev.translations, [activeLang]: editText } }));
      showToast('success', 'Translation saved successfully!');
    } catch {
      showToast('error', 'Failed to save translation');
    } finally {
      setSaving(false);
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

      <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px' }}>Translation Editor</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: '0 0 32px' }}>
        Select a Surah, then click any verse to edit its translation.
      </p>

      {/* Surah Selector */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap' }}>
        <select
          id="surah-selector"
          value={surahId}
          onChange={e => setSurahId(Number(e.target.value))}
          style={{
            padding: '10px 16px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer',
          }}
        >
          {Array.from({ length: 114 }, (_, i) => i + 1).map(n => (
            <option key={n} value={n} style={{ background: '#1a1a2e' }}>Surah {n}</option>
          ))}
        </select>
        <button
          id="load-verses-btn"
          onClick={loadVerses}
          disabled={loading}
          style={{
            padding: '10px 24px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none', color: '#fff', fontSize: '14px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Loading...' : 'Load Verses'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: verses.length ? '1fr 1fr' : '1fr', gap: '20px' }}>
        {/* Verse List */}
        {verses.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', overflow: 'hidden', maxHeight: '600px', overflowY: 'auto',
          }}>
            {verses.map(verse => {
              const num = verse.verse_number || verse.id;
              const isSelected = selectedVerse && (selectedVerse.verse_number || selectedVerse.id) === num;
              return (
                <div
                  key={num}
                  id={`verse-${num}`}
                  onClick={() => handleVerseClick(verse)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(102,126,234,0.15)' : 'transparent',
                    borderLeft: isSelected ? '3px solid #667eea' : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div>
                      <span style={{
                        display: 'inline-block', background: 'rgba(102,126,234,0.2)',
                        color: '#a5b4fc', borderRadius: '6px', padding: '2px 8px',
                        fontSize: '12px', fontWeight: 600, marginBottom: '6px',
                      }}>Verse {num}</span>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
                        {verse.translations?.en?.slice(0, 80) || 'No translation'}...
                      </p>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: '2px', whiteSpace: 'nowrap' }}>
                      ✏️ Edit
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Editor Panel */}
        {selectedVerse && (
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '24px',
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 600 }}>
              Editing Verse {selectedVerse.verse_number || selectedVerse.id}
            </h3>

            {/* Lang Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {LANGS.map(lang => (
                <button
                  key={lang.code}
                  id={`lang-tab-${lang.code}`}
                  onClick={() => handleLangChange(lang.code)}
                  style={{
                    padding: '6px 16px', borderRadius: '8px', border: 'none',
                    background: activeLang === lang.code ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.08)',
                    color: activeLang === lang.code ? '#fff' : 'rgba(255,255,255,0.5)',
                    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              id="translation-textarea"
              value={editText}
              onChange={e => setEditText(e.target.value)}
              rows={8}
              style={{
                width: '100%', padding: '14px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px', color: '#fff',
                fontSize: '14px', lineHeight: 1.7, outline: 'none',
                resize: 'vertical', boxSizing: 'border-box',
                fontFamily: activeLang === 'ur' ? 'serif' : 'inherit',
                direction: activeLang === 'ur' ? 'rtl' : 'ltr',
              }}
            />

            {/* Save */}
            <button
              id="save-translation-btn"
              onClick={handleSave}
              disabled={saving}
              style={{
                marginTop: '16px', width: '100%', padding: '12px',
                background: saving ? 'rgba(34,197,94,0.3)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                border: 'none', borderRadius: '10px',
                color: '#fff', fontSize: '15px', fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Saving...' : '💾 Save Translation'}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
