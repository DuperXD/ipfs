import React from 'react';
import { theme } from '../styles/theme';

export default function ShareSection({ sharedLink, files, onGenerateLink }) {
  const generateDecryptLink = (file, gateway) => {
    const baseUrl = window.location.origin;
    const gatewayParam = encodeURIComponent(gateway);
    const nameParam = encodeURIComponent(file.originalName || file.name);
    return `${baseUrl}/decrypt?cid=${file.cid}&gateway=${gatewayParam}&name=${nameParam}`;
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    alert(`✅ ${type} copied to clipboard!`);
  };

  return (
    <div style={{
      background: theme.colors.background.card,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.border}`,
      padding: theme.spacing.xl,
    }}>
      <div style={{ textAlign: 'center', marginBottom: theme.spacing.xl }}>
        <div style={{ fontSize: '4rem', marginBottom: theme.spacing.md }}>🔗</div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: theme.spacing.sm, color: theme.colors.text.primary }}>
          Share Files via IPFS
        </h2>
        <p style={{ color: theme.colors.text.secondary, fontSize: '1rem' }}>
          Generate shareable links using decentralized gateways
        </p>
      </div>

      {/* Shared Link Display */}
      {sharedLink && (
        <div style={{
          marginBottom: theme.spacing.lg,
          padding: theme.spacing.lg,
          background: 'rgba(16, 185, 129, 0.05)',
          border: `1px solid rgba(16, 185, 129, 0.3)`,
          borderRadius: theme.borderRadius.md,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: theme.spacing.md,
          }}>
            <span style={{ fontSize: '1.5rem' }}>✅</span>
            <h3 style={{ margin: 0, color: '#34d399', fontSize: '1.2rem' }}>
              Link Generated & Copied!
            </h3>
          </div>

          {/* File Info */}
          {sharedLink.file && (
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.sm,
              marginBottom: theme.spacing.md,
            }}>
              <div style={{ color: theme.colors.text.primary, fontWeight: '500', marginBottom: '0.25rem' }}>
                📄 {sharedLink.file.name}
              </div>
              {sharedLink.file.encrypted && (
                <div style={{ color: '#fbbf24', fontSize: '0.9rem' }}>
                  🔒 This file is encrypted
                </div>
              )}
            </div>
          )}

          {/* Regular IPFS Link */}
          <div style={{ marginBottom: sharedLink.file?.encrypted ? theme.spacing.md : 0 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}>
              <label style={{ color: theme.colors.text.primary, fontSize: '0.9rem', fontWeight: '500' }}>
                📎 IPFS Link {sharedLink.file?.encrypted ? '(Encrypted)' : ''}
              </label>
              <button
                onClick={() => copyToClipboard(sharedLink.url, 'IPFS link')}
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: 'none',
                  color: theme.colors.blue.light,
                  padding: '0.3rem 0.6rem',
                  borderRadius: theme.borderRadius.sm,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                📋 Copy
              </button>
            </div>
            <div style={{
              background: theme.colors.background.secondary,
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.sm,
              wordBreak: 'break-all',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              color: theme.colors.text.secondary,
            }}>
              {sharedLink.url}
            </div>
          </div>

          {/* Decrypt Link (for encrypted files) */}
          {sharedLink.file?.encrypted && (
            <div style={{
              padding: theme.spacing.md,
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: theme.borderRadius.sm,
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}>
                <label style={{ color: '#fbbf24', fontSize: '0.9rem', fontWeight: '600' }}>
                  🔓 Decrypt Link (Recommended for sharing)
                </label>
                <button
                  onClick={() => copyToClipboard(
                    generateDecryptLink(sharedLink.file, sharedLink.url.split('/ipfs/')[0] + '/ipfs/'),
                    'Decrypt link'
                  )}
                  style={{
                    background: 'rgba(245, 158, 11, 0.3)',
                    border: 'none',
                    color: '#fbbf24',
                    padding: '0.3rem 0.6rem',
                    borderRadius: theme.borderRadius.sm,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                  }}
                >
                  📋 Copy
                </button>
              </div>
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.sm,
                wordBreak: 'break-all',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                color: '#fbbf24',
                marginBottom: theme.spacing.sm,
              }}>
                {generateDecryptLink(sharedLink.file, sharedLink.url.split('/ipfs/')[0] + '/ipfs/')}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#fbbf24' }}>
                💡 <strong>Share this decrypt link</strong> - Recipients can enter the password and view the file in their browser (no account needed!)
              </div>
            </div>
          )}
        </div>
      )}

      {/* File List */}
      <div>
        <h3 style={{
          fontSize: '1.2rem',
          marginBottom: theme.spacing.md,
          color: theme.colors.text.primary,
        }}>
          Your Files
        </h3>

        {files.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: theme.spacing.xl,
            color: theme.colors.text.secondary,
          }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.sm }}>📭</div>
            <p>No files uploaded yet</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: theme.spacing.sm,
            maxHeight: '400px',
            overflowY: 'auto',
          }}>
            {files.map((file) => (
              <div
                key={file.cid}
                style={{
                  background: 'rgba(59, 130, 246, 0.05)',
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.sm,
                  border: `1px solid ${theme.colors.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                }}
              >
                <div>
                  <div style={{ color: theme.colors.text.primary, fontWeight: '500', marginBottom: '0.25rem' }}>
                    {file.encrypted && '🔒 '}{file.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: theme.colors.text.secondary, fontFamily: 'monospace' }}>
                    {file.cid.substring(0, 15)}...
                  </div>
                </div>
                <button
                  onClick={() => onGenerateLink(file.cid)}
                  style={{
                    background: theme.colors.blue.gradient,
                    border: 'none',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: theme.borderRadius.sm,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                  }}
                >
                  🔗 Generate Link
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div style={{
        marginTop: theme.spacing.lg,
        padding: theme.spacing.md,
        background: 'rgba(59, 130, 246, 0.1)',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.sm,
        fontSize: '0.85rem',
        color: theme.colors.text.secondary,
      }}>
        <strong style={{ color: theme.colors.blue.light }}>💡 Sharing Tips:</strong>
        <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong>Regular files:</strong> Share the IPFS link directly
          </li>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong>Encrypted files:</strong> Share the decrypt link + password (via different channel)
          </li>
          <li>
            Files are publicly accessible on IPFS - use encryption for sensitive data
          </li>
        </ul>
      </div>
    </div>
  );
}
