import React, {useState, useEffect} from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const  AwardPhotosPage = () => {
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

  return (
    <div>
      <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '2rem' }}>Photo Gallery</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {photos.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic', gridColumn: '1 / -1' }}>Loading photos...</p>
        ) : (
          photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setSelectedIndex(index)}
              style={{ background: 'white',  border: '1px solid #e0dfdc', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.4)', overflow: 'hidden', cursor: 'pointer', transform: 'scale(1)', transition: 'transform 0.3s' }}
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
              {/* <div style={{ padding: '1rem' }}>
                <p style={{ color: '#334155' }}>{photo.caption}</p>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>{photo.year}</p>
              </div> */}
            </div>
          ))
        )}
      </div>

      {selectedPhoto && (
        <div
          onClick={() => setSelectedIndex(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}
        >
          {/* Previous button - outside modal */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            style={{
              position: 'absolute',
              left: '15rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
              zIndex: 60
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronLeft size={24} color="#1e293b" />
          </button>

          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '0.5rem', maxWidth: '64rem', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}></h3>
              <button onClick={() => setSelectedIndex(null)} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.caption}
              style={{ width: '100%' }}
            />
            <div style={{ padding: '1rem' }}>
              {/* <p style={{ color: '#475569' }}><strong>Year:</strong> {selectedPhoto.year}</p> */}
              {selectedPhoto.event && (
                <p style={{ color: '#475569' }}><strong>Event:</strong> {selectedPhoto.event}</p>
              )}
            </div>
          </div>

          {/* Next button - outside modal */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            style={{
              position: 'absolute',
              right: '15rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
              zIndex: 60
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronRight size={24} color="#1e293b" />
          </button>
        </div>
      )}
    </div>
  );
}

export default AwardPhotosPage