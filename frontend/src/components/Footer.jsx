import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080/api';

const Footer = ({ onPrivacyClick }) => {
  const [visitors, setVisitors] = useState({ total: null, today: null });

  useEffect(() => {
    fetch(`${API_BASE_URL}/visitors/track`, { method: 'POST' })
      .then(r => r.json())
      .then(data => setVisitors({
        total: data.total ?? data.totalVisitors ?? data.count ?? null,
        today: data.today ?? data.todayVisitors ?? data.todayCount ?? null,
      }))
      .catch(() => {
        fetch(`${API_BASE_URL}/visitors/count`)
          .then(r => r.json())
          .then(data => setVisitors({
            total: data.total ?? data.totalVisitors ?? data.count ?? null,
            today: data.today ?? data.todayVisitors ?? data.todayCount ?? null,
          }))
          .catch(() => {});
      });
  }, []);

  return (
    <footer style={{
      background: '#1e293b',
      color: '#94a3b8',
      padding: '2rem',
      
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}>

        {/* Visitor counter */}
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: '#64748b' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1rem' }}>👁</span>
            <span>
              {visitors.total !== null && visitors.total !== undefined
                ? <><strong style={{ color: '#94a3b8' }}>{Number(visitors.total).toLocaleString()}</strong> unique visitors</>
                : 'Loading…'}
            </span>
          </span>
          {visitors.today !== null && visitors.today !== undefined && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1rem' }}>📅</span>
              <span>
                <strong style={{ color: '#94a3b8' }}>{Number(visitors.today).toLocaleString()}</strong> today
              </span>
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: '#334155' }} />

        {/* Bottom row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.8rem',
        }}>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
          A loving tribute from family  
          <button
            onClick={onPrivacyClick}
            style={{
              background: 'none', border: 'none', color: '#64748b',
              cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline', padding: 0,
            }}
            onMouseEnter={e => e.target.style.color = '#94a3b8'}
            onMouseLeave={e => e.target.style.color = '#64748b'}
          >
            Privacy Policy
          </button>
        </div>

      </div>
    </footer>
  );
};
    
export default Footer;