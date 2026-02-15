import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Scissors, Save, Move, RotateCw, Loader } from 'lucide-react';

const ImageUploadWithCrop = ({ onImageUploaded, currentImageUrl, buttonText }) => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(currentImageUrl || null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [previewImage, setPreviewImage] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const API_BASE_URL = 'http://localhost:8080/api';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
      return { 'Authorization': `Bearer ${token}` };
    }
    return {};
  };

  useEffect(() => {
    if (currentImageUrl) {
      setCroppedImage(currentImageUrl);
    }
  }, [currentImageUrl]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setShowCropModal(true);
        setCropArea({ x: 0, y: 0, width: 0, height: 0 });
        setPreviewImage(null);
        setRotation(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = () => {
    if (imageRef.current && containerRef.current) {
      const img = imageRef.current;
      const containerWidth = 800;
      const containerHeight = 600;
      
      let width = img.naturalWidth;
      let height = img.naturalHeight;
      
      if (rotation === 90 || rotation === 270) {
        [width, height] = [height, width];
      }
      
      const ratio = Math.min(containerWidth / width, containerHeight / height, 1);
      
      width = width * ratio;
      height = height * ratio;
      
      setImageSize({ width, height });
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
    setCropArea({ x: 0, y: 0, width: 0, height: 0 });
    setPreviewImage(null);
    setTimeout(() => handleImageLoad(), 0);
  };

  const getMousePosition = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, imageSize.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, imageSize.height));
    return { x, y };
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const pos = getMousePosition(e);
    
    if (cropArea.width > 0 && cropArea.height > 0 &&
        pos.x >= cropArea.x && pos.x <= cropArea.x + cropArea.width &&
        pos.y >= cropArea.y && pos.y <= cropArea.y + cropArea.height) {
      setIsMoving(true);
      setMoveOffset({
        x: pos.x - cropArea.x,
        y: pos.y - cropArea.y
      });
    } else {
      setIsDragging(true);
      setStartPoint(pos);
      setCropArea({ x: pos.x, y: pos.y, width: 0, height: 0 });
      setPreviewImage(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isMoving) return;
    e.preventDefault();
    
    const pos = getMousePosition(e);
    
    if (isMoving) {
      const newX = Math.max(0, Math.min(pos.x - moveOffset.x, imageSize.width - cropArea.width));
      const newY = Math.max(0, Math.min(pos.y - moveOffset.y, imageSize.height - cropArea.height));
      setCropArea({
        ...cropArea,
        x: newX,
        y: newY
      });
    } else if (isDragging) {
      const width = pos.x - startPoint.x;
      const height = pos.y - startPoint.y;
      
      const x = width < 0 ? pos.x : startPoint.x;
      const y = height < 0 ? pos.y : startPoint.y;
      
      setCropArea({
        x,
        y,
        width: Math.abs(width),
        height: Math.abs(height)
      });
    }
  };

  const handleMouseUp = (e) => {
    if (isDragging || isMoving) {
      e.preventDefault();
      setIsDragging(false);
      setIsMoving(false);
    }
  };

  const handleCrop = () => {
    if (!imageRef.current || cropArea.width === 0 || cropArea.height === 0) {
      alert('Please drag to select an area to crop');
      return;
    }

    const canvas = previewCanvasRef.current;
    const img = imageRef.current;
    const ctx = canvas.getContext('2d');

    const scaleX = img.naturalWidth / imageSize.width;
    const scaleY = img.naturalHeight / imageSize.height;

    let actualScaleX = scaleX;
    let actualScaleY = scaleY;
    
    if (rotation === 90 || rotation === 270) {
      actualScaleX = img.naturalHeight / imageSize.width;
      actualScaleY = img.naturalWidth / imageSize.height;
    }

    const cropWidth = cropArea.width * actualScaleX;
    const cropHeight = cropArea.height * actualScaleY;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.save();

    if (rotation !== 0) {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      if (rotation === 90 || rotation === 270) {
        tempCanvas.width = img.naturalHeight;
        tempCanvas.height = img.naturalWidth;
      } else {
        tempCanvas.width = img.naturalWidth;
        tempCanvas.height = img.naturalHeight;
      }
      
      tempCtx.save();
      tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
      tempCtx.rotate((rotation * Math.PI) / 180);
      tempCtx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      tempCtx.restore();
      
      ctx.drawImage(
        tempCanvas,
        cropArea.x * actualScaleX,
        cropArea.y * actualScaleY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
    } else {
      ctx.drawImage(
        img,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
    }

    ctx.restore();

    const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPreviewImage(croppedImageUrl);
  };

  const base64ToBlob = (base64) => {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  };

  const handleSave = async () => {
    setIsUploading(true);

    try {
      console.log('Starting upload...');
      
      // Use cropped image if available, otherwise use original with rotation applied
      let imageToUpload;
      
      if (previewImage) {
        // User cropped the image
        imageToUpload = previewImage;
      } else if (rotation !== 0) {
        // User rotated but didn't crop - apply rotation to full image
        const canvas = previewCanvasRef.current;
        const img = imageRef.current;
        const ctx = canvas.getContext('2d');
        
        if (rotation === 90 || rotation === 270) {
          canvas.width = img.naturalHeight;
          canvas.height = img.naturalWidth;
        } else {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        ctx.restore();
        
        imageToUpload = canvas.toDataURL('image/jpeg', 0.9);
      } else {
        // No crop or rotation - use original
        imageToUpload = image;
      }
      
      const blob = base64ToBlob(imageToUpload);
      console.log('Blob created:', blob.size, 'bytes');
      
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');

      console.log('Uploading to:', `${API_BASE_URL}/upload/image`);
      
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload failed:', errorData);
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('Server response:', data);
      
      const uploadedUrl = data.url || data.imageUrl || data.path;

      if (!uploadedUrl) {
        throw new Error('No URL returned from server');
      }

      console.log('Upload successful! URL:', uploadedUrl);

      setCroppedImage(uploadedUrl);
      onImageUploaded(uploadedUrl);
      
      setShowCropModal(false);
      setImage(null);
      setPreviewImage(null);
      setCropArea({ x: 0, y: 0, width: 0, height: 0 });
      setRotation(0);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image: ' + error.message + '\nCheck console for details.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setShowCropModal(false);
    setImage(null);
    setPreviewImage(null);
    setCropArea({ x: 0, y: 0, width: 0, height: 0 });
    setRotation(0);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: '#3b82f6',
          color: 'white',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}>
          <Upload size={16} />
          {buttonText || 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </label>
        
        {croppedImage && (
          <img
            src={croppedImage}
            alt="Preview"
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              borderRadius: '0.375rem',
              border: '2px solid #e2e8f0'
            }}
          />
        )}
      </div>

      {showCropModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                Crop Image (Optional)
              </h3>
              <button
                onClick={handleCancel}
                disabled={isUploading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  padding: '0.25rem',
                  color: '#64748b'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ 
              background: '#f1f5f9', 
              padding: '0.75rem', 
              borderRadius: '0.375rem',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>
                <strong>Optional:</strong> Drag to select area to crop • Click inside to move • Rotate to change orientation • Or save directly without cropping
              </p>
            </div>

            <div>
              <button
                onClick={handleRotate}
                disabled={isUploading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: isUploading ? '#cbd5e1' : '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <RotateCw size={16} />
                Rotate 90° (Current: {rotation}°)
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem',
                  color: '#475569'
                }}>
                  Original Image
                </div>
                <div
                  ref={containerRef}
                  style={{
                    position: 'relative',
                    width: `${imageSize.width}px`,
                    height: `${imageSize.height}px`,
                    cursor: isUploading ? 'not-allowed' : (isMoving ? 'move' : (cropArea.width > 0 && cropArea.height > 0 ? 'move' : 'crosshair')),
                    userSelect: 'none',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.25rem',
                    background: '#f8fafc',
                    overflow: 'hidden',
                    opacity: isUploading ? 0.5 : 1
                  }}
                  onMouseDown={!isUploading ? handleMouseDown : undefined}
                  onMouseMove={!isUploading ? handleMouseMove : undefined}
                  onMouseUp={!isUploading ? handleMouseUp : undefined}
                  onMouseLeave={!isUploading ? handleMouseUp : undefined}
                >
                  <img
                    ref={imageRef}
                    src={image}
                    alt="To crop"
                    onLoad={handleImageLoad}
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'block',
                      pointerEvents: 'none',
                      transform: `rotate(${rotation}deg)`,
                      transformOrigin: 'center center'
                    }}
                    draggable={false}
                  />
                  
                  {cropArea.width > 5 && cropArea.height > 5 && (
                    <>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        pointerEvents: 'none'
                      }} />
                      
                      <div style={{
                        position: 'absolute',
                        left: `${cropArea.x}px`,
                        top: `${cropArea.y}px`,
                        width: `${cropArea.width}px`,
                        height: `${cropArea.height}px`,
                        border: '3px solid #3b82f6',
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                        pointerEvents: 'none',
                        background: 'transparent'
                      }} />
                      
                      <div style={{
                        position: 'absolute',
                        left: `${cropArea.x}px`,
                        top: `${Math.max(0, cropArea.y - 30)}px`,
                        background: '#3b82f6',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        pointerEvents: 'none',
                        fontWeight: 'bold'
                      }}>
                        {Math.round(cropArea.width)} × {Math.round(cropArea.height)} px
                      </div>

                      <div style={{
                        position: 'absolute',
                        left: `${cropArea.x + cropArea.width / 2 - 15}px`,
                        top: `${cropArea.y + cropArea.height / 2 - 15}px`,
                        width: '30px',
                        height: '30px',
                        background: 'rgba(59, 130, 246, 0.8)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        color: 'white'
                      }}>
                        <Move size={18} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {previewImage && (
                <div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 'bold', 
                    marginBottom: '0.5rem',
                    color: '#10b981'
                  }}>
                    Cropped Preview
                  </div>
                  <div style={{
                    border: '3px solid #10b981',
                    borderRadius: '0.375rem',
                    padding: '0.75rem',
                    background: 'white',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}>
                    <img
                      src={previewImage}
                      alt="Cropped preview"
                      style={{
                        maxWidth: '300px',
                        maxHeight: '400px',
                        display: 'block',
                        borderRadius: '0.25rem'
                      }}
                    />
                    <div style={{
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                      color: '#10b981',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}>
                      ✓ Ready to save
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
                disabled={isUploading}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#64748b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCrop}
                disabled={cropArea.width === 0 || cropArea.height === 0 || isUploading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: (cropArea.width === 0 || cropArea.height === 0 || isUploading) ? '#cbd5e1' : '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: (cropArea.width === 0 || cropArea.height === 0 || isUploading) ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <Scissors size={16} />
                Crop
              </button>
              <button
                onClick={handleSave}
                disabled={isUploading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1.5rem',
                  background: isUploading ? '#cbd5e1' : (previewImage ? '#10b981' : '#3b82f6'),
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}
              >
                {isUploading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {previewImage ? 'Save Cropped Image' : 'Save Original Image'}
                  </>
                )}
              </button>
            </div>
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
        </div>
      )}
    </div>
  );
};

export default ImageUploadWithCrop;