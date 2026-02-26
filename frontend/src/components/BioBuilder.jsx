import React, { useState, useEffect } from 'react';
import { Plus, MoveUp, MoveDown, Trash2, Save, Eye, Type, Heading } from 'lucide-react';
import AuthService from '../services/AuthService';

const API_BASE_URL = 'http://localhost:8080/api';

const BioBuilder = () => {
  const [rows, setRows] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [existingPages, setExistingPages] = useState([]);
  const [newPageNum, setNewPageNum] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: 'white',
  };

  // ── Load existing pages on mount ──────────────────────────────────────────
 useEffect(() => {
  fetch(`${API_BASE_URL}/bio-paragraphs/pages`)
    .then(r => r.json())
    .then(data => {console.log("Data for existing pages", data)
      setExistingPages(Array.isArray(data) ? data : [])})
    .catch(() => setExistingPages([]));
}, []);

  // ── Load rows when page changes ───────────────────────────────────────────
  useEffect(() => {
    if (selectedPage === null) return;
    fetch(`${API_BASE_URL}/bio-paragraphs/page/${selectedPage}`)
      .then(r => r.json())
      .then(data => setRows(data.sort((a, b) => a.order - b.order)))
      .catch(() => setRows([]));
  }, [selectedPage]);

  // ── Row helpers ───────────────────────────────────────────────────────────

  const addRow = (isHeader) => {
    // Only one header allowed per page
    if (isHeader && rows.some(r => r.header === '1')) {
      setMessage('⚠️ This page already has a header. Remove it first.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    const nextOrder = rows.length > 0 ? Math.max(...rows.map(r => r.order)) + 1 : 1;
    setRows(prev => [...prev, {
      id: null,
      paragraph: '',
      page: selectedPage,
      order: nextOrder,
      header: isHeader ? '1' : '0',
    }]);
  };

  const updateText = (index, value) => {
    setRows(prev => prev.map((r, i) => i === index ? { ...r, paragraph: value } : r));
  };

  const deleteRow = (index) => {
    setRows(prev => prev.filter((_, i) => i !== index).map((r, i) => ({ ...r, order: i + 1 })));
  };

  const moveRow = (index, direction) => {
    const newRows = [...rows];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= newRows.length) return;
    [newRows[index], newRows[swapIndex]] = [newRows[swapIndex], newRows[index]];
    setRows(newRows.map((r, i) => ({ ...r, order: i + 1 })));
  };

  // ── New page ──────────────────────────────────────────────────────────────

  const handleNewPage = () => {
    const num = parseInt(newPageNum, 10);
    if (isNaN(num) || num < 1) {
      setMessage('⚠️ Enter a valid page number (≥ 1).');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (existingPages.includes(num)) {
      setMessage(`⚠️ Page ${num} already exists — select it from the list above.`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setSelectedPage(num);
    setRows([]);
    setNewPageNum('');
  };

  // -----Delete ----------------------------------

  const handleDeletePage = async (pageNum) => {
  if (!window.confirm(`Are you sure you want to delete Page ${pageNum} and all its content?`)) return;

  try {
    const res = await fetch(`${API_BASE_URL}/bio-paragraphs/page/${pageNum}`, {
      method: 'DELETE',
      headers: { ...AuthService.getAuthHeaders() },
    });

    if (!res.ok) throw new Error('Delete failed');

    // Remove from page list and clear editor if it was selected
    setExistingPages(prev => prev.filter(p => p !== pageNum));
    if (selectedPage === pageNum) {
      setSelectedPage(null);
      setRows([]);
    }
    setMessage('✅ Page deleted successfully!');
    setTimeout(() => setMessage(''), 3000);
  } catch {
    setMessage('❌ Delete failed. Please try again.');
    setTimeout(() => setMessage(''), 3000);
  }
};

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (selectedPage === null) return;
    if (rows.length === 0) {
      setMessage('⚠️ Add at least one row before saving.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setSaving(true);
    try {
      const payload = rows.map((r, i) => ({ ...r, order: i + 1, page: selectedPage, id: null }));

      const res = await fetch(`${API_BASE_URL}/bio-paragraphs/page/${selectedPage}/bulk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save failed');

      const saved = await res.json();
      setRows(saved.sort((a, b) => a.order - b.order));

      // Refresh page list
      const pagesRes = await fetch(`${API_BASE_URL}/bio-paragraphs/pages`);
      setExistingPages(await pagesRes.json());

      setMessage('✅ Biography saved successfully!');
    } catch {
      setMessage('❌ Save failed. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // ── Preview data ──────────────────────────────────────────────────────────
  const previewHeader = rows.find(r => r.header === '1');
  const previewParagraphs = rows.filter(r => r.header !== '1');

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>

      {/* ── Page Selector ── */}
      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
          Biography Builder
        </h3>

        {message && (
          <div style={{
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            background: message.startsWith('✅') ? '#d1fae5' : '#fee2e2',
            color: message.startsWith('✅') ? '#065f46' : '#991b1b',
          }}>
            {message}
          </div>
        )}

        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
          Select page to edit:
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          {existingPages.map(p => (
  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
    <button
      onClick={() => setSelectedPage(p)}
      style={{
        padding: '0.4rem 1rem',
        borderRadius: '0.375rem 0 0 0.375rem',
        border: '1px solid',
        borderColor: selectedPage === p ? '#2563eb' : '#d1d5db',
        borderRight: 'none',
        background: selectedPage === p ? '#2563eb' : 'white',
        color: selectedPage === p ? 'white' : '#374151',
        cursor: 'pointer',
        fontWeight: selectedPage === p ? '600' : '400',
      }}
    >
      Page {p}
    </button>
    <button
      onClick={() => handleDeletePage(p)}
      style={{
        padding: '0.4rem 0.5rem',
        borderRadius: '0 0.375rem 0.375rem 0',
        border: '1px solid',
        borderColor: selectedPage === p ? '#2563eb' : '#d1d5db',
        background: selectedPage === p ? '#1d4ed8' : '#fee2e2',
        color: selectedPage === p ? 'white' : '#dc2626',
        cursor: 'pointer',
        fontSize: '0.75rem',
        lineHeight: 1,
      }}
      title={`Delete Page ${p}`}
    >
      ✕
    </button>
  </div>
))}

          {/* New page */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginLeft: '0.5rem' }}>
            <input
              type="number"
              min="1"
              value={newPageNum}
              onChange={e => setNewPageNum(e.target.value)}
              placeholder="New page #"
              style={{ width: '7rem', padding: '0.4rem 0.6rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}
            />
            <button style={{ ...buttonStyle, background: '#059669', padding: '0.4rem 0.8rem', fontSize: '0.875rem' }} onClick={handleNewPage}>
              <Plus size={14} /> New Page
            </button>
          </div>
        </div>
      </div>

      {selectedPage !== null && (
        <>
          {/* ── Block Editor ── */}
          <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
                Editor — Page {selectedPage}
              </h3>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ ...buttonStyle, background: saving ? '#94a3b8' : '#10b981', cursor: saving ? 'not-allowed' : 'pointer' }}
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Page'}
              </button>
            </div>

            {/* Add block buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <button
                onClick={() => addRow(false)}
                style={{ ...buttonStyle, background: '#2563eb' }}
              >
                <Type size={18} />
                Add Paragraph
              </button>
              <button
                onClick={() => addRow(true)}
                disabled={rows.some(r => r.header === '1')}
                style={{
                  ...buttonStyle,
                  background: rows.some(r => r.header === '1') ? '#94a3b8' : '#7c3aed',
                  cursor: rows.some(r => r.header === '1') ? 'not-allowed' : 'pointer',
                }}
                title={rows.some(r => r.header === '1') ? 'Page already has a header' : 'Add section heading'}
              >
                <Heading size={18} />
                Add Header
              </button>
            </div>

            {/* Block list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {rows.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: '0.5rem' }}>
                  No blocks yet. Click "Add Paragraph" or "Add Header" to start.
                </div>
              )}

              {rows.map((row, index) => (
                <div
                  key={index}
                  style={{
                    border: `2px solid ${row.header === '1' ? '#c4b5fd' : '#e2e8f0'}`,
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    background: row.header === '1' ? '#f5f3ff' : '#fafafa',
                  }}
                >
                  {/* Block header bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{
                      fontWeight: '600',
                      color: row.header === '1' ? '#6d28d9' : '#334155',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}>
                      {row.header === '1'
                        ? <><Heading size={15} /> Header (Section Title)</>
                        : <><Type size={15} /> Paragraph {rows.filter((r, i) => r.header !== '1' && i <= index).length}</>
                      }
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button
                        onClick={() => moveRow(index, -1)}
                        disabled={index === 0}
                        style={{ background: 'none', border: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', padding: '0.25rem' }}
                        title="Move up"
                      >
                        <MoveUp size={18} style={{ color: index === 0 ? '#cbd5e1' : '#475569' }} />
                      </button>
                      <button
                        onClick={() => moveRow(index, 1)}
                        disabled={index === rows.length - 1}
                        style={{ background: 'none', border: 'none', cursor: index === rows.length - 1 ? 'not-allowed' : 'pointer', padding: '0.25rem' }}
                        title="Move down"
                      >
                        <MoveDown size={18} style={{ color: index === rows.length - 1 ? '#cbd5e1' : '#475569' }} />
                      </button>
                      <button
                        onClick={() => deleteRow(index)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                        title="Delete"
                      >
                        <Trash2 size={18} style={{ color: '#dc2626' }} />
                      </button>
                    </div>
                  </div>

                  {/* Text input */}
                  <textarea
                    value={row.paragraph}
                    onChange={e => updateText(index, e.target.value)}
                    rows={row.header === '1' ? 2 : 4}
                    placeholder={row.header === '1' ? 'Enter section heading…' : 'Enter paragraph text…'}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      lineHeight: '1.75',
                      fontSize: row.header === '1' ? '1.1rem' : '1rem',
                      fontWeight: row.header === '1' ? '600' : '400',
                      background: 'white',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Bottom save */}
            {rows.length > 0 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ ...buttonStyle, background: saving ? '#94a3b8' : '#10b981', padding: '0.75rem 2rem', fontSize: '1rem' }}
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Page'}
                </button>
              </div>
            )}
          </div>

          {/* ── Live Preview ── */}
          <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
              <Eye size={22} /> Preview
            </h3>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem', background: '#f8fafc', minHeight: '12rem' }}>
              {rows.length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Your biography content will appear here…</p>
              ) : (
                <div style={{ fontSize: '1rem', color: '#4b5563', lineHeight: '1.8' }}>
                  {previewHeader && (
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
                      {previewHeader.paragraph || <span style={{ color: '#94a3b8' }}>Section heading…</span>}
                    </h2>
                  )}
                  {previewParagraphs.map((row, i) => (
                    <p key={i} style={{ marginBottom: '1rem' }}>
                      {row.paragraph || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Empty paragraph…</span>}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BioBuilder;
