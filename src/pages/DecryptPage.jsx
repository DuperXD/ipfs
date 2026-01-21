import React, { useState, useEffect } from 'react';
import { EncryptionService } from '../utils/encryption';
import { theme } from '../styles/theme';

export default function DecryptPage() {
  const [cid, setCid] = useState('');
  const [gateway, setGateway] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedFile, setDecryptedFile] = useState(null);
  const [error, setError] = useState('');
  const [fileInfo, setFileInfo] = useState(null);

  const encryptionService = new EncryptionService();

  useEffect(() => {
    // Get CID and gateway from URL params
    const params = new URLSearchParams(window.location.search);
    const cidParam = params.get('cid');
    const gatewayParam = params.get('gateway');
    
    if (cidParam) {
      setCid(cidParam);
    }
    
    if (gatewayParam) {
      setGateway(gatewayParam);
    } else {
      setGateway('https://ipfs.io/ipfs/');
    }
  }, []);

  const handleDecrypt = async (e) => {
    e.preventDefault();
    
    if (!password) {
      setError('Please enter a password');
      return;
    }

    if (!cid) {
      setError('No file CID provided');
      return;
    }

    setIsDecrypting(true);
    setError('');

    try {
      // Construct IPFS URL
      const ipfsUrl = gateway.endsWith('/') 
        ? `${gateway}${cid}` 
        : `${gateway}/${cid}`;

      console.log('📥 Downloading encrypted file from IPFS...');
      console.log('URL:', ipfsUrl);
      
      // Fetch encrypted file
      const response = await fetch(ipfsUrl);
      if (!response.ok) {
        throw new Error('Failed to download file from IPFS');
      }
      
      const encryptedBlob = await response.blob();
      console.log('📦 File downloaded:', encryptedBlob.size, 'bytes');
      console.log('🔓 Decrypting...');
      
      // Decrypt the file
      const decryptedData = await encryptionService.decryptFile(encryptedBlob, password);
      console.log('✅ Decryption successful!');
      
      // Get filename from URL params
      const params = new URLSearchParams(window.location.search);
      const filename = params.get('name') || 'decrypted-file';
      
      // Determine MIME type from filename extension
      const getMimeType = (filename) => {
        const ext = filename.toLowerCase().split('.').pop();
        const mimeTypes = {
          // Images
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'webp': 'image/webp',
          'svg': 'image/svg+xml',
          'bmp': 'image/bmp',
          'ico': 'image/x-icon',
          // Documents
          'pdf': 'application/pdf',
          'doc': 'application/msword',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'xls': 'application/vnd.ms-excel',
          'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'ppt': 'application/vnd.ms-powerpoint',
          'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          // Text
          'txt': 'text/plain',
          'html': 'text/html',
          'css': 'text/css',
          'js': 'text/javascript',
          'json': 'application/json',
          'xml': 'text/xml',
          'md': 'text/markdown',
          // Video
          'mp4': 'video/mp4',
          'webm': 'video/webm',
          'ogg': 'video/ogg',
          'avi': 'video/x-msvideo',
          'mov': 'video/quicktime',
          // Audio
          'mp3': 'audio/mpeg',
          'wav': 'audio/wav',
          'ogg': 'audio/ogg',
          'm4a': 'audio/mp4',
          // Archives
          'zip': 'application/zip',
          'rar': 'application/x-rar-compressed',
          '7z': 'application/x-7z-compressed',
          'tar': 'application/x-tar',
          'gz': 'application/gzip',
        };
        return mimeTypes[ext] || 'application/octet-stream';
      };
      
      const mimeType = getMimeType(filename);
      
      // Create blob from decrypted data with correct MIME type
      const decryptedBlob = new Blob([decryptedData], { type: mimeType });
      
      // Create object URL for preview or download
      const objectUrl = URL.createObjectURL(decryptedBlob);
      
      setDecryptedFile({
        blob: decryptedBlob,
        url: objectUrl,
        size: decryptedData.byteLength,
        name: filename,
        type: mimeType
      });

      setError('');
      
    } catch (err) {
      console.error('Decryption error:', err);
      setError('❌ Incorrect password or corrupted file. Please try again.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDownload = () => {
    if (!decryptedFile) return;

    const link = document.createElement('a');
    link.href = decryptedFile.url;
    link.download = decryptedFile.name || 'decrypted-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.colors.background.primary,
      color: theme.colors.text.primary,
      padding: theme.spacing.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: theme.colors.background.card,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        padding: theme.spacing.xl,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: theme.spacing.xl }}>
          <div style={{ fontSize: '4rem', marginBottom: theme.spacing.sm }}>🔓</div>
          <h1 style={{
            fontSize: '2rem',
            margin: `0 0 ${theme.spacing.sm} 0`,
            background: theme.colors.blue.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Decrypt Shared File
          </h1>
          <p style={{ color: theme.colors.text.secondary, fontSize: '1rem', margin: 0 }}>
            This file is encrypted. Enter the password to decrypt and access it.
          </p>
        </div>

        {!decryptedFile ? (
          <form onSubmit={handleDecrypt}>
            {/* File Info */}
            {cid && (
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.sm,
                marginBottom: theme.spacing.md,
                wordBreak: 'break-all',
              }}>
                <div style={{ fontSize: '0.85rem', color: theme.colors.text.secondary, marginBottom: '0.25rem' }}>
                  File CID:
                </div>
                <div style={{ fontSize: '0.9rem', color: theme.colors.text.primary, fontFamily: 'monospace' }}>
                  {cid.substring(0, 20)}...{cid.substring(cid.length - 15)}
                </div>
              </div>
            )}

            {/* Password Input */}
            <div style={{ marginBottom: theme.spacing.lg }}>
              <label style={{
                display: 'block',
                marginBottom: theme.spacing.xs,
                color: theme.colors.text.primary,
                fontSize: '0.9rem',
                fontWeight: '500',
              }}>
                Decryption Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password provided by sender"
                  required
                  autoFocus
                  disabled={isDecrypting}
                  style={{
                    width: '100%',
                    padding: theme.spacing.sm,
                    paddingRight: '3rem',
                    background: theme.colors.background.secondary,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.sm,
                    color: theme.colors.text.primary,
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: theme.colors.text.secondary,
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '0.25rem',
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.sm,
                marginBottom: theme.spacing.md,
                fontSize: '0.9rem',
              }}>
                {error}
              </div>
            )}

            {/* Decrypt Button */}
            <button
              type="submit"
              disabled={isDecrypting || !cid}
              style={{
                width: '100%',
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                background: isDecrypting ? 'rgba(59, 130, 246, 0.5)' : theme.colors.blue.gradient,
                border: 'none',
                borderRadius: theme.borderRadius.md,
                color: 'white',
                cursor: isDecrypting ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600',
                boxShadow: theme.shadows.md,
                transition: 'all 0.3s',
              }}
            >
              {isDecrypting ? '⏳ Decrypting...' : '🔓 Decrypt File'}
            </button>

            {/* Security Info */}
            <div style={{
              marginTop: theme.spacing.lg,
              padding: theme.spacing.sm,
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: theme.borderRadius.sm,
              fontSize: '0.85rem',
              color: '#34d399',
            }}>
              🔒 <strong>Secure:</strong> Decryption happens locally in your browser. Your password is never sent to any server.
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.sm,
              marginBottom: theme.spacing.lg,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: theme.spacing.xs }}>✅</div>
              <div style={{ color: '#34d399', fontSize: '1.2rem', fontWeight: '600', marginBottom: theme.spacing.xs }}>
                Decryption Successful!
              </div>
              <div style={{ color: theme.colors.text.primary, fontSize: '1rem', marginBottom: '0.25rem' }}>
                📄 {decryptedFile.name}
              </div>
              <div style={{ color: theme.colors.text.secondary, fontSize: '0.9rem' }}>
                Size: {formatFileSize(decryptedFile.size)} • Type: {decryptedFile.type}
              </div>
            </div>

            {/* Preview for images */}
            {decryptedFile.type?.startsWith('image/') && (
              <div style={{
                marginBottom: theme.spacing.md,
                textAlign: 'center',
                padding: theme.spacing.md,
                background: 'rgba(59, 130, 246, 0.05)',
                borderRadius: theme.borderRadius.sm,
              }}>
                <div style={{ 
                  color: theme.colors.text.primary, 
                  fontSize: '0.9rem', 
                  marginBottom: theme.spacing.sm,
                  fontWeight: '500'
                }}>
                  🖼️ Image Preview
                </div>
                <img
                  src={decryptedFile.url}
                  alt="Decrypted preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: theme.borderRadius.sm,
                  }}
                />
              </div>
            )}

            {/* Preview for videos */}
            {decryptedFile.type?.startsWith('video/') && (
              <div style={{
                marginBottom: theme.spacing.md,
                textAlign: 'center',
                padding: theme.spacing.md,
                background: 'rgba(59, 130, 246, 0.05)',
                borderRadius: theme.borderRadius.sm,
              }}>
                <div style={{ 
                  color: theme.colors.text.primary, 
                  fontSize: '0.9rem', 
                  marginBottom: theme.spacing.sm,
                  fontWeight: '500'
                }}>
                  🎬 Video Preview
                </div>
                <video
                  controls
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    borderRadius: theme.borderRadius.sm,
                  }}
                >
                  <source src={decryptedFile.url} type={decryptedFile.type} />
                  Your browser does not support video playback.
                </video>
              </div>
            )}

            {/* Preview for audio */}
            {decryptedFile.type?.startsWith('audio/') && (
              <div style={{
                marginBottom: theme.spacing.md,
                padding: theme.spacing.md,
                background: 'rgba(59, 130, 246, 0.05)',
                borderRadius: theme.borderRadius.sm,
              }}>
                <div style={{ 
                  color: theme.colors.text.primary, 
                  fontSize: '0.9rem', 
                  marginBottom: theme.spacing.sm,
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  🎵 Audio Preview
                </div>
                <audio
                  controls
                  style={{
                    width: '100%',
                  }}
                >
                  <source src={decryptedFile.url} type={decryptedFile.type} />
                  Your browser does not support audio playback.
                </audio>
              </div>
            )}

            {/* Preview for PDFs */}
            {decryptedFile.type === 'application/pdf' && (
              <div style={{
                marginBottom: theme.spacing.md,
                padding: theme.spacing.md,
                background: 'rgba(59, 130, 246, 0.05)',
                borderRadius: theme.borderRadius.sm,
              }}>
                <div style={{ 
                  color: theme.colors.text.primary, 
                  fontSize: '0.9rem', 
                  marginBottom: theme.spacing.sm,
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  📄 PDF Preview
                </div>
                <iframe
                  src={decryptedFile.url}
                  style={{
                    width: '100%',
                    height: '400px',
                    border: 'none',
                    borderRadius: theme.borderRadius.sm,
                  }}
                  title="PDF Preview"
                />
              </div>
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              style={{
                width: '100%',
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                background: theme.colors.blue.gradient,
                border: 'none',
                borderRadius: theme.borderRadius.md,
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600',
                boxShadow: theme.shadows.md,
                marginBottom: theme.spacing.sm,
              }}
            >
              📥 Download Decrypted File
            </button>

            {/* Decrypt Another */}
            <button
              onClick={() => {
                setDecryptedFile(null);
                setPassword('');
                setError('');
              }}
              style={{
                width: '100%',
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                background: 'rgba(148, 163, 184, 0.1)',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.sm,
                color: theme.colors.text.secondary,
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              🔄 Decrypt Another File
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: theme.spacing.xl,
          paddingTop: theme.spacing.md,
          borderTop: `1px solid ${theme.colors.border}`,
          textAlign: 'center',
          color: theme.colors.text.secondary,
          fontSize: '0.85rem',
        }}>
          <p style={{ margin: 0 }}>
            🌐 Powered by IPFS • 🔐 End-to-End Encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
