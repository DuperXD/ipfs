import React, { useState, useEffect } from 'react';
import { theme } from '../styles/theme';

export default function ShareSection({ sharedLink, files, onGenerateLink }) {
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeURL, setQrCodeURL] = useState('');

  const generateDecryptLink = (file, gateway) => {
    try {
      const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      const gatewayParam = encodeURIComponent(gateway);
      const nameParam = encodeURIComponent(file.originalName || file.name);
      return `${baseUrl}/decrypt?cid=${file.cid}&gateway=${gatewayParam}&name=${nameParam}`;
    } catch (error) {
      console.error('Error generating decrypt link:', error);
      return '';
    }
  };

  // Generate QR code URL when showing QR
  // Generate QR code URL when showing QR
useEffect(() => {
  if (sharedLink && sharedLink.file && showQRCode) {
    try {
      const file = sharedLink.file;
      
      // Determine which link to use for QR code
      let linkForQR;
      
      if (file.encrypted) {
        // Encrypted file: Use decrypt link
        const gateway = sharedLink.url && sharedLink.url.includes('ipfs.io') 
          ? 'https://ipfs.io/ipfs/'
          : 'https://chocolate-accepted-galliform-350.mypinata.cloud/ipfs/';
        linkForQR = generateDecryptLink(file, gateway);
      } else {
        // Non-encrypted file: Use direct IPFS link
        linkForQR = sharedLink.url;
      }
      
      if (linkForQR) {
        // Use QR code generation API
        const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(linkForQR)}&color=3b82f6&bgcolor=ffffff`;
        setQrCodeURL(qrURL);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }
}, [sharedLink, showQRCode]);

  const copyToClipboard = (text, type) => {
    try {
      navigator.clipboard.writeText(text);
      alert(`✅ ${type} copied to clipboard!`);
    } catch (error) {
      console.error('Copy error:', error);
      alert('❌ Failed to copy to clipboard');
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeURL) return;
    
    try {
      const link = document.createElement('a');
      link.download = `qr-code-${sharedLink.file.name}.png`;
      link.href = qrCodeURL;
      link.target = '_blank';
      link.click();
    } catch (error) {
      console.error('Download error:', error);
      alert('❌ Failed to download QR code');
    }
  };

  const handleGenerateLink = (file) => {
    try {
      setShowQRCode(false);
      onGenerateLink(file);
    } catch (error) {
      console.error('Generate link error:', error);
      alert('❌ Failed to generate link');
    }
  };

  // Safety check
  if (!files) {
    return (
      <div style={{
        background: theme.colors.background.card,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        padding: theme.spacing.xl,
        textAlign: 'center',
        color: theme.colors.text.secondary,
      }}>
        Loading files...
      </div>
    );
  }

  return (
    <div style={{
      background: theme.colors.background.card,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.border}`,
      padding: theme.spacing.xl,
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: theme.spacing.xl }}>
        <div style={{ fontSize: '3rem', marginBottom: theme.spacing.sm }}>🔗</div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: theme.spacing.xs, color: theme.colors.text.primary }}>
          Share Files
        </h2>
        <p style={{ color: theme.colors.text.secondary, fontSize: '1rem' }}>
          Generate shareable links for your files
        </p>
      </div>

      {/* Shared Link Display */}
      {sharedLink && sharedLink.file && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: `1px solid rgba(59, 130, 246, 0.3)`,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.lg,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
            flexWrap: 'wrap',
            gap: theme.spacing.sm,
          }}>
            <h3 style={{ margin: 0, color: theme.colors.text.primary, fontSize: '1.1rem' }}>
              {sharedLink.file.encrypted && '🔒 '}
              {sharedLink.file.name}
            </h3>
            <button
              onClick={() => setShowQRCode(!showQRCode)}
              style={{
                background: showQRCode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                border: `1px solid ${showQRCode ? 'rgba(139, 92, 246, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
                color: showQRCode ? '#a78bfa' : theme.colors.blue.light,
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.sm,
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              📱 {showQRCode ? 'Hide' : 'Show'} QR Code
            </button>
          </div>

          {/* QR Code Display */}
          {showQRCode && qrCodeURL && (
            <div style={{
              background: 'white',
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.md,
              textAlign: 'center',
              border: '2px solid #e5e7eb',
            }}>
              <img 
                src={qrCodeURL} 
                alt="QR Code"
                style={{
                  width: '300px',
                  height: '300px',
                  display: 'block',
                  margin: '0 auto',
                  borderRadius: theme.borderRadius.sm,
                }}
                onError={(e) => {
                  console.error('QR code image failed to load');
                  e.target.style.display = 'none';
                }}
              />
              <p style={{
                color: '#374151',
                fontSize: '0.9rem',
                marginTop: theme.spacing.md,
                marginBottom: theme.spacing.sm,
                fontWeight: '500',
              }}>
                📱 Scan with your phone to access file
              </p>
              <button
                onClick={downloadQRCode}
                style={{
                  background: theme.colors.blue.gradient,
                  border: 'none',
                  color: 'white',
                  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                  borderRadius: theme.borderRadius.sm,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginTop: theme.spacing.sm,
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                💾 Download QR Code
              </button>
            </div>
          )}

          {/* Links Section */}
          {sharedLink.file.encrypted ? (
            <>
              {/* IPFS Link */}
              <div style={{ marginBottom: theme.spacing.md }}>
                <div style={{
                  color: theme.colors.text.secondary,
                  fontSize: '0.9rem',
                  marginBottom: theme.spacing.xs,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}>
                  <span>📎 IPFS Link</span>
                  <span style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                  }}>
                    Encrypted - Not Readable
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  gap: theme.spacing.sm,
                  flexWrap: 'wrap',
                }}>
                  <input
                    type="text"
                    value={sharedLink.url || ''}
                    readOnly
                    style={{
                      flex: 1,
                      minWidth: '200px',
                      padding: theme.spacing.sm,
                      background: theme.colors.background.secondary,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.sm,
                      color: theme.colors.text.primary,
                      fontSize: '0.9rem',
                    }}
                  />
                  <button
                    onClick={() => copyToClipboard(sharedLink.url, 'IPFS link')}
                    style={{
                      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: `1px solid rgba(59, 130, 246, 0.4)`,
                      borderRadius: theme.borderRadius.sm,
                      color: theme.colors.blue.light,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              {/* Decrypt Link */}
              <div>
                <div style={{
                  color: theme.colors.text.secondary,
                  fontSize: '0.9rem',
                  marginBottom: theme.spacing.xs,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}>
                  <span>🔓 Decrypt Link</span>
                  <span style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#4ade80',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                  }}>
                    Recommended for Sharing
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  gap: theme.spacing.sm,
                  flexWrap: 'wrap',
                }}>
                  <input
                    type="text"
                    value={generateDecryptLink(
                      sharedLink.file,
                      sharedLink.url && sharedLink.url.includes('ipfs.io') 
                        ? 'https://ipfs.io/ipfs/'
                        : 'https://chocolate-accepted-galliform-350.mypinata.cloud/ipfs/'
                    )}
                    readOnly
                    style={{
                      flex: 1,
                      minWidth: '200px',
                      padding: theme.spacing.sm,
                      background: theme.colors.background.secondary,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.sm,
                      color: theme.colors.text.primary,
                      fontSize: '0.9rem',
                    }}
                  />
                  <button
                    onClick={() => copyToClipboard(
                      generateDecryptLink(
                        sharedLink.file,
                        sharedLink.url && sharedLink.url.includes('ipfs.io') 
                          ? 'https://ipfs.io/ipfs/'
                          : 'https://chocolate-accepted-galliform-350.mypinata.cloud/ipfs/'
                      ),
                      'Decrypt link'
                    )}
                    style={{
                      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                      background: 'rgba(34, 197, 94, 0.2)',
                      border: '1px solid rgba(34, 197, 94, 0.4)',
                      borderRadius: theme.borderRadius.sm,
                      color: '#4ade80',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              <div style={{
                marginTop: theme.spacing.md,
                padding: theme.spacing.sm,
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: theme.borderRadius.sm,
                fontSize: '0.85rem',
                color: theme.colors.text.secondary,
              }}>
                💡 Tip: Share the decrypt link with the password separately for security
              </div>
            </>
          ) : (
            <div>
              <div style={{
                color: theme.colors.text.secondary,
                fontSize: '0.9rem',
                marginBottom: theme.spacing.xs,
              }}>
                📎 Public IPFS Link
              </div>
              <div style={{
                display: 'flex',
                gap: theme.spacing.sm,
                flexWrap: 'wrap',
              }}>
                <input
                  type="text"
                  value={sharedLink.url || ''}
                  readOnly
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: theme.spacing.sm,
                    background: theme.colors.background.secondary,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.sm,
                    color: theme.colors.text.primary,
                    fontSize: '0.9rem',
                  }}
                />
                <button
                  onClick={() => copyToClipboard(sharedLink.url, 'Link')}
                  style={{
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: `1px solid rgba(59, 130, 246, 0.4)`,
                    borderRadius: theme.borderRadius.sm,
                    color: theme.colors.blue.light,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                  }}
                >
                  📋 Copy
                </button>
              </div>

              <div style={{
                marginTop: theme.spacing.md,
                padding: theme.spacing.sm,
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: theme.borderRadius.sm,
                fontSize: '0.85rem',
                color: '#fbbf24',
              }}>
                ⚠️ Warning: This file is not encrypted. Anyone with the link can access it.
              </div>
            </div>
          )}
        </div>
      )}

      {/* File List */}
      <div>
        <h3 style={{
          margin: `0 0 ${theme.spacing.md} 0`,
          color: theme.colors.text.primary,
          fontSize: '1.1rem',
        }}>
          Select a file to share
        </h3>

        {files.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: theme.spacing.xl,
            color: theme.colors.text.secondary,
          }}>
            No files uploaded yet
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: theme.spacing.sm,
          }}>
            {files.map((file, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: theme.spacing.md,
                  background: sharedLink?.file?.cid === file.cid
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'rgba(59, 130, 246, 0.05)',
                  border: `1px solid ${
                    sharedLink?.file?.cid === file.cid
                      ? 'rgba(59, 130, 246, 0.4)'
                      : theme.colors.border
                  }`,
                  borderRadius: theme.borderRadius.md,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onClick={() => handleGenerateLink(file)}
                onMouseEnter={(e) => {
                  if (sharedLink?.file?.cid !== file.cid) {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sharedLink?.file?.cid !== file.cid) {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{
                    color: theme.colors.text.primary,
                    fontSize: '1rem',
                    marginBottom: '4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {file.encrypted && '🔒 '}{file.name}
                  </div>
                  <div style={{
                    color: theme.colors.text.secondary,
                    fontSize: '0.85rem',
                  }}>
                    {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'Recently uploaded'}
                  </div>
                </div>
                <div style={{
                  padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                  background: sharedLink?.file?.cid === file.cid
                    ? theme.colors.blue.gradient
                    : 'rgba(59, 130, 246, 0.2)',
                  border: 'none',
                  borderRadius: theme.borderRadius.sm,
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  marginLeft: theme.spacing.sm,
                  whiteSpace: 'nowrap',
                }}>
                  {sharedLink?.file?.cid === file.cid ? '✓ Selected' : 'Select'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
