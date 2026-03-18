'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export default function ImageUpload({ label, value, onChange, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        onChange(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {value ? (
        <div style={{ position: 'relative', display: 'inline-block', width: 'fit-content' }}>
          <img
            src={value}
            alt="Preview"
            style={{
              width: 120,
              height: 120,
              objectFit: 'cover',
              borderRadius: 8,
              border: '1px solid #ddd',
            }}
          />
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{
                padding: '4px 10px',
                background: '#e8f4fd',
                color: '#1a8fd8',
                border: 'none',
                borderRadius: 4,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              style={{
                padding: '4px 10px',
                background: '#fde8e8',
                color: '#e53e3e',
                border: 'none',
                borderRadius: 4,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragOver ? '#ce967e' : '#ddd'}`,
            borderRadius: 8,
            padding: '24px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? '#fdf6f3' : '#fafafa',
            transition: 'all 0.2s',
          }}
        >
          {uploading ? (
            <span style={{ color: '#888', fontSize: 13 }}>Uploading...</span>
          ) : (
            <>
              <div style={{ fontSize: 28, marginBottom: 6 }}>📁</div>
              <div style={{ fontSize: 13, color: '#888' }}>
                Click or drag &amp; drop to upload
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
                PNG, JPG, JPEG, WebP (max 5MB)
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
