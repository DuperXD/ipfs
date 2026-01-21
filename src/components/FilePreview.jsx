import React, { useState, useEffect } from 'react';
import { theme } from '../styles/theme';

export default function FilePreview({ file, onClose }) {
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    if (file) {
      const url = file.ipfsUrl || file.localUrl;
      setPreviewUrl(url);
      setFileType(getFileType(file.type || file.name));
    }
  }, [file]);

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('text/') || mimeType === 'application/json') return 'text';
    return 'other';
  };

  const renderPreview = () => {
    switch (fileType) {
      case 'image':
        return (
          <img
            src={previewUrl}
            alt={file.name}
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              objectFit: 'contain',
              borderRadius: theme.borderRadius.md,
            }}
          />
        );

      case 'pdf':
        return (
          <iframe
            src={previewUrl}
            style={{
              width: '100%',
              height: '70vh',
              border: 'none',
              borderRadius: theme.borderRadius.md,
            }}
            title={file.name}
          />
        );

      case 'video':
        return (
          <video
            controls
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              borderRadius: theme.borderRadius.md,
            }}
          >
            <source src={previewUrl} type={file.type} />
            Your browser does not support video playback.
          </video>
        );

      case 'audio':
        return (
          <audio
            controls
            style={{
              width: '100%',
              marginTop: theme.spacing.lg,
            }}
          >
            <source src={previewUrl} type={file.type} />
            Your browser does not support audio playback.
          </audio>
        );

      case 'text':
        return (
          <div style={{
            background: '#1e293b',
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.md,
            maxHeight: '70vh',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            Loading text content...
          </div>
        );

      default:
        return (
          <div style={{
            textAlign: 'center',
            padding: theme.spacing.xl,
            color: theme.colors.text.secondary,
          }}>
            <div style={{ fontSize: '4rem', marginBottom: theme.spacing.md }}>📄</div>
            <p>Preview not available for this file type</p>
            <p style={{ fontSize: '0.9rem', marginTop: theme.spacing.sm }}>
              Download the file to view it
            </p>
          </div>
        );
    }
  };

  if (!file) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.md,
          paddingBottom: theme.spacing.sm,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}>
          <h3 style={{
            margin: 0,
            color: theme.colors.text.primary,
            fontSize: '1.2rem',
          }}>
            {file.name}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              borderRadius: theme.borderRadius.sm,
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold',
            }}
          >
            ✕
          </button>
        </div>

        {/* Preview Content */}
        <div style={{ textAlign: 'center' }}>
          {renderPreview()}
        </div>

        {/* File Info */}
        <div style={{
          marginTop: theme.spacing.md,
          padding: theme.spacing.sm,
          background: 'rgba(59, 130, 246, 0.05)',
          borderRadius: theme.borderRadius.sm,
          display: 'flex',
          gap: theme.spacing.md,
          fontSize: '0.85rem',
          color: theme.colors.text.secondary,
        }}>
          <span>📏 Size: {file.formattedSize || 'Unknown'}</span>
          <span>📅 Type: {file.type || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
}
