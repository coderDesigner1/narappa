import React, { useState, useEffect } from 'react';
import { MessageCircle, Reply, X } from 'lucide-react';

const GuestbookPage = () => {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyName, setReplyName] = useState('');
  const [replyMessage, setReplyMessage] = useState('');

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = () => {
    fetch(`${API_BASE_URL}/guestbook`)
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(err => console.error('Error:', err));
  };

  const handleSubmit = () => {
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    fetch(`${API_BASE_URL}/guestbook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message })
    })
      .then(res => res.json())
      .then(() => {
        setName('');
        setMessage('');
        fetchEntries();
      })
      .catch(err => console.error('Error:', err))
      .finally(() => setSubmitting(false));
  };

  const handleReplySubmit = (parentId) => {
    if (!replyName.trim() || !replyMessage.trim()) return;

    setSubmitting(true);
    fetch(`${API_BASE_URL}/guestbook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: replyName, 
        message: replyMessage, 
        parentId: parentId 
      })
    })
      .then(res => res.json())
      .then(() => {
        setReplyName('');
        setReplyMessage('');
        setReplyingTo(null);
        fetchEntries();
      })
      .catch(err => console.error('Error:', err))
      .finally(() => setSubmitting(false));
  };

  // Group entries by parent (main entries and their replies)
  const groupedEntries = entries.reduce((acc, entry) => {
    if (!entry.parentId) {
      // Main entry
      acc.push({
        ...entry,
        replies: entries.filter(e => e.parentId === entry.id)
      });
    }
    return acc;
  }, []);

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '2rem' }}>Guestbook</h2>
      
      {/* Main Message Form */}
      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Leave a Message</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', color: '#334155', fontWeight: '500', marginBottom: '0.5rem' }}>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '80%', padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem' }}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#334155', fontWeight: '500', marginBottom: '0.5rem' }}>Your Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: '80%', padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem' }}
              rows="4"
              placeholder="Share your thoughts and memories..."
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ 
              background: submitting ? '#94a3b8' : '#1e293b', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem', 
              border: 'none', 
              cursor: submitting ? 'not-allowed' : 'pointer', 
              fontSize: '1rem', 
              transition: 'background 0.3s',
              width: 'fit-content'
            }}
            onMouseEnter={(e) => !submitting && (e.target.style.background = '#334155')}
            onMouseLeave={(e) => !submitting && (e.target.style.background = '#1e293b')}
          >
            {submitting ? 'Submitting...' : 'Submit Message'}
          </button>
        </div>
      </div>

      {/* Entries with Replies */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {groupedEntries.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>No entries yet. Be the first to leave a message!</p>
        ) : (
          groupedEntries.map(entry => (
            <div key={entry.id} style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              {/* Main Entry */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>{entry.name}</h4>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: '#334155', lineHeight: '1.75', marginBottom: '1rem' }}>{entry.message}</p>
                
                {/* Reply Button */}
                <button
                  onClick={() => setReplyingTo(replyingTo === entry.id ? null : entry.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: replyingTo === entry.id ? '#dbeafe' : '#f1f5f9',
                    color: replyingTo === entry.id ? '#1e40af' : '#475569',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (replyingTo !== entry.id) {
                      e.target.style.background = '#e2e8f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (replyingTo !== entry.id) {
                      e.target.style.background = '#f1f5f9';
                    }
                  }}
                >
                  {replyingTo === entry.id ? <X size={16} /> : <Reply size={16} />}
                  {replyingTo === entry.id ? 'Cancel' : 'Reply'}
                </button>

                {/* Reply Form */}
                {replyingTo === entry.id && (
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    background: '#f8fafc', 
                    borderRadius: '0.5rem',
                    border: '2px solid #dbeafe'
                  }}>
                    <h5 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MessageCircle size={18} />
                      Reply to {entry.name}
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <input
                        type="text"
                        value={replyName}
                        onChange={(e) => setReplyName(e.target.value)}
                        placeholder="Your name"
                        style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                      />
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Your reply..."
                        rows="3"
                        style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                      />
                      <button
                        onClick={() => handleReplySubmit(entry.id)}
                        disabled={submitting || !replyName.trim() || !replyMessage.trim()}
                        style={{
                          padding: '0.5rem 1rem',
                          background: (submitting || !replyName.trim() || !replyMessage.trim()) ? '#94a3b8' : '#2563eb',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: (submitting || !replyName.trim() || !replyMessage.trim()) ? 'not-allowed' : 'pointer',
                          fontSize: '0.875rem',
                          width: 'fit-content'
                        }}
                      >
                        {submitting ? 'Posting...' : 'Post Reply'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Replies */}
              {entry.replies && entry.replies.length > 0 && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageCircle size={16} />
                    {entry.replies.length} {entry.replies.length === 1 ? 'Reply' : 'Replies'}
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.5rem', borderLeft: '3px solid #e2e8f0' }}>
                    {entry.replies.map(reply => (
                      <div key={reply.id} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h6 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{reply.name}</h6>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '0.875rem' }}>{reply.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GuestbookPage;