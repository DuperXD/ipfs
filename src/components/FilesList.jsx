import React from 'react';
import { theme } from '../styles/theme';

export default function FilesList({ files, searchTerm, onSearchChange, onDelete, onShare, onPreview, formatFileSize, formatDate }) {
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search Bar */}
      <div style={{ marginBottom: theme.spacing.lg }}>
        <input
          type="text"
          placeholder="🔍 Search files..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            background: theme.colors.background.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.sm,
            color: theme.colors.text.primary,
            fontSize: '1rem',
            outline: 'none',
          }}
        />
      </div>

      {/* File Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
      }}>
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.border}`,
        }}>
          <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>📊</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme.colors.blue.light }}>
            {files.length}
          </div>
          <div style={{ color: theme.colors.text.secondary, fontSize: '0.9rem' }}>Total Files</div>
        </div>
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius.md,
          border: '1px solid rgba(16, 185, 129, 0.3)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>💾</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#34d399' }}>
            {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}
          </div>
          <div style={{ color: theme.colors.text.secondary, fontSize: '0.9rem' }}>Total Storage</div>
        </div>
      </div>

      {/* Files Table */}
      <div style={{
        background: theme.colors.background.card,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        overflow: 'hidden',
      }}>
        {filteredFiles.length === 0 ? (
          <div style={{ padding: theme.spacing.xl, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.sm }}>📭</div>
            <p style={{ color: theme.colors.text.secondary, fontSize: '1.1rem' }}>
              {searchTerm ? 'No files found' : 'No files uploaded yet'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderBottom: `1px solid ${theme.colors.border}`,
                }}>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'left', color: theme.colors.blue.light, fontWeight: '600' }}>
                    Name
                  </th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'left', color: theme.colors.blue.light, fontWeight: '600' }}>
                    CID
                  </th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'left', color: theme.colors.blue.light, fontWeight: '600' }}>
                    Size
                  </th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'left', color: theme.colors.blue.light, fontWeight: '600' }}>
                    Uploaded
                  </th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'left', color: theme.colors.blue.light, fontWeight: '600' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr key={file.cid} style={{
                    borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
                    transition: 'background 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}>
                    <td style={{ padding: theme.spacing.sm, color: theme.colors.text.primary }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📄</span>
                        <span>{file.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: theme.spacing.sm, color: theme.colors.text.secondary, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {file.cid.substring(0, 10)}...{file.cid.substring(file.cid.length - 6)}
                    </td>
                    <td style={{ padding: theme.spacing.sm, color: theme.colors.text.secondary }}>
                      {formatFileSize(file.size)}
                    </td>
                    <td style={{ padding: theme.spacing.sm, color: theme.colors.text.secondary, fontSize: '0.9rem' }}>
                      {formatDate(file.uploadedAt)}
                    </td>
                    <td style={{ padding: theme.spacing.sm }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => onPreview(file)}
                          style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            color: '#34d399',
                            padding: '0.4rem 0.8rem',
                            borderRadius: theme.borderRadius.sm,
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            transition: 'all 0.3s',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(16, 185, 129, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(16, 185, 129, 0.1)';
                          }}
                        >
                          👁️ Preview
                        </button>
                        <button
                          onClick={() => onShare(file.cid)}
                          style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: `1px solid ${theme.colors.border}`,
                            color: theme.colors.blue.light,
                            padding: '0.4rem 0.8rem',
                            borderRadius: theme.borderRadius.sm,
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            transition: 'all 0.3s',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                          }}
                        >
                          🔗 Share
                        </button>
                        <button
                          onClick={() => onDelete(file.cid)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#f87171',
                            padding: '0.4rem 0.8rem',
                            borderRadius: theme.borderRadius.sm,
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            transition: 'all 0.3s',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
