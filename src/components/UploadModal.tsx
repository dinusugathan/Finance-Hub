'use client';
import { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, CheckCircle2 } from 'lucide-react';

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: { isOpen: boolean, onClose: () => void, onUploadSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('invoice', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      setSuccess(true);
      setTimeout(() => {
        onUploadSuccess();
        reset();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="glass-panel" style={{ width: '400px', padding: '30px', position: 'relative' }}>
        <button onClick={reset} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Upload Invoice</h2>
        
        {!success ? (
          <>
            <div 
              onDragOver={(e) => e.preventDefault()} 
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--glass-border)',
                borderRadius: '12px', padding: '40px 20px', textAlign: 'center',
                cursor: 'pointer', backgroundColor: 'rgba(15, 23, 42, 0.4)',
                transition: 'all 0.2s ease',
                borderColor: file ? 'var(--accent-color)' : 'var(--glass-border)'
              }}
            >
              <UploadCloud size={48} color={file ? 'var(--accent-color)' : 'var(--text-secondary)'} style={{ margin: '0 auto 15px' }} />
              <p style={{ color: file ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {file ? file.name : 'Drag & drop your invoice here or click to browse'}
              </p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*,application/pdf" />
            </div>

            {error && <p style={{ color: 'var(--danger-color)', marginTop: '15px', fontSize: '0.9rem' }}>{error}</p>}

            <button 
              className="btn" 
              onClick={uploadFile} 
              disabled={!file || loading}
              style={{ width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'center', opacity: (!file || loading) ? 0.6 : 1 }}
            >
              {loading ? <Loader2 className="spinner" size={20} /> : 'Extract & Save'}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <CheckCircle2 size={64} color="var(--success-color)" style={{ margin: '0 auto 15px' }} />
            <h3 style={{ color: 'var(--success-color)' }}>Invoice Processed!</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Data has been extracted and saved.</p>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spinner { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
}
