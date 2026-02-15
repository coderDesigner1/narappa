import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Save } from 'lucide-react';
import AuthService from '../services/AuthService';
import Modal from './custom/Modal';

const ManageAwards = () => {
  const [awards, setAwards] = useState([]);
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = () => {
    fetch(`${API_BASE_URL}/awards`)
      .then(res => res.json())
      .then(data => setAwards(data))
      .catch(err => console.error(err));
  };

  const handleSubmit = () => {
    if (!title || !organization || !year) {
      setMessage('Please fill in title, organization, and year');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const url = editingId 
      ? `${API_BASE_URL}/awards/${editingId}` 
      : `${API_BASE_URL}/awards`;
    
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeaders()
      },
      body: JSON.stringify({ title, organization, year: parseInt(year), description })
    })
      .then(res => res.json())
      .then(() => {
        setMessage(editingId ? 'Award updated successfully!' : 'Award added successfully!');
        closeModal();
        fetchAwards();
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

  const openEditModal = (award) => {
    setEditingId(award.id);
    setTitle(award.title);
    setOrganization(award.organization);
    setYear(award.year.toString());
    setDescription(award.description || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => resetForm(), 300);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setOrganization('');
    setYear('');
    setDescription('');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this award?')) return;
    
    fetch(`${API_BASE_URL}/awards/${id}`, { 
      method: 'DELETE',
      headers: AuthService.getAuthHeaders()
    })
      .then(() => {
        setMessage('Award deleted successfully!');
        fetchAwards();
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
    width: '100%' 
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header with Add Button */}
      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>Manage Awards</h3>
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
            Add New Award
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
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Existing Awards</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {awards.length === 0 ? (
            <p style={{ color: '#64748b', fontStyle: 'italic' }}>No awards added yet.</p>
          ) : (
            awards.map(award => (
              <div key={award.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                padding: '1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: '600', fontSize: '1.125rem', color: '#1e293b' }}>{award.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                    {award.organization} - {award.year}
                  </p>
                  {award.description && (
                    <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.5rem' }}>
                      {award.description}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  <button
                    onClick={() => openEditModal(award)}
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
                    onClick={() => handleDelete(award.id)}
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
        title={editingId ? 'Edit Award' : 'Add New Award'}
        maxWidth="700px"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Award Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Award title"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Organization *</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Organization name"
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
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            style={{ ...inputStyle }}
            rows="4"
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
            {editingId ? 'Update Award' : 'Add Award'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageAwards;