import React from 'react';
import { theme } from '../styles/theme';

export default function Header({ isConnected, account, onConnect, onDisconnect, ipfsMode }) {
  return (
    <header style={{
      background: theme.colors.background.secondary,
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${theme.colors.border}`,
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: theme.colors.blue.gradient,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
          }}>
            🗄️
          </div>
          <h1 style={{
            margin: 0,
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
          }}>
            DecentraStore
          </h1>
          
          {/* IPFS Mode Indicator */}
          {ipfsMode && (
            <div style={{
              background: ipfsMode === 'real' 
                ? 'rgba(16, 185, 129, 0.1)' 
                : 'rgba(245, 158, 11, 0.1)',
              border: ipfsMode === 'real'
                ? '1px solid rgba(16, 185, 129, 0.3)'
                : '1px solid rgba(245, 158, 11, 0.3)',
              color: ipfsMode === 'real' ? '#34d399' : '#fbbf24',
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              borderRadius: theme.borderRadius.sm,
              fontSize: '0.75rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}>
              {ipfsMode === 'real' ? '✅ Real IPFS' : '⚠️ Demo Mode'}
            </div>
          )}
        </div>

        {/* Wallet Connection */}
        {isConnected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: `1px solid ${theme.colors.border}`,
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              borderRadius: theme.borderRadius.sm,
              fontSize: '0.9rem',
              fontFamily: 'monospace',
            }}>
              {account.substring(0, 6)}...{account.substring(38)}
            </div>
            <button
              onClick={onDisconnect}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                borderRadius: theme.borderRadius.sm,
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.1)';
              }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={onConnect}
            style={{
              background: theme.colors.blue.gradient,
              border: 'none',
              color: 'white',
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              borderRadius: theme.borderRadius.sm,
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s',
              boxShadow: theme.shadows.md,
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = theme.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = theme.shadows.md;
            }}
          >
            🦊 Connect MetaMask
          </button>
        )}
      </div>
    </header>
  );
}
