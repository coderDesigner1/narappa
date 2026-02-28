import React, {useState, useEffect} from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const PaintingsPage = () => {
  const [paintings, setPaintings] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetch(`${API_BASE_URL}/paintings`)
      .then(res => res.json())
      .then(data => setPaintings(data))
      .catch(err => console.error('Error:', err));
  }, []);

  const handlePrevious = () => {
    setSelectedIndex(prevIndex =>
      prevIndex === 0 ? paintings.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex(prevIndex =>
      prevIndex === paintings.length - 1 ? 0 : prevIndex + 1
    );
  };

  const selectedPainting = selectedIndex !== null ? paintings[selectedIndex] : null;

  const navBtnStyle = {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.95)',
    border: 'none',
    borderRadius: '50%',
    width: '2.5rem',
    height: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    zIndex: 60,
  };

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <h2 style={{ fontSize: 'clamp(1.25rem, 5vw, 2.25rem)', fontWeight: 'bold', color: '#1e293b', marginBottom: '2rem' }}>
        Gallery of Paintings
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
        gap: '1.5rem',
        width: '100%',
      }}>
        {paintings.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic', gridColumn: '1 / -1' }}>Loading paintings...</p>
        ) : (
          paintings.map((painting, index) => (
            <div
              key={painting.id}
              onClick={() => setSelectedIndex(index)}
              style={{
                background: 'white', border: '1px solid #e0dfdc', borderRadius: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.4)',
                overflow: 'hidden', cursor: 'pointer',
                transform: 'scale(1)', transition: 'transform 0.3s',
                width: '100%', boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ background: '#cbd5e1', height: '16rem', overflow: 'hidden' }}>
                <img
                  src={painting.imageUrl}
                  alt={painting.title}
                  style={{ width: '100%', height: '16rem', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ padding: '1rem' }}>
                {painting.medium && (
                  <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.25rem' }}>{painting.medium}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPainting && (
        <div
          onClick={() => setSelectedIndex(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem 3.5rem',
            zIndex: 50, boxSizing: 'border-box',
          }}
        >
          <button onClick={(e) => { e.stopPropagation(); handlePrevious(); }} style={{ ...navBtnStyle, left: '0.5rem' }}>
            <ChevronLeft size={20} color="#1e293b" />
          </button>

          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: '0.5rem',
              width: '100%', maxWidth: '56rem', maxHeight: '90vh',
              overflow: 'auto', position: 'relative', boxSizing: 'border-box',
            }}
          >
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                {selectedPainting.medium}
              </h3>
              <button onClick={() => setSelectedIndex(null)} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                <X size={24} />
              </button>
            </div>
            <img src={selectedPainting.imageUrl} alt={selectedPainting.title} style={{ width: '100%', display: 'block' }} />
            {selectedPainting.description && (
              <div style={{ padding: '1rem' }}>
                <p style={{ color: '#334155' }}>{selectedPainting.description}</p>
              </div>
            )}
          </div>

          <button onClick={(e) => { e.stopPropagation(); handleNext(); }} style={{ ...navBtnStyle, right: '0.5rem' }}>
            <ChevronRight size={20} color="#1e293b" />
          </button>
        </div>
      )}
    </div>
  );
}

export default PaintingsPage