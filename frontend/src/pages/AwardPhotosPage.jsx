import React, {useState, useEffect} from 'react'
import { X } from 'lucide-react';

const  AwardPhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetch(`${API_BASE_URL}/award-photos`)
      .then(res => res.json())
      .then(data => setPhotos(data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '2rem' }}>Award Ceremony Photos</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {photos.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic', gridColumn: '1 / -1' }}>Loading photos...</p>
        ) : (
          photos.map(photo => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden', cursor: 'pointer', transform: 'scale(1)', transition: 'transform 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ background: '#cbd5e1', height: '16rem' }}>
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  style={{ width: '100%', height: '16rem', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1rem' }}>
                <p style={{ color: '#334155' }}>{photo.caption}</p>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>{photo.year}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '0.5rem', maxWidth: '64rem', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>{selectedPhoto.caption}</h3>
              <button onClick={() => setSelectedPhoto(null)} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.caption}
              style={{ width: '100%' }}
            />
            <div style={{ padding: '1rem' }}>
              <p style={{ color: '#475569' }}><strong>Year:</strong> {selectedPhoto.year}</p>
              {selectedPhoto.event && (
                <p style={{ color: '#475569' }}><strong>Event:</strong> {selectedPhoto.event}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AwardPhotosPage