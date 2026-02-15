import React from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';

const PageViewer = ({ page, onBack }) => {
  if (!page) return null;

  const blocks = JSON.parse(page.content);
  console.log("blocks:", blocks);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: '#64748b',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          fontSize: '0.875rem'
        }}
      >
        <ArrowLeft size={16} />
        Back to Archives
      </button>

      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
          {page.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #e2e8f0' }}>
          <Calendar size={16} />
          <span style={{ fontSize: '0.875rem' }}>
            {months[page.month - 1]} {page.year}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {blocks.map(block => (
            <div key={block.id}>
              {block.type === 'text' ? (
                // Render HTML content directly
                <div 
                  dangerouslySetInnerHTML={{ __html: block.html || block.content || '' }}
                  style={{ lineHeight: '1.75', color: '#334155' }}
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
  );
};

export default PageViewer;