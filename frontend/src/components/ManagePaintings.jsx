import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Save } from 'lucide-react';
import AuthService from '../services/AuthService';
import ImageUploadWithCrop from './ImageUploadWithCrop';
import Modal from './custom/Modal';

const ManagePaintings = () => {
  const [paintings, setPaintings] = useState([]);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [medium, setMedium] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
  const UPLOADS_BASE = process.env.REACT_APP_UPLOADS_BASE_URL || 'http://localhost:8080';
  const resolveUrl = (url) => url && url.startsWith('/') ? UPLOADS_BASE + url : (url || '');

  useEffect(() => {
    fetchPaintings();
  }, []);

  const fetchPaintings = () => {
    fetch(`${API_BASE_URL}/paintings`)
      .then(res => res.json())
      .then(data => setPaintings(data))
      .catch(err => console.error(err));
  };

  const handleSubmit = () => {
  if (!title || !year || !imageUrl) {
    setMessage('Please fill in title, year, and upload an image');
    setTimeout(() => setMessage(''), 3000);
    return;
  }

  const url = editingId 
    ? `${API_BASE_URL}/paintings/${editingId}` 
    : `${API_BASE_URL}/paintings`;
  
  const method = editingId ? 'PUT' : 'POST';

  fetch(url, {
    method: method,
    credentials: 'include', // Add this
    headers: { 
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeaders()
    },
    body: JSON.stringify({ title, year: parseInt(year), medium, description, imageUrl })
  })
    .then(res => res.json())
    .then(() => {
      setMessage(editingId ? 'Painting updated successfully!' : 'Painting added successfully!');
      closeModal();
      fetchPaintings();
      setTimeout(() => setMessage(''), 3000);
    })
    .catch(err => {
      setMessage('Error: ' + err.message);
      setTimeout(() => setMessage(''), 3000);
    });
};

const handleDelete = (id) => {
  if (!window.confirm('Are you sure you want to delete this painting?')) return;
  
  fetch(`${API_BASE_URL}/paintings/${id}`, { 
    method: 'DELETE',
    credentials: 'include', // Add this
    headers: AuthService.getAuthHeaders()
  })
    .then(() => {
      setMessage('Painting deleted successfully!');
      fetchPaintings();
      setTimeout(() => setMessage(''), 3000);
    })
    .catch(err => {
      setMessage('Error: ' + err.message);
      setTimeout(() => setMessage(''), 3000);
    });
};

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (painting) => {
    setEditingId(painting.id);
    setTitle(painting.title);
    setYear(painting.year.toString());
    setMedium(painting.medium || '');
    setDescription(painting.description || '');
    setImageUrl(painting.imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => resetForm(), 300);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setYear('');
    setMedium('');
    setDescription('');
    setImageUrl('');
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
      {/* Header with Add Button */}
      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>Manage Paintings</h3>
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
            Add New Painting
          </button>
        </div>

        {message && (
          <div style={{
            background: message.includes('success') ? '#d1fae5' : '#fee2e2',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginTop: '1rem',
            color: message.includes('success') ? '#065f46' : '#991b1b'
          }}>
            {message}
          </div>
        )}
      </div>

      {/* List */}
      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Existing Paintings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {paintings.length === 0 ? (
            <p style={{ color: '#64748b', fontStyle: 'italic' }}>No paintings added yet.</p>
          ) : (
            paintings.map(painting => (
              <div key={painting.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                  {painting.imageUrl && (
                    <img 
                      src={resolveUrl(painting.imageUrl)} 
                      alt={painting.title} 
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
                    <h4 style={{ fontWeight: '600', fontSize: '1.125rem', color: '#1e293b' }}>{painting.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                      {painting.year} {painting.medium && `- ${painting.medium}`}
                    </p>
                    {painting.description && (
                      <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.5rem' }}>
                        {painting.description.length > 100 
                          ? painting.description.substring(0, 100) + '...' 
                          : painting.description}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => openEditModal(painting)}
                    style={{ 
                      padding: '0.5rem',
                      background: '#3b82f6',
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
                    onClick={() => handleDelete(painting.id)}
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
        title={editingId ? 'Edit Painting' : 'Add New Painting'}
        maxWidth="900px"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Painting title"
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
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Medium</label>
            <input
              type="text"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              placeholder="Oil on Canvas, etc."
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            style={{ ...inputStyle }}
            rows="3"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Image *</label>
          <ImageUploadWithCrop 
            onImageUploaded={(url) => setImageUrl(url)}
            currentImageUrl={imageUrl}
            buttonText={editingId ? "Change Image" : "Upload Painting Image"}
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
            {editingId ? 'Update Painting' : 'Add Painting'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ManagePaintings;