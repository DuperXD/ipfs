import React from 'react';
import { theme } from '../styles/theme';

export default function AnalyticsDashboard({ files, folders }) {
  // Calculate statistics
  const totalFiles = files.length;
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const encryptedFiles = files.filter(f => f.encrypted).length;
  const publicFiles = totalFiles - encryptedFiles;
  const totalFolders = folders.length;

  // File type breakdown
  const getFileTypeStats = () => {
    const types = {
      images: 0,
      videos: 0,
      documents: 0,
      audio: 0,
      other: 0
    };

    files.forEach(file => {
      const type = file.type || file.originalType || '';
      if (type.startsWith('image/')) types.images++;
      else if (type.startsWith('video/')) types.videos++;
      else if (type.startsWith('audio/')) types.audio++;
      else if (type.includes('pdf') || type.includes('document') || type.includes('text')) types.documents++;
      else types.other++;
    });

    return types;
  };

  const fileTypes = getFileTypeStats();

  // Recent uploads (last 5)
  const recentUploads = [...files]
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, 5);

  // Largest files (top 5)
  const largestFiles = [...files]
    .sort((a, b) => b.size - a.size)
    .slice(0, 5);

  // Upload activity by day (last 7 days)
  const getUploadActivity = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const activity = new Array(7).fill(0);
    
    const now = new Date();
    files.forEach(file => {
      const uploadDate = new Date(file.uploadedAt);
      const daysDiff = Math.floor((now - uploadDate) / (1000 * 60 * 60 * 24));
      if (daysDiff < 7) {
        const dayIndex = uploadDate.getDay();
        activity[dayIndex]++;
      }
    });

    return days.map((day, index) => ({
      day,
      count: activity[index]
    }));
  };

  const uploadActivity = getUploadActivity();
  const maxActivity = Math.max(...uploadActivity.map(d => d.count), 1);

  // Format file size
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

  // Storage percentage
  const storageLimit = 1024 * 1024 * 1024; // 1 GB
  const storagePercent = (totalSize / storageLimit) * 100;

  return (
    <div style={{
      background: theme.colors.background.card,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.border}`,
      padding: theme.spacing.xl,
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: theme.spacing.xl }}>
        <div style={{ fontSize: '3rem', marginBottom: theme.spacing.sm }}>📊</div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: theme.spacing.xs, color: theme.colors.text.primary }}>
          Analytics Dashboard
        </h2>
        <p style={{ color: theme.colors.text.secondary, fontSize: '1rem' }}>
          Your storage insights and activity
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
      }}>
        {/* Total Files */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: `1px solid rgba(59, 130, 246, 0.3)`,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>📁</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: theme.colors.blue.light, marginBottom: theme.spacing.xs }}>
            {totalFiles}
          </div>
          <div style={{ color: theme.colors.text.secondary, fontSize: '0.9rem' }}>
            Total Files
          </div>
        </div>

        {/* Storage Used */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: `1px solid rgba(16, 185, 129, 0.3)`,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>💾</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#34d399', marginBottom: theme.spacing.xs }}>
            {formatSize(totalSize)}
          </div>
          <div style={{ color: theme.colors.text.secondary, fontSize: '0.9rem', marginBottom: theme.spacing.xs }}>
            of 1 GB ({storagePercent.toFixed(1)}%)
          </div>
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            height: '6px',
            borderRadius: '3px',
            overflow: 'hidden',
          }}>
            <div style={{
              background: storagePercent > 80 ? '#f87171' : '#34d399',
              width: `${Math.min(storagePercent, 100)}%`,
              height: '100%',
              transition: 'width 0.3s',
            }} />
          </div>
        </div>

        {/* Folders */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: `1px solid rgba(245, 158, 11, 0.3)`,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>📂</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#fbbf24', marginBottom: theme.spacing.xs }}>
            {totalFolders}
          </div>
          <div style={{ color: theme.colors.text.secondary, fontSize: '0.9rem' }}>
            Total Folders
          </div>
        </div>

        {/* Encrypted Files */}
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: `1px solid rgba(139, 92, 246, 0.3)`,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>🔒</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#a78bfa', marginBottom: theme.spacing.xs }}>
            {encryptedFiles}
          </div>
          <div style={{ color: theme.colors.text.secondary, fontSize: '0.9rem' }}>
            Encrypted ({totalFiles > 0 ? Math.round((encryptedFiles / totalFiles) * 100) : 0}%)
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
      }}>
        {/* Upload Activity */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.05)',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
        }}>
          <h3 style={{ margin: `0 0 ${theme.spacing.md} 0`, color: theme.colors.text.primary, fontSize: '1.1rem' }}>
            📈 Upload Activity (Last 7 Days)
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '120px' }}>
            {uploadActivity.map((day, index) => (
              <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  background: theme.colors.blue.gradient,
                  height: `${(day.count / maxActivity) * 100}%`,
                  minHeight: '4px',
                  borderRadius: '4px 4px 0 0',
                  marginBottom: '0.5rem',
                  transition: 'height 0.3s',
                }} />
                <div style={{ fontSize: '0.75rem', color: theme.colors.text.secondary }}>
                  {day.day}
                </div>
                <div style={{ fontSize: '0.7rem', color: theme.colors.text.secondary }}>
                  {day.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File Types */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.05)',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
        }}>
          <h3 style={{ margin: `0 0 ${theme.spacing.md} 0`, color: theme.colors.text.primary, fontSize: '1.1rem' }}>
            📁 File Types
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: '🖼️ Images', count: fileTypes.images, color: '#3b82f6' },
              { label: '🎥 Videos', count: fileTypes.videos, color: '#10b981' },
              { label: '📄 Documents', count: fileTypes.documents, color: '#f59e0b' },
              { label: '🎵 Audio', count: fileTypes.audio, color: '#8b5cf6' },
              { label: '📦 Other', count: fileTypes.other, color: '#6b7280' },
            ].map((type, index) => {
              const percentage = totalFiles > 0 ? (type.count / totalFiles) * 100 : 0;
              return (
                <div key={index}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.25rem',
                    fontSize: '0.9rem',
                  }}>
                    <span style={{ color: theme.colors.text.primary }}>{type.label}</span>
                    <span style={{ color: theme.colors.text.secondary }}>
                      {type.count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    height: '8px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      background: type.color,
                      width: `${percentage}%`,
                      height: '100%',
                      transition: 'width 0.3s',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lists Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: theme.spacing.lg,
      }}>
        {/* Recent Uploads */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.05)',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
        }}>
          <h3 style={{ margin: `0 0 ${theme.spacing.md} 0`, color: theme.colors.text.primary, fontSize: '1.1rem' }}>
            ⏱️ Recent Uploads
          </h3>
          {recentUploads.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentUploads.map((file, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: theme.spacing.sm,
                  background: 'rgba(59, 130, 246, 0.05)',
                  borderRadius: theme.borderRadius.sm,
                }}>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{
                      color: theme.colors.text.primary,
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {file.encrypted && '🔒 '}{file.name}
                    </div>
                    <div style={{ color: theme.colors.text.secondary, fontSize: '0.75rem' }}>
                      {formatDate(file.uploadedAt)}
                    </div>
                  </div>
                  <div style={{ color: theme.colors.text.secondary, fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                    {formatSize(file.size)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: theme.colors.text.secondary, textAlign: 'center', padding: theme.spacing.md }}>
              No uploads yet
            </div>
          )}
        </div>

        {/* Largest Files */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.05)',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
        }}>
          <h3 style={{ margin: `0 0 ${theme.spacing.md} 0`, color: theme.colors.text.primary, fontSize: '1.1rem' }}>
            📦 Largest Files
          </h3>
          {largestFiles.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {largestFiles.map((file, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: theme.spacing.sm,
                  background: 'rgba(59, 130, 246, 0.05)',
                  borderRadius: theme.borderRadius.sm,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, overflow: 'hidden' }}>
                    <span style={{ color: theme.colors.text.secondary, fontSize: '0.85rem' }}>
                      {index + 1}.
                    </span>
                    <div style={{
                      color: theme.colors.text.primary,
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {file.encrypted && '🔒 '}{file.name}
                    </div>
                  </div>
                  <div style={{
                    color: theme.colors.blue.light,
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginLeft: '0.5rem',
                  }}>
                    {formatSize(file.size)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: theme.colors.text.secondary, textAlign: 'center', padding: theme.spacing.md }}>
              No files yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
