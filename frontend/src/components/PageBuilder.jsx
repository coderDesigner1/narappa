import React, { useState, useRef, useEffect } from 'react';
import { Plus, Image as ImageIcon, MoveUp, MoveDown, Trash2, Bold, Italic, Underline, Save, Crop, Edit2 } from 'lucide-react';
import  AuthService from '../services/AuthService';

const PageBuilder = () => {
  const [blocks, setBlocks] = useState([]);
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);
  const [currentBlockId, setCurrentBlockId] = useState(null);
  const [cropImage, setCropImage] = useState(null);
  const [cropData, setCropData] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef(null);
  const cropPreviewRef = useRef(null);
  const editorRefs = useRef({});

  const API_BASE_URL = 'http://localhost:8080/api';

  const addTextBlock = () => {
    setBlocks([...blocks, {
      type: 'text',
      html: '',
      id: Date.now()
    }]);
  };

  const addImageBlock = () => {
    setBlocks([...blocks, {
      type: 'image',
      url: '',
      width: 100,
      position: 'center',
      id: Date.now()
    }]);
  };

  const updateBlock = (id, field, value) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, [field]: value } : block
    ));
  };

  // Apply formatting to selected text
  const applyFormatting = (blockId, command, value = null) => {
    const editableDiv = editorRefs.current[blockId];
    if (!editableDiv) return;

    editableDiv.focus();
    document.execCommand(command, false, value);

    // Update the block with new HTML
    setTimeout(() => {
      updateBlock(blockId, 'html', editableDiv.innerHTML);
    }, 0);
  };

  const deleteBlock = (id) => {
    setBlocks(blocks.filter(block => block.id !== id));
    delete editorRefs.current[id];
  };

  const moveBlock = (id, direction) => {
    const index = blocks.findIndex(b => b.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return;
    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const handleImageUpload = (e, blockId) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
        setCropData({
          x: 0,
          y: 0,
          width: img.width,
          height: img.height
        });
        setCropImage({
          blockId,
          src: event.target.result,
          file
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Allow re-cropping existing image
  const handleRecrop = (block) => {
    if (!block.url) return;

    fetch(block.url)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new window.Image();
          img.onload = () => {
            setImageSize({ width: img.width, height: img.height });
            setCropData({
              x: 0,
              y: 0,
              width: img.width,
              height: img.height
            });
            setCropImage({
              blockId: block.id,
              src: event.target.result,
              file: new File([blob], 'image.jpg', { type: blob.type })
            });
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(blob);
      });
  };

  // Draw crop preview
  useEffect(() => {
    if (cropImage && cropPreviewRef.current) {
      const canvas = cropPreviewRef.current;
      const ctx = canvas.getContext('2d');
      const img = new window.Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.clearRect(cropData.x, cropData.y, cropData.width, cropData.height);
        ctx.drawImage(
          img,
          cropData.x, cropData.y, cropData.width, cropData.height,
          cropData.x, cropData.y, cropData.width, cropData.height
        );

        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.strokeRect(cropData.x, cropData.y, cropData.width, cropData.height);
      };

      img.src = cropImage.src;
    }
  }, [cropImage, cropData]);

  const handleCropComplete = async () => {
    if (!cropImage) return;

    const canvas = canvasRef.current;
    const img = new window.Image();

    img.onload = async () => {
      canvas.width = cropData.width;
      canvas.height = cropData.height;

      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        img,
        cropData.x, cropData.y, cropData.width, cropData.height,
        0, 0, cropData.width, cropData.height
      );

      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('file', blob, cropImage.file.name);

        try {
          const response = await fetch(`${API_BASE_URL}/upload/image`, {
            method: 'POST',
            headers: AuthService.getAuthHeaders(),
            body: formData
          });

          const data = await response.json();
          if (response.ok && data.url) {
            updateBlock(cropImage.blockId, 'url', data.url);
            setMessage('Image uploaded successfully!');
            setTimeout(() => setMessage(''), 3000);
            setCropImage(null);
            setCropData({ x: 0, y: 0, width: 100, height: 100 });
          } else {
            setMessage('Upload failed: ' + (data.error || 'Unknown error'));
          }
        } catch (err) {
          setMessage('Upload failed: ' + err.message);
        }
      }, 'image/jpeg', 0.95);
    };

    img.src = cropImage.src;
  };

  const savePage = async () => {
    if (!title.trim()) {
      setMessage('Please enter a title');
      return;
    }

    setSaving(true);
    try {
      const pageData = {
        title,
        content: JSON.stringify(blocks),
        month,
        year,
        published
      };

      const response = await fetch(`${API_BASE_URL}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeaders()
        },
        body: JSON.stringify(pageData)
      });

      if (response.ok) {
        setMessage('Page saved successfully!');
        setTitle('');
        setBlocks([]);
        setPublished(false);
        editorRefs.current = {};
      } else {
        setMessage('Save failed');
      }
    } catch (err) {
      setMessage('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    color: 'white'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Crop Modal */}
      {cropImage && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Crop Image</h3>

            <div style={{
              position: 'relative',
              marginBottom: '1rem',
              maxHeight: '500px',
              overflow: 'auto',
              border: '2px solid #e2e8f0',
              borderRadius: '0.5rem',
              background: '#f8fafc'
            }}>
              <canvas
                ref={cropPreviewRef}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '1rem',
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '0.5rem'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  X Position: {cropData.x}px
                </label>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, imageSize.width - cropData.width)}
                  value={cropData.x}
                  onChange={(e) => setCropData({ ...cropData, x: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Y Position: {cropData.y}px
                </label>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, imageSize.height - cropData.height)}
                  value={cropData.y}
                  onChange={(e) => setCropData({ ...cropData, y: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Width: {cropData.width}px
                </label>
                <input
                  type="range"
                  min="50"
                  max={imageSize.width}
                  value={cropData.width}
                  onChange={(e) => {
                    const newWidth = parseInt(e.target.value);
                    setCropData({
                      ...cropData,
                      width: newWidth,
                      x: Math.min(cropData.x, imageSize.width - newWidth)
                    });
                  }}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Height: {cropData.height}px
                </label>
                <input
                  type="range"
                  min="50"
                  max={imageSize.height}
                  value={cropData.height}
                  onChange={(e) => {
                    const newHeight = parseInt(e.target.value);
                    setCropData({
                      ...cropData,
                      height: newHeight,
                      y: Math.min(cropData.y, imageSize.height - newHeight)
                    });
                  }}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setCropImage(null);
                  setCropData({ x: 0, y: 0, width: 100, height: 100 });
                }}
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
                onClick={handleCropComplete}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Crop size={18} />
                Crop & Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Settings */}
      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Page Settings</h3>

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
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Page Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter page title"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
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
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            id="published"
          />
          <label htmlFor="published" style={{ fontWeight: '500' }}>Publish immediately</label>
        </div>

        <button
          onClick={savePage}
          disabled={saving}
          style={{
            ...buttonStyle,
            background: saving ? '#94a3b8' : '#10b981',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Page'}
        </button>
      </div>

      {/* Page Editor */}
      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Page Editor</h3>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button onClick={addTextBlock} style={{ ...buttonStyle, background: '#2563eb' }}>
            <Plus size={18} />
            Add Text
          </button>
          <button onClick={addImageBlock} style={{ ...buttonStyle, background: '#16a34a' }}>
            <ImageIcon size={18} />
            Add Image
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {blocks.map((block, index) => (
            <div key={block.id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>
                  {block.type === 'text' ? 'Text Block' : 'Image Block'}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => moveBlock(block.id, 'up')} disabled={index === 0} style={{ background: 'none', border: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer' }}>
                    <MoveUp size={18} style={{ color: index === 0 ? '#cbd5e1' : '#475569' }} />
                  </button>
                  <button onClick={() => moveBlock(block.id, 'down')} disabled={index === blocks.length - 1} style={{ background: 'none', border: 'none', cursor: index === blocks.length - 1 ? 'not-allowed' : 'pointer' }}>
                    <MoveDown size={18} style={{ color: index === blocks.length - 1 ? '#cbd5e1' : '#475569' }} />
                  </button>
                  <button onClick={() => deleteBlock(block.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={18} style={{ color: '#dc2626' }} />
                  </button>
                </div>
              </div>

              {block.type === 'text' ? (
                <div>
                  <div style={{
                    display: 'flex',
                    gap: '0.25rem',
                    marginBottom: '0.75rem',
                    flexWrap: 'wrap',
                    padding: '0.75rem',
                    background: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', width: '100%', marginBottom: '0.5rem' }}>
                      💡 Select text first, then click formatting button
                    </div>

                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyFormatting(block.id, 'bold');
                      }}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        background: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Bold"
                    >
                      <Bold size={18} />
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyFormatting(block.id, 'italic');
                      }}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        background: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Italic"
                    >
                      <Italic size={18} />
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyFormatting(block.id, 'underline');
                      }}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        background: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Underline"
                    >
                      <Underline size={18} />
                    </button>

                    <div style={{ width: '1px', background: '#cbd5e1', margin: '0 0.5rem' }} />

                    <input
                      type="color"
                      onChange={(e) => applyFormatting(block.id, 'foreColor', e.target.value)}
                      onMouseDown={(e) => e.preventDefault()}
                      style={{ width: '50px', height: '36px', border: '1px solid #cbd5e1', borderRadius: '0.375rem', cursor: 'pointer' }}
                      title="Text Color"
                    />

                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          applyFormatting(block.id, 'fontSize', e.target.value);
                          e.target.value = '';
                        }
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', cursor: 'pointer' }}
                    >
                      <option value="">Font Size</option>
                      <option value="1">Small</option>
                      <option value="3">Normal</option>
                      <option value="5">Large</option>
                      <option value="7">Extra Large</option>
                    </select>

                    <div style={{ width: '1px', background: '#cbd5e1', margin: '0 0.5rem' }} />

                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyFormatting(block.id, 'justifyLeft');
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                      title="Align Left"
                    >
                      ⬅
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyFormatting(block.id, 'justifyCenter');
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                      title="Align Center"
                    >
                      ↔
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyFormatting(block.id, 'justifyRight');
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                      title="Align Right"
                    >
                      ➡
                    </button>
                  </div>

                  {/* ContentEditable - FIXED to prevent backwards typing */}
                  <div
                    ref={el => editorRefs.current[block.id] = el}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      updateBlock(block.id, 'html', e.target.innerHTML);
                    }}
                    dangerouslySetInnerHTML={{ __html: block.html || '' }}
                    style={{
                      width: '100%',
                      minHeight: '120px',
                      padding: '0.75rem',
                      border: '2px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      lineHeight: '1.75',
                      background: 'white'
                    }}
                    data-placeholder="Type your text here... Select text to format it."
                  />
                  <style>{`
                    [contenteditable][data-placeholder]:empty:before {
                      content: attr(data-placeholder);
                      color: #94a3b8;
                      cursor: text;
                    }
                  `}</style>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleImageUpload(e, block.id)}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setCurrentBlockId(block.id);
                        fileInputRef.current?.click();
                      }}
                      style={{ ...buttonStyle, background: '#8b5cf6', width: 'fit-content' }}
                    >
                      <ImageIcon size={18} />
                      Upload & Crop Image
                    </button>

                    {block.url && (
                      <button
                        onClick={() => handleRecrop(block)}
                        style={{ ...buttonStyle, background: '#f59e0b', width: 'fit-content' }}
                      >
                        <Edit2 size={18} />
                        Re-crop
                      </button>
                    )}
                  </div>

                  {block.url && (
                    <img src={block.url} alt="Preview" style={{ maxWidth: '300px', borderRadius: '0.5rem', border: '2px solid #e2e8f0' }} />
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
                    <span style={{ fontSize: '0.875rem', minWidth: '50px' }}>{block.width}%</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Position:</label>
                    <select
                      value={block.position}
                      onChange={(e) => updateBlock(block.id, 'position', e.target.value)}
                      style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
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

      {/* Preview */}
      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Preview</h3>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.5rem', background: '#f8fafc', minHeight: '24rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e293b' }}>
            {title || 'Untitled Page'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '2rem' }}>
            {months[month - 1]} {year}
          </p>

          {blocks.map(block => (
            <div key={block.id} style={{ marginBottom: '1.5rem' }}>
              {block.type === 'text' ? (
                <div
                  dangerouslySetInnerHTML={{ __html: block.html || '<span style="color: #94a3b8;">Your text will appear here...</span>' }}
                  style={{ lineHeight: '1.75' }}
                />
              ) : (
                <div style={{ display: 'flex', justifyContent: block.position === 'center' ? 'center' : block.position === 'right' ? 'flex-end' : 'flex-start' }}>
                  {block.url ? (
                    <img
                      src={block.url}
                      alt="Content"
                      style={{ width: `${block.width}%`, borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                  ) : (
                    <div
                      style={{ width: `${block.width}%`, background: '#cbd5e1', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '12rem' }}
                    >
                      <span style={{ color: '#94a3b8' }}>Image placeholder</span>
                    </div>
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
export default PageBuilder;
