import React, { useState, useEffect } from 'react';
import { Trash2, Edit, X, Save } from 'lucide-react';
import AuthService from '../services/AuthService';
import ImageUploadWithCrop from './ImageUploadWithCrop';
import Modal from './custom/Modal';

const ManagePhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [caption, setCaption] = useState('');
  const [year, setYear] = useState('');
  const [event, setEvent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = () => {
    fetch(`${API_BASE_URL}/award-photos`)
      .then(res => res.json())
      .then(data => setPhotos(data))
      .catch(err => console.error(err));
  };

  const handleSubmit = () => {
    if (!caption || !year || !imageUrl) {
      setMessage('Please fill in caption, year, and upload an image');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const url = editingId
      ? `${API_BASE_URL}/award-photos/${editingId}`
      : `${API_BASE_URL}/award-photos`;

    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeaders()
      },
      body: JSON.stringify({ caption, year: parseInt(year), event, imageUrl })
    })
      .then(res => res.json())
      .then(() => {
        setMessage(editingId ? 'Photo updated successfully!' : 'Photo added successfully!');
        closeModal();
        fetchPhotos();
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(err => {
        setMessage('Error: ' + err.message);
        setTimeout(() => setMessage(''), 3000);
      });
  };

  const handleEdit = (photo) => {
    setEditingId(photo.id);
    setCaption(photo.caption);
    setYear(photo.year.toString());
    setEvent(photo.event || '');
    setImageUrl(photo.imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (photo) => {
    setEditingId(photo.id);
    setCaption(photo.caption);
    setYear(photo.year.toString());
    setEvent(photo.event || '');
    setImageUrl(photo.imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => resetForm(), 300);
  };

  const resetForm = () => {
    setEditingId(null);
    setCaption('');
    setYear('');
    setEvent('');
    setImageUrl('');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    fetch(`${API_BASE_URL}/award-photos/${id}`, {
      method: 'DELETE',
      headers: AuthService.getAuthHeaders()
    })
      .then(() => {
        setMessage('Photo deleted successfully!');
        fetchPhotos();
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(err => {
        setMessage('Error: ' + err.message);
        setTimeout(() => setMessage(''), 3000);
      });
  };

  const inputStyle = {
    padding: '0.5rem 1rem',
    border: '1px solid #cbd5e1',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    width: '80%'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Form */}
      
      {/* List */}
      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
       
          <button
            onClick={openAddModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            <Save size={18} />
            Add New Photo
          </button>

        </div>

        {message && (
          <div style={{
            background: message.includes('success') ? '#d1fae5' : '#fee2e2',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            color: message.includes('success') ? '#065f46' : '#991b1b'
          }}>
            {message}
          </div>
        )}

       
      
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Existing Photos</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {photos.length === 0 ? (
            <p style={{ color: '#64748b', fontStyle: 'italic' }}>No photos added yet.</p>
          ) : (
            photos.map(photo => (
              <div key={photo.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '1rem',
                background: editingId === photo.id ? '#f0fdf4' : 'transparent',
                padding: '1rem',
                borderRadius: '0.5rem'
              }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                  {photo.imageUrl && (
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '0.5rem',
                        border: '2px solid #e2e8f0'
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: '600', fontSize: '1.125rem', color: '#1e293b' }}>{photo.caption}</h4>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                      {photo.event ? `${photo.event} - ` : ''}{photo.year}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(photo)}
                    style={{
                      padding: '0.5rem',
                      background: editingId === photo.id ? '#10b981' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    style={{
                      padding: '0.5rem',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Photo' : 'Add New Photo'}
        maxWidth="900px"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Caption *</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Photo Caption"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Year *</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Event</label>
            <input
              type="text"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              placeholder="Oil on Canvas, etc."
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Image *</label>
          <ImageUploadWithCrop
            onImageUploaded={(url) => setImageUrl(url)}
            currentImageUrl={imageUrl}
            buttonText={editingId ? "Change Image" : "Upload Photo"}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={closeModal}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#64748b',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: editingId ? '#10b981' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            <Save size={18} />
            {editingId ? 'Update Photo' : 'Add Photo'}
          </button>
        </div>
      </Modal>

    </div>
  );
};
export default ManagePhotos;