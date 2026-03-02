import React, { useState, useEffect } from 'react';
import { Trash2, Save, Edit2, X, MessageCircle, Reply, Search, RefreshCw } from 'lucide-react';
import AuthService from '../services/AuthService';

const API_BASE_URL = 'http://localhost:8080/api';

const GuestbookBuilder = () => {
  const [entries, setEntries]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [message, setMessage]         = useState('');
  const [searchTerm, setSearchTerm]   = useState('');
  const [editingId, setEditingId]     = useState(null);
  const [editName, setEditName]       = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [saving, setSaving]           = useState(false);

  const buttonStyle = {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.4rem 0.85rem', borderRadius: '0.375rem',
    border: 'none', cursor: 'pointer',
    fontSize: '0.8rem', fontWeight: '600', color: 'white',
    transition: 'opacity 0.15s',
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // ── Fetch all entries ─────────────────────────────────────────────────────
  const fetchEntries = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/guestbook`, {
      headers: AuthService.getAuthHeaders(),
    })
      .then(r => r.json())
      .then(data => setEntries(Array.isArray(data) ? data : []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEntries(); }, []);

  // ── Group entries into threads ────────────────────────────────────────────
  const grouped = entries.reduce((acc, entry) => {
    if (!entry.parentId) {
      acc.push({ ...entry, replies: entries.filter(e => e.parentId === entry.id) });
    }
    return acc;
  }, []);

  // ── Filter by search ──────────────────────────────────────────────────────
  const filtered = grouped.filter(entry =>
    !searchTerm ||
    entry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.replies?.some(r =>
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.message?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id, isReply = false) => {
    const label = isReply ? 'this reply' : 'this entry and all its replies';
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/guestbook/${id}`, {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders(),
      });
      if (!res.ok) throw new Error();
      setEntries(prev => {
        // Remove the entry itself and any children
        return prev.filter(e => e.id !== id && e.parentId !== id);
      });
      showMessage('✅ Deleted successfully!');
    } catch {
      showMessage('❌ Delete failed. Please try again.');
    }
  };

  // ── Start editing ─────────────────────────────────────────────────────────
  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditName(entry.name);
    setEditMessage(entry.message);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditMessage('');
  };

  // ── Save edit ─────────────────────────────────────────────────────────────
  const handleSaveEdit = async (id) => {
    if (!editName.trim() || !editMessage.trim()) {
      showMessage('⚠️ Name and message cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/guestbook/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...AuthService.getAuthHeaders() },
        body: JSON.stringify({ name: editName, message: editMessage }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
      cancelEdit();
      showMessage('✅ Entry updated successfully!');
    } catch {
      showMessage('❌ Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // ── Render a single entry card (reused for both main + reply) ─────────────
  const EntryCard = ({ entry, isReply = false }) => {
    const isEditing = editingId === entry.id;
    return (
      <div style={{
        background: isReply ? '#f8fafc' : 'white',
        border: `1px solid ${isReply ? '#e2e8f0' : '#e0dfdc'}`,
        borderRadius: '0.5rem',
        padding: '1rem',
        position: 'relative',
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {isReply && <Reply size={14} color="#64748b" />}
            {!isEditing ? (
              <span style={{ fontWeight: '700', color: '#1e293b', fontSize: isReply ? '0.9rem' : '1rem' }}>
                {entry.name}
              </span>
            ) : (
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                style={{ padding: '0.3rem 0.6rem', border: '2px solid #2563eb', borderRadius: '0.375rem', fontSize: '0.9rem', fontWeight: '600', minWidth: '160px' }}
              />
            )}
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              #{entry.id} · {formatDate(entry.createdAt)}
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
            {!isEditing ? (
              <>
                <button onClick={() => startEdit(entry)} style={{ ...buttonStyle, background: '#2563eb' }}>
                  <Edit2 size={13} /> Edit
                </button>
                <button onClick={() => handleDelete(entry.id, isReply)} style={{ ...buttonStyle, background: '#ef4444' }}>
                  <Trash2 size={13} /> Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSaveEdit(entry.id)}
                  disabled={saving}
                  style={{ ...buttonStyle, background: saving ? '#94a3b8' : '#10b981', cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  <Save size={13} /> {saving ? 'Saving…' : 'Save'}
                </button>
                <button onClick={cancelEdit} style={{ ...buttonStyle, background: '#64748b' }}>
                  <X size={13} /> Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Message body */}
        {!isEditing ? (
          <p style={{ color: '#334155', lineHeight: '1.7', fontSize: isReply ? '0.875rem' : '1rem', margin: 0 }}>
            {entry.message}
          </p>
        ) : (
          <textarea
            value={editMessage}
            onChange={e => setEditMessage(e.target.value)}
            rows={4}
            style={{
              width: '100%', padding: '0.6rem 0.75rem',
              border: '2px solid #2563eb', borderRadius: '0.375rem',
              fontSize: '0.9rem', lineHeight: '1.7',
              resize: 'vertical', boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
        )}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>

      {/* ── Header card ── */}
      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MessageCircle size={22} color="#1e293b" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
              Guestbook Manager
            </h3>
            <span style={{ padding: '0.2rem 0.6rem', background: '#1e293b', color: 'white', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: '700' }}>
              {entries.length} entries
            </span>
          </div>
          <button
            onClick={fetchEntries}
            style={{ ...buttonStyle, background: '#475569', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {message && (
          <div style={{
            padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem',
            background: message.startsWith('✅') ? '#d1fae5' : message.startsWith('⚠️') ? '#fef9c3' : '#fee2e2',
            color: message.startsWith('✅') ? '#065f46' : message.startsWith('⚠️') ? '#713f12' : '#991b1b',
          }}>
            {message}
          </div>
        )}

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem 0.75rem' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name or message…"
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', width: '100%', color: '#1e293b' }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <X size={15} color="#94a3b8" />
            </button>
          )}
        </div>

        {searchTerm && (
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
            Showing {filtered.length} of {grouped.length} threads
          </p>
        )}
      </div>

      {/* ── Entry list ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', background: 'white', borderRadius: '0.5rem' }}>
          Loading entries…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', background: 'white', borderRadius: '0.5rem', border: '2px dashed #e2e8f0' }}>
          {searchTerm ? 'No entries match your search.' : 'No guestbook entries yet.'}
        </div>
      ) : (
        filtered.map(entry => (
          <div key={entry.id} style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)', padding: '1.5rem' }}>

            {/* Main entry */}
            <EntryCard entry={entry} isReply={false} />

            {/* Replies */}
            {entry.replies && entry.replies.length > 0 && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Reply size={13} /> {entry.replies.length} {entry.replies.length === 1 ? 'Reply' : 'Replies'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1.25rem', borderLeft: '3px solid #e2e8f0' }}>
                  {entry.replies.map(reply => (
                    <EntryCard key={reply.id} entry={reply} isReply={true} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default GuestbookBuilder;
