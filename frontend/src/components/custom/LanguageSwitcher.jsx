import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGUAGES.find(l => l.flag === language);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        title="Change Language"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.4rem 0.75rem',
          background: open ? '#f3f4f6' : 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.4rem',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: '600',
          color: '#374151',
          transition: 'all 0.15s',
          letterSpacing: '0.03em'
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'white'; }}
      >
        {/* Flag badge */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '22px',
          height: '22px',
          background: '#1f2937',
          color: 'white',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: '700',
          letterSpacing: '0'
        }}>
          {current.flag}
        </span>
        <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>{current.nativeLabel}</span>
        <span style={{
          fontSize: '0.6rem',
          color: '#9ca3af',
          transform: open ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s',
          display: 'inline-block'
        }}>▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: '150px',
          zIndex: 2000,
          overflow: 'hidden'
        }}>
          {LANGUAGES.map((lang, i) => {
            const isActive = lang.flag === language;
            return (
              <button
                key={lang.flag}
                onClick={() => { setLanguage(lang.flag); setOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.9rem',
                  background: isActive ? '#f0fdf4' : 'white',
                  border: 'none',
                  borderBottom: i < LANGUAGES.length - 1 ? '1px solid #f3f4f6' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                  color: isActive ? '#059669' : '#374151',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f9fafb'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'white'; }}
              >
                {/* Flag badge */}
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  background: isActive ? '#059669' : '#1f2937',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  flexShrink: 0
                }}>
                  {lang.flag}
                </span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{lang.nativeLabel}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{lang.label}</div>
                </div>
                {isActive && (
                  <span style={{ marginLeft: 'auto', color: '#059669', fontSize: '0.9rem' }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;