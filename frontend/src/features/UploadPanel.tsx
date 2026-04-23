import { useState, useRef } from 'react';
import { UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';
import { ref, uploadBytes } from 'firebase/storage';
import { storage, auth } from '../config/firebase';

export const UploadPanel = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        alert('You must be logged in to upload files.');
        setIsUploading(false);
        return;
      }
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `uploads/${userId}/${fileName}`);
      await uploadBytes(storageRef, file);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please check your connection and Firebase configuration.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="glass-panel upload-panel">
      <h2 className="panel-title">Upload Image</h2>
      <p className="panel-desc">Drag and drop any document or image for AI analysis.</p>

      <div
        className={`drop-zone ${isDragging ? 'drag-active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          hidden 
          ref={fileInputRef} 
          accept="image/*"
          onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
        />
        
        {isUploading ? (
          <div className="upload-state">
            <Loader2 className="spinner" size={48} color="var(--primary-color)" />
            <p>Uploading...</p>
          </div>
        ) : uploadSuccess ? (
          <div className="upload-state">
            <CheckCircle2 size={48} color="var(--accent-color)" />
            <p>Uploaded! AI analysis in progress...</p>
          </div>
        ) : (
          <div className="upload-state">
            <UploadCloud size={48} color={isDragging ? 'var(--primary-color)' : 'var(--text-muted)'} />
            <p><strong>Click to browse</strong> or drag file here</p>
            <span className="file-hint">Supports PNG, JPG, JPEG</span>
          </div>
        )}
      </div>

      <style>{`
        .upload-panel {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .panel-title {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .panel-desc {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .drop-zone {
          border: 2px dashed var(--surface-border);
          border-radius: 12px;
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(15, 23, 42, 0.4);
        }

        .drop-zone:hover, .drag-active {
          border-color: var(--primary-color);
          background: rgba(99, 102, 241, 0.05);
        }

        .upload-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .upload-state p {
          color: var(--text-main);
          font-size: 1rem;
        }

        .file-hint {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
