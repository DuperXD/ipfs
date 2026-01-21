import React, { useState } from 'react';
import { theme } from '../styles/theme';

export default function UploadSection({ onFileUpload, uploading, onEncryptedUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [wantsEncryption, setWantsEncryption] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (wantsEncryption) {
        onEncryptedUpload(file);
      } else {
        onFileUpload({ target: { files: [file] } });
      }
    }
  };

  const handleFileSelect = (e) => {
    if (wantsEncryption) {
      onEncryptedUpload(e.target.files[0]);
    } else {
      onFileUpload(e);
    }
  };

  const features = [
    { icon: '🔐', title: 'Blockchain Auth', desc: 'MetaMask wallet verification' },
    { icon: '🔗', title: 'IPFS Storage', desc: 'Decentralized file hosting' },
    { icon: '✅', title: 'Data Integrity', desc: 'SHA-256 cryptographic hashing' },
    { icon: '🌐', title: 'Global Access', desc: 'Access files from anywhere' },
  ];

  return (
    <div style={{
      background: theme.colors.background.card,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.border}`,
      padding: theme.spacing.xl,
      textAlign: 'center',
    }}>
      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragging 
            ? `3px dashed ${theme.colors.blue.primary}` 
            : `2px dashed ${theme.colors.border}`,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.lg,
          background: isDragging 
            ? 'rgba(59, 130, 246, 0.1)' 
            : 'transparent',
          transition: 'all 0.3s',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: theme.spacing.md }}>
          {isDragging ? '📥' : '☁️'}
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: theme.spacing.sm, color: theme.colors.text.primary }}>
          {isDragging ? 'Drop to Upload' : 'Upload to IPFS'}
        </h2>
        <p style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing.lg, fontSize: '1rem' }}>
          {isDragging 
            ? 'Release to upload your file' 
            : 'Drag & drop a file here, or click to browse'}
        </p>

        {/* Encryption Toggle */}
        <label style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: theme.spacing.md,
          cursor: 'pointer',
          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
          background: wantsEncryption ? 'rgba(59, 130, 246, 0.1)' : 'rgba(148, 163, 184, 0.05)',
          borderRadius: theme.borderRadius.sm,
          transition: 'all 0.3s',
        }}>
          <input
            type="checkbox"
            checked={wantsEncryption}
            onChange={(e) => setWantsEncryption(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ color: theme.colors.text.primary, fontSize: '0.9rem' }}>
            🔒 Encrypt file with password
          </span>
        </label>

        <br />

        <label style={{
          display: 'inline-block',
          background: theme.colors.blue.gradient,
          color: 'white',
          padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
          borderRadius: theme.borderRadius.md,
          cursor: uploading ? 'not-allowed' : 'pointer',
          fontSize: '1.1rem',
          fontWeight: '600',
          transition: 'all 0.3s',
          boxShadow: theme.shadows.md,
          opacity: uploading ? 0.6 : 1,
        }}>
          {uploading ? '⏳ Uploading...' : wantsEncryption ? '🔒 Choose File to Encrypt' : '📎 Choose File'}
          <input
            type="file"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: theme.spacing.md,
      }}>
        {features.map((feature, i) => (
          <div key={i} style={{
            background: 'rgba(59, 130, 246, 0.05)',
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.border}`,
            transition: 'transform 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>{feature.icon}</div>
            <h3 style={{ fontSize: '1rem', marginBottom: theme.spacing.xs, color: theme.colors.text.primary }}>
              {feature.title}
            </h3>
            <p style={{ color: theme.colors.text.secondary, fontSize: '0.9rem', margin: 0 }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
