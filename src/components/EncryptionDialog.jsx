import React, { useState } from 'react';
import { theme } from '../styles/theme';

export default function EncryptionDialog({ onEncrypt, onCancel }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    onEncrypt(password);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          maxWidth: '500px',
          width: '100%',
          border: `1px solid ${theme.colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{
          margin: `0 0 ${theme.spacing.md} 0`,
          color: theme.colors.text.primary,
          fontSize: '1.5rem',
        }}>
          🔐 Encrypt File
        </h2>
        
        <p style={{
          color: theme.colors.text.secondary,
          marginBottom: theme.spacing.lg,
          fontSize: '0.95rem',
        }}>
          Protect your file with end-to-end encryption. The file will be encrypted before uploading to IPFS.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: theme.spacing.md }}>
            <label style={{
              display: 'block',
              marginBottom: theme.spacing.xs,
              color: theme.colors.text.primary,
              fontSize: '0.9rem',
              fontWeight: '500',
            }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 8 characters)"
                required
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  paddingRight: '3rem',
                  background: theme.colors.background.card,
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

          <div style={{ marginBottom: theme.spacing.lg }}>
            <label style={{
              display: 'block',
              marginBottom: theme.spacing.xs,
              color: theme.colors.text.primary,
              fontSize: '0.9rem',
              fontWeight: '500',
            }}>
              Confirm Password *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
              style={{
                width: '100%',
                padding: theme.spacing.sm,
                background: theme.colors.background.card,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.sm,
                color: theme.colors.text.primary,
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: theme.spacing.sm,
            justifyContent: 'flex-end',
          }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                background: 'rgba(148, 163, 184, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: theme.borderRadius.sm,
                color: theme.colors.text.secondary,
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                background: theme.colors.blue.gradient,
                border: 'none',
                borderRadius: theme.borderRadius.sm,
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: theme.shadows.sm,
              }}
            >
              🔒 Encrypt & Upload
            </button>
          </div>
        </form>

        <div style={{
          marginTop: theme.spacing.md,
          padding: theme.spacing.sm,
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: theme.borderRadius.sm,
          fontSize: '0.85rem',
          color: '#fbbf24',
        }}>
          ⚠️ <strong>Important:</strong> Save your password! Files cannot be decrypted without it.
        </div>
      </div>
    </div>
  );
}
