import React, { useState, useEffect } from 'react';
import { Save, Eye, Trash2, Globe } from 'lucide-react';
import AuthService from '../services/AuthService';

const API_BASE_URL = 'http://localhost:8080/api';

const LANGUAGES = [
  { flag: 'E', label: 'English',  nativeLabel: 'English'  },
  { flag: 'T', label: 'Telugu',   nativeLabel: 'తెలుగు'   },
  { flag: 'H', label: 'Hindi',    nativeLabel: 'हिन्दी'    },
];

const HomeContentBuilder = () => {
  const [selectedLang, setSelectedLang]   = useState(null);   // 'E' | 'T' | 'H'
  const [existingLangs, setExistingLangs] = useState([]);     // flags already in DB
  const [poem, setPoem]                   = useState('');
  const [quote, setQuote]                 = useState('');
  const [bioButton, setBioButton]         = useState('');
  const [saving, setSaving]               = useState(false);
  const [deleting, setDeleting]           = useState(false);
  const [message, setMessage]             = useState('');
  const [recordId, setRecordId]           = useState(null);   // DB id of loaded record

  const buttonStyle = {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.5rem 1rem', borderRadius: '0.5rem',
    border: 'none', cursor: 'pointer',
    fontSize: '0.95rem', color: 'white',
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // ── Load list of languages that already exist in DB ───────────────────────
  useEffect(() => {
    fetch(`${API_BASE_URL}/home-content/all`, {
      headers: AuthService.getAuthHeaders(),
    })
      .then(r => r.json())
      .then(data => setExistingLangs(Array.isArray(data) ? data.map(d => d.language) : []))
      .catch(() => setExistingLangs([]));
  }, []);

  // ── Load content when language tab is selected ────────────────────────────
  useEffect(() => {
    if (!selectedLang) return;
    setPoem('');
    setQuote('');
    setBioButton('');
    setRecordId(null);

    fetch(`${API_BASE_URL}/home-content?lang=${selectedLang}`, {
      headers: AuthService.getAuthHeaders(),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.language === selectedLang) {
          setPoem(data.poem || '');
          setQuote(data.quote || '');
          setBioButton(data.bioButton || '');
          setRecordId(data.id);
        } else {
          // No record yet for this language — start fresh
          const defaultBtn = LANGUAGES.find(l => l.flag === selectedLang)?.label || 'Bio';
          setBioButton(defaultBtn);
        }
      })
      .catch(() => {});
  }, [selectedLang]);

  // ── Save (create or update) ───────────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedLang) return;
    if (!poem.trim()) { showMessage('⚠️ Poem cannot be empty.'); return; }
    if (!quote.trim()) { showMessage('⚠️ Quote cannot be empty.'); return; }

    setSaving(true);
    try {
      let res;
      if (recordId) {
        // UPDATE existing record
        res = await fetch(`${API_BASE_URL}/home-content/${recordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...AuthService.getAuthHeaders() },
          body: JSON.stringify({ poem, quote, bioButton }),
        });
      } else {
        // CREATE new record
        res = await fetch(`${API_BASE_URL}/home-content`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...AuthService.getAuthHeaders() },
          body: JSON.stringify({ language: selectedLang, poem, quote, bioButton }),
        });
      }

      if (!res.ok) throw new Error('Save failed');

      const saved = await res.json();
      setRecordId(saved.id);

      // Refresh existing langs list
      if (!existingLangs.includes(selectedLang)) {
        setExistingLangs(prev => [...prev, selectedLang]);
      }

      showMessage('✅ Content saved successfully!');
    } catch {
      showMessage('❌ Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!recordId) { showMessage('⚠️ No saved record to delete.'); return; }
    if (!window.confirm(`Delete all home content for "${selectedLang}"? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/home-content/${recordId}`, {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders(),
      });

      if (!res.ok) throw new Error('Delete failed');

      setPoem('');
      setQuote('');
      setBioButton(LANGUAGES.find(l => l.flag === selectedLang)?.label || 'Bio');
      setRecordId(null);
      setExistingLangs(prev => prev.filter(l => l !== selectedLang));
      showMessage('✅ Content deleted successfully!');
    } catch {
      showMessage('❌ Delete failed. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // ── Preview: split poem on \n same as HomePage ────────────────────────────
  const poemLines = poem
    ? poem.split('\n').map((line, i) =>
        line.trim() === ''
          ? <br key={i} />
          : <span key={i}>{line}<br /></span>
      )
    : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Poem will appear here…</span>;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>

      {/* ── Language Selector ── */}
      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Globe size={22} color="#1e293b" />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
            Home Content Builder
          </h3>
        </div>

        {message && (
          <div style={{
            padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem',
            background: message.startsWith('✅') ? '#d1fae5' : '#fee2e2',
            color: message.startsWith('✅') ? '#065f46' : '#991b1b',
          }}>
            {message}
          </div>
        )}

        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
          Select language to edit:
        </label>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {LANGUAGES.map(lang => {
            const isActive   = selectedLang === lang.flag;
            const hasRecord  = existingLangs.includes(lang.flag);
            return (
              <button
                key={lang.flag}
                onClick={() => setSelectedLang(lang.flag)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.5rem',
                  border: `2px solid ${isActive ? '#2563eb' : '#d1d5db'}`,
                  background: isActive ? '#2563eb' : 'white',
                  color: isActive ? 'white' : '#374151',
                  cursor: 'pointer',
                  fontWeight: isActive ? '700' : '400',
                  fontSize: '0.95rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  transition: 'all 0.15s',
                }}
              >
                {/* flag badge */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '22px', height: '22px',
                  background: isActive ? 'white' : '#1f2937',
                  color: isActive ? '#2563eb' : 'white',
                  borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700',
                }}>
                  {lang.flag}
                </span>
                {lang.nativeLabel}
                {/* green dot if DB record exists */}
                {hasRecord && (
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: isActive ? 'white' : '#10b981',
                    display: 'inline-block',
                  }} title="Content exists in DB" />
                )}
              </button>
            );
          })}
        </div>

        {selectedLang && (
          <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
            {recordId
              ? `✅ Editing existing record (id: ${recordId}) for language "${selectedLang}"`
              : `🆕 No record yet for "${selectedLang}" — fill in the fields and save to create one.`}
          </p>
        )}
      </div>

      {/* ── Editor ── */}
      {selectedLang && (
        <>
          <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                Editor —&nbsp;
                <span style={{
                  padding: '0.15rem 0.6rem',
                  background: '#1f2937', color: 'white',
                  borderRadius: '0.375rem', fontSize: '0.85rem',
                }}>
                  {LANGUAGES.find(l => l.flag === selectedLang)?.nativeLabel}
                </span>
              </h3>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {recordId && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{ ...buttonStyle, background: deleting ? '#94a3b8' : '#ef4444', cursor: deleting ? 'not-allowed' : 'pointer' }}
                  >
                    <Trash2 size={16} />
                    {deleting ? 'Deleting…' : 'Delete'}
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ ...buttonStyle, background: saving ? '#94a3b8' : '#10b981', cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  <Save size={16} />
                  {saving ? 'Saving…' : (recordId ? 'Update' : 'Create')}
                </button>
              </div>
            </div>

            {/* Poem */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.4rem', color: '#374151' }}>
                Poem <span style={{ fontWeight: '400', color: '#94a3b8', fontSize: '0.8rem' }}>
                  (use Enter/newline for line breaks, blank line for stanza break)
                </span>
              </label>
              <textarea
                value={poem}
                onChange={e => setPoem(e.target.value)}
                rows={14}
                placeholder={"Line 1\nLine 2\n\nNew stanza line 1\nNew stanza line 2"}
                style={{
                  width: '100%', padding: '0.75rem',
                  border: '2px solid #cbd5e1', borderRadius: '0.5rem',
                  outline: 'none', lineHeight: '1.75', fontSize: '1rem',
                  resize: 'vertical', boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Quote */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.4rem', color: '#374151' }}>
                Quote / Artist Statement
              </label>
              <textarea
                value={quote}
                onChange={e => setQuote(e.target.value)}
                rows={4}
                placeholder="Enter the artist's quote or statement…"
                style={{
                  width: '100%', padding: '0.75rem',
                  border: '2px solid #cbd5e1', borderRadius: '0.5rem',
                  outline: 'none', lineHeight: '1.75', fontSize: '1rem',
                  resize: 'vertical', boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Bio Button Label */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.4rem', color: '#374151' }}>
                Bio Button Label
                <span style={{ fontWeight: '400', color: '#94a3b8', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                  (e.g. "Bio", "జీవిత చరిత్ర", "जीवनी")
                </span>
              </label>
              <input
                type="text"
                value={bioButton}
                onChange={e => setBioButton(e.target.value)}
                placeholder="Bio"
                style={{
                  width: '220px', padding: '0.5rem 0.75rem',
                  border: '2px solid #cbd5e1', borderRadius: '0.5rem',
                  outline: 'none', fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Bottom save */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ ...buttonStyle, background: saving ? '#94a3b8' : '#10b981', padding: '0.75rem 2rem', fontSize: '1rem', cursor: saving ? 'not-allowed' : 'pointer' }}
              >
                <Save size={18} />
                {saving ? 'Saving…' : (recordId ? 'Update Content' : 'Create Content')}
              </button>
            </div>
          </div>

          {/* ── Live Preview ── */}
          <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
              <Eye size={22} /> Preview
            </h3>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem', background: '#f8fafc', minHeight: '12rem' }}>

              {/* Poem preview */}
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                  Poem
                </p>
                <p style={{ fontSize: '1rem', color: '#4b5563', lineHeight: '1.9', margin: 0 }}>
                  {poemLines}
                </p>
              </div>

              {/* Quote preview */}
              <div style={{ marginBottom: '2rem', padding: '1rem', background: '#fafafa', borderRadius: '0.375rem', borderLeft: '3px solid #c17a4a' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                  Quote
                </p>
                <p style={{ fontSize: '1rem', color: '#6b7280', fontStyle: 'italic', lineHeight: '1.8', margin: 0 }}>
                  {quote || <span style={{ color: '#d1d5db' }}>Quote will appear here…</span>}
                </p>
              </div>

              {/* Bio button preview */}
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                  Bio Button
                </p>
                <button style={{
                  background: '#1f2937', color: 'white',
                  padding: '0.75rem 1.5rem', border: 'none',
                  borderRadius: '0.25rem', fontSize: '0.95rem',
                  fontWeight: '500', cursor: 'default',
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  {bioButton || 'Bio'} <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeContentBuilder;