import React, { useState, useEffect, useRef } from 'react';
import { theme } from '../styles/theme';

export default function ShareSection({ sharedLink, files, onGenerateLink }) {
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeURL, setQrCodeURL] = useState('');
  const canvasRef = useRef(null);

  const generateDecryptLink = (file, gateway) => {
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const gatewayParam = encodeURIComponent(gateway);
    const nameParam = encodeURIComponent(file.originalName || file.name);
    return `${baseUrl}/decrypt?cid=${file.cid}&gateway=${gatewayParam}&name=${nameParam}`;
  };

  // Generate QR code when link is available
  useEffect(() => {
    if (sharedLink && sharedLink.file && showQRCode) {
      generateQRCode();
    }
  }, [sharedLink, showQRCode]);

  const generateQRCode = async () => {
    if (!sharedLink || !sharedLink.file) return;

    const file = sharedLink.file;
    const gateway = sharedLink.url.includes('ipfs.io') 
      ? 'https://ipfs.io/ipfs/'
      : 'https://chocolate-accepted-galliform-350.mypinata.cloud/ipfs/';
    
    const decryptLink = generateDecryptLink(file, gateway);

    // Use QRCode library from CDN
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Import QRCode library dynamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
      
      script.onload = () => {
        // Clear previous QR code
        canvas.innerHTML = '';
        
        // Generate new QR code
        new window.QRCode(canvas, {
          text: decryptLink,
          width: 256,
          height: 256,
          colorDark: '#3b82f6',
          colorLight: '#ffffff',
          correctLevel: window.QRCode.CorrectLevel.H
        });

        // Convert canvas to data URL for download
        setTimeout(() => {
          const qrCanvas = canvas.querySelector('canvas');
          if (qrCanvas) {
            setQrCodeURL(qrCanvas.toDataURL());
          }
        }, 100);
      };

      if (!window.QRCode) {
        document.body.appendChild(script);
      } else {
        script.onload();
      }
    } catch (error) {
      console.error('QR Code generation error:', error);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    alert(`✅ ${type} copied to clipboard!`);
  };

  const downloadQRCode = () => {
    if (!qrCodeURL) return;
    
    const link = document.createElement('a');
    link.download = `qr-code-${sharedLink.file.name}.png`;
    link.href = qrCodeURL;
    link.click();
  };

  const handleGenerateLink = (file) => {
    onGenerateLink(file);
    setShowQRCode(false);
  };

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
      {sharedLink && (
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
              }}
            >
              📱 {showQRCode ? 'Hide' : 'Show'} QR Code
            </button>
          </div>

          {/* QR Code Display */}
          {showQRCode && (
            <div style={{
              background: 'white',
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.md,
              textAlign: 'center',
            }}>
              <div 
                ref={canvasRef} 
                style={{
                  display: 'inline-block',
                  padding: theme.spacing.md,
                  background: 'white',
                  borderRadius: theme.borderRadius.sm,
                }}
              />
              <p style={{
                color: theme.colors.text.secondary,
                fontSize: '0.9rem',
                marginTop: theme.spacing.sm,
                marginBottom: theme.spacing.sm,
              }}>
                📱 Scan with your phone to access file
              </p>
              <button
                onClick={downloadQRCode}
                style={{
                  background: theme.colors.blue.gradient,
                  border: 'none',
                  color: 'white',
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  borderRadius: theme.borderRadius.sm,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginTop: theme.spacing.sm,
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
                }}>
                  <input
                    type="text"
                    value={sharedLink.url}
                    readOnly
                    style={{
                      flex: 1,
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
                }}>
                  <input
                    type="text"
                    value={generateDecryptLink(
                      sharedLink.file,
                      sharedLink.url.includes('ipfs.io') 
                        ? 'https://ipfs.io/ipfs/'
                        : 'https://chocolate-accepted-galliform-350.mypinata.cloud/ipfs/'
                    )}
                    readOnly
                    style={{
                      flex: 1,
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
                        sharedLink.url.includes('ipfs.io') 
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
              }}>
                <input
                  type="text"
                  value={sharedLink.url}
                  readOnly
                  style={{
                    flex: 1,
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
                  }
                }}
                onMouseLeave={(e) => {
                  if (sharedLink?.file?.cid !== file.cid) {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                  }
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    color: theme.colors.text.primary,
                    fontSize: '1rem',
                    marginBottom: '4px',
                  }}>
                    {file.encrypted && '🔒 '}{file.name}
                  </div>
                  <div style={{
                    color: theme.colors.text.secondary,
                    fontSize: '0.85rem',
                  }}>
                    {new Date(file.uploadedAt).toLocaleDateString()}
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
