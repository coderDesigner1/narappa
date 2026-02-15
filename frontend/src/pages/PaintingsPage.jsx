import React, {useState, useEffect} from 'react'
import { X } from 'lucide-react';

const PaintingsPage = () => {
  const [paintings, setPaintings] = useState([]);
  const [selectedPainting, setSelectedPainting] = useState(null);

   const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetch(`${API_BASE_URL}/paintings`)
      .then(res => res.json())
      .then(data => setPaintings(data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '2rem' }}>Gallery of Paintings</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {paintings.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic', gridColumn: '1 / -1' }}>Loading paintings...</p>
        ) : (
          paintings.map(painting => (
            <div
              key={painting.id}
              onClick={() => setSelectedPainting(painting)}
              style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden', cursor: 'pointer', transform: 'scale(1)', transition: 'transform 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ background: '#cbd5e1', height: '16rem' }}>
                <img
                  src={painting.imageUrl}
                  alt={painting.title}
                  style={{ width: '100%', height: '16rem', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{painting.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{painting.year}</p>
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
          onClick={() => setSelectedPainting(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '0.5rem', maxWidth: '64rem', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>{selectedPainting.title}</h3>
              <button onClick={() => setSelectedPainting(null)} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <img
              src={selectedPainting.imageUrl}
              alt={selectedPainting.title}
              style={{ width: '100%' }}
            />
            <div style={{ padding: '1rem' }}>
              <p style={{ color: '#475569' }}><strong>Year:</strong> {selectedPainting.year}</p>
              {selectedPainting.medium && (
                <p style={{ color: '#475569' }}><strong>Medium:</strong> {selectedPainting.medium}</p>
              )}
              {selectedPainting.description && (
                <p style={{ color: '#334155', marginTop: '0.75rem' }}>{selectedPainting.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaintingsPage