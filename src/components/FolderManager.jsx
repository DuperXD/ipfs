import React, { useState } from 'react';
import { theme } from '../styles/theme';

export default function FolderManager({ currentFolder, folders, onCreateFolder, onNavigate }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setShowCreateDialog(false);
    }
  };

  const getBreadcrumbs = () => {
    if (!currentFolder || currentFolder === '/') {
      return [{ name: 'Home', path: '/' }];
    }
    
    const parts = currentFolder.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Home', path: '/' }];
    
    let path = '';
    parts.forEach(part => {
      path += '/' + part;
      breadcrumbs.push({ name: part, path });
    });
    
    return breadcrumbs;
  };

  return (
    <div style={{ marginBottom: theme.spacing.lg }}>
      {/* Breadcrumbs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: theme.spacing.sm,
        flexWrap: 'wrap',
      }}>
        {getBreadcrumbs().map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            <button
              onClick={() => onNavigate(crumb.path)}
              style={{
                background: index === getBreadcrumbs().length - 1 
                  ? 'rgba(59, 130, 246, 0.2)' 
                  : 'transparent',
                border: 'none',
                color: index === getBreadcrumbs().length - 1 
                  ? theme.colors.blue.light 
                  : theme.colors.text.secondary,
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                borderRadius: theme.borderRadius.sm,
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: index === getBreadcrumbs().length - 1 ? '600' : '400',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                if (index !== getBreadcrumbs().length - 1) {
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.target.style.color = theme.colors.text.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (index !== getBreadcrumbs().length - 1) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = theme.colors.text.secondary;
                }
              }}
            >
              {crumb.name === 'Home' ? '🏠' : '📁'} {crumb.name}
            </button>
            {index < getBreadcrumbs().length - 1 && (
              <span style={{ color: theme.colors.text.secondary }}>›</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: theme.spacing.sm }}>
        <button
          onClick={() => setShowCreateDialog(true)}
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.blue.light,
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
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
            e.target.style.background = 'rgba(59, 130, 246, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(59, 130, 246, 0.1)';
          }}
        >
          📁 New Folder
        </button>
      </div>

      {/* Create Folder Dialog */}
      {showCreateDialog && (
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
          onClick={() => setShowCreateDialog(false)}
        >
          <div
            style={{
              background: theme.colors.background.secondary,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.xl,
              maxWidth: '400px',
              width: '100%',
              border: `1px solid ${theme.colors.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              margin: `0 0 ${theme.spacing.md} 0`,
              color: theme.colors.text.primary,
              fontSize: '1.3rem',
            }}>
              📁 Create New Folder
            </h3>

            <form onSubmit={handleCreateFolder}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                autoFocus
                required
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  marginBottom: theme.spacing.md,
                  background: theme.colors.background.card,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.sm,
                  color: theme.colors.text.primary,
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />

              <div style={{
                display: 'flex',
                gap: theme.spacing.sm,
                justifyContent: 'flex-end',
              }}>
                <button
                  type="button"
                  onClick={() => setShowCreateDialog(false)}
                  style={{
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    background: 'rgba(148, 163, 184, 0.1)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: theme.borderRadius.sm,
                    color: theme.colors.text.secondary,
                    cursor: 'pointer',
                    fontSize: '1rem',
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
                  }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
