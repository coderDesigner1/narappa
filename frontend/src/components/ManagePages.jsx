import React, { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Eye, EyeOff, Calendar, Plus, Image as ImageIcon, Save, X, MoveUp, MoveDown } from 'lucide-react';
import AuthService from '../services/AuthService';
import ImageUploadWithCrop from './ImageUploadWithCrop';
import RichTextEditor from './custom/RichTextEditor'

const ManagePages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [message, setMessage] = useState('');

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/admin/all`, {
        headers: AuthService.getAuthHeaders()
      });
      const data = await response.json();
      setPages(data);
    } catch (err) {
      console.error('Error fetching pages:', err);
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/pages/${id}`, {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders()
      });

      if (response.ok) {
        setMessage('Page deleted successfully');
        fetchPages();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Delete failed: ' + err.message);
    }
  };

  const togglePublish = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${id}/publish`, {
        method: 'PATCH',
        headers: AuthService.getAuthHeaders()
      });

      if (response.ok) {
        setMessage('Publication status updated');
        fetchPages();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Update failed: ' + err.message);
    }
  };

  const startEdit = (page) => {
    setEditingPage({
      ...page,
      blocks: JSON.parse(page.content)
    });
  };

  const cancelEdit = () => {
    setEditingPage(null);
  };

  const updateBlock = (id, field, value) => {
    setEditingPage({
      ...editingPage,
      blocks: editingPage.blocks.map(block =>
        block.id === id ? { ...block, [field]: value } : block
      )
    });
  };

  const addTextBlock = () => {
    setEditingPage({
      ...editingPage,
      blocks: [...editingPage.blocks, {
        type: 'text',
        content: '',
        html: '',
        id: Date.now()
      }]
    });
  };

  const addImageBlock = () => {
    setEditingPage({
      ...editingPage,
      blocks: [...editingPage.blocks, {
        type: 'image',
        url: '',
        width: 80,
        position: 'center',
        id: Date.now()
      }]
    });
  };

  const deleteBlock = (id) => {
    setEditingPage({
      ...editingPage,
      blocks: editingPage.blocks.filter(block => block.id !== id)
    });
  };

  const moveBlock = (id, direction) => {
    const blocks = [...editingPage.blocks];
    const index = blocks.findIndex(b => b.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];

    setEditingPage({
      ...editingPage,
      blocks
    });
  };

  const savePage = async () => {
    try {
      const pageData = {
        ...editingPage,
        content: JSON.stringify(editingPage.blocks)
      };
      delete pageData.blocks;

      const response = await fetch(`${API_BASE_URL}/pages/${editingPage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeaders()
        },
        body: JSON.stringify(pageData)
      });

      if (response.ok) {
        setMessage('Page updated successfully');
        setEditingPage(null);
        fetchPages();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Save failed: ' + err.message);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (editingPage) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>Edit Page</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={savePage}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
              >
                <Save size={18} />
                Save
              </button>
              <button
                onClick={cancelEdit}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#64748b', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
              >
                <X size={18} />
                Cancel
              </button>
            </div>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Title</label>
              <input
                type="text"
                value={editingPage.title}
                onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                style={{ width: '80%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Month</label>
              <select
                value={editingPage.month}
                onChange={(e) => setEditingPage({ ...editingPage, month: parseInt(e.target.value) })}
                style={{ width: '80%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
              >
                {months.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Year</label>
              <input
                type="number"
                value={editingPage.year}
                onChange={(e) => setEditingPage({ ...editingPage, year: parseInt(e.target.value) })}
                style={{ width: '80%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              checked={editingPage.published}
              onChange={(e) => setEditingPage({ ...editingPage, published: e.target.checked })}
              id="edit-published"
            />
            <label htmlFor="edit-published" style={{ fontWeight: '500' }}>Published</label>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              onClick={addTextBlock}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
            >
              <Plus size={18} />
              Add Text
            </button>
            <button
              onClick={addImageBlock}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
            >
              <ImageIcon size={18} />
              Add Image
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {editingPage.blocks.map((block, index) => (
              <div key={block.id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: '600', color: '#334155' }}>
                    {block.type === 'text' ? 'Text Block' : 'Image Block'}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => moveBlock(block.id, 'up')} disabled={index === 0} style={{ background: 'none', border: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer' }}>
                      <MoveUp size={18} style={{ color: index === 0 ? '#cbd5e1' : '#475569' }} />
                    </button>
                    <button onClick={() => moveBlock(block.id, 'down')} disabled={index === editingPage.blocks.length - 1} style={{ background: 'none', border: 'none', cursor: index === editingPage.blocks.length - 1 ? 'not-allowed' : 'pointer' }}>
                      <MoveDown size={18} style={{ color: index === editingPage.blocks.length - 1 ? '#cbd5e1' : '#475569' }} />
                    </button>
                    <button onClick={() => deleteBlock(block.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={18} style={{ color: '#dc2626' }} />
                    </button>
                  </div>
                </div>

                {block.type === 'text' ? (
                  <div style={{ background: 'white', borderRadius: '0.375rem', padding: '0.5rem' }}>
                    <RichTextEditor
                      initialContent={block.html || block.content || ''}
                      onChange={(html) => updateBlock(block.id, 'html', html)}
                    />
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <ImageUploadWithCrop
                      onImageUploaded={(url) => updateBlock(block.id, 'url', url)}
                      currentImageUrl={block.url}
                      buttonText="Upload Image"
                    />

                    {block.url && (
                      <img src={block.url} alt="Preview" style={{ maxWidth: '200px', borderRadius: '0.5rem', border: '2px solid #e2e8f0' }} />
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Width:</label>
                      <input
                        type="range"
                        min="25"
                        max="100"
                        value={block.width}
                        onChange={(e) => updateBlock(block.id, 'width', e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <span style={{ fontSize: '0.875rem' }}>{block.width}%</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Position:</label>
                      <select
                        value={block.position}
                        onChange={(e) => updateBlock(block.id, 'position', e.target.value)}
                        style={{ padding: '0.25rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Manage Pages</h3>

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

        {loading ? (
          <p>Loading pages...</p>
        ) : pages.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>No pages created yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pages.map(page => (
              <div key={page.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>{page.title}</h4>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} />
                      {months[page.month - 1]} {page.year}
                    </span>
                    <span style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: page.published ? '#10b981' : '#ef4444' }}>
                      {page.published ? <Eye size={14} /> : <EyeOff size={14} />}
                      {page.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => startEdit(page)}
                    style={{ padding: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => togglePublish(page.id)}
                    style={{ padding: '0.5rem', background: page.published ? '#f59e0b' : '#10b981', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                    title={page.published ? 'Unpublish' : 'Publish'}
                  >
                    {page.published ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    onClick={() => deletePage(page.id)}
                    style={{ padding: '0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePages;