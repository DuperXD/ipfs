import React, { useState } from 'react';
import { theme } from '../styles/theme';

export default function DecryptDialog({ file, onDecrypt, onCancel }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password) {
      alert('Please enter a password');
      return;
    }
    
    setIsDecrypting(true);
    
    try {
      await onDecrypt(password);
      setPassword('');
    } catch (error) {
      alert('❌ Incorrect password or decryption failed');
    } finally {
      setIsDecrypting(false);
    }
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
          🔓 Decrypt File
        </h2>
        
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          padding: theme.spacing.sm,
          borderRadius: theme.borderRadius.sm,
          marginBottom: theme.spacing.md,
          fontSize: '0.9rem',
        }}>
          <div style={{ color: theme.colors.text.primary, marginBottom: '0.25rem', fontWeight: '500' }}>
            📄 {file.name || file.originalName}
          </div>
          <div style={{ color: theme.colors.text.secondary, fontSize: '0.85rem' }}>
            🔒 This file is encrypted. Enter your password to view it.
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: theme.spacing.lg }}>
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
                placeholder="Enter decryption password"
                required
                autoFocus
                disabled={isDecrypting}
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

          <div style={{
            display: 'flex',
            gap: theme.spacing.sm,
            justifyContent: 'flex-end',
          }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={isDecrypting}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                background: 'rgba(148, 163, 184, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: theme.borderRadius.sm,
                color: theme.colors.text.secondary,
                cursor: isDecrypting ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                opacity: isDecrypting ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDecrypting}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                background: isDecrypting 
                  ? 'rgba(59, 130, 246, 0.5)' 
                  : theme.colors.blue.gradient,
                border: 'none',
                borderRadius: theme.borderRadius.sm,
                color: 'white',
                cursor: isDecrypting ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: theme.shadows.sm,
              }}
            >
              {isDecrypting ? '⏳ Decrypting...' : '🔓 Decrypt & Preview'}
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
          ⚠️ <strong>Note:</strong> Decryption happens locally in your browser. The password is never sent anywhere.
        </div>
      </div>
    </div>
  );
}
