import React from 'react';
import { Calendar, X } from 'lucide-react';

const PageViewer = ({ page, onClose }) => {
  if (!page) return null;

  const blocks = JSON.parse(page.content);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        zIndex: 1000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          maxWidth: '56rem',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        {/* Header with close button */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 10
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              {page.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
              <Calendar size={16} />
              <span style={{ fontSize: '0.875rem' }}>
                {months[page.month - 1]} {page.year}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.25rem',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {blocks.map(block => (
              <div key={block.id}>
                {block.type === 'text' ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: block.html || block.content || '' }}
                    style={{ lineHeight: '1.75', color: '#4b5563' }}
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    justifyContent: block.position === 'center' ? 'center' : block.position === 'right' ? 'flex-end' : 'flex-start'
                  }}>
                    {block.url && (
                      <img
                        src={block.url}
                        alt="Content"
                        style={{
                          width: `${block.width}%`,
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageViewer;