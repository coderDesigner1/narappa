import React, {useState, useEffect} from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const AwardPhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetch(`${API_BASE_URL}/award-photos`)
      .then(res => res.json())
      .then(data => setPhotos(data))
      .catch(err => console.error('Error:', err));
  }, []);

  const handlePrevious = () => {
    setSelectedIndex(prevIndex =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex(prevIndex =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

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
        Photo Gallery
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
        gap: '1.5rem',
        width: '100%',
      }}>
        {photos.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic', gridColumn: '1 / -1' }}>Loading photos...</p>
        ) : (
          photos.map((photo, index) => (
            <div
              key={photo.id}
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
                  src={photo.imageUrl}
                  alt={photo.caption}
                  style={{ width: '100%', height: '16rem', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPhoto && (
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
              overflow: 'auto', boxSizing: 'border-box',
            }}
          >
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}></h3>
              <button onClick={() => setSelectedIndex(null)} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <img src={selectedPhoto.imageUrl} alt={selectedPhoto.caption} style={{ width: '100%', display: 'block' }} />
            {selectedPhoto.event && (
              <div style={{ padding: '1rem' }}>
                <p style={{ color: '#475569' }}><strong>Event:</strong> {selectedPhoto.event}</p>
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

export default AwardPhotosPage