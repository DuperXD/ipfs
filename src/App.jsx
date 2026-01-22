import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import FilesList from './components/FilesList';
import ShareSection from './components/ShareSection';
import FilePreview from './components/FilePreview';
import EncryptionDialog from './components/EncryptionDialog';
import DecryptDialog from './components/DecryptDialog';
import FolderManager from './components/FolderManager';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { WalletService } from './utils/wallet';
import { IPFSService } from './utils/ipfs';
import { EncryptionService } from './utils/encryption';
import { theme } from './styles/theme';

export default function App() {
  // Core state
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('/');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [sharedLink, setSharedLink] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [ipfsMode, setIpfsMode] = useState('checking');

  // Advanced features state
  const [showPreview, setShowPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [showEncryptDialog, setShowEncryptDialog] = useState(false);
  const [showDecryptDialog, setShowDecryptDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [fileToDecrypt, setFileToDecrypt] = useState(null);

  // Services
  const walletService = new WalletService();
  const ipfsService = new IPFSService();
  const encryptionService = new EncryptionService();

  // Initialize
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMetaMaskInstalled(typeof window.ethereum !== 'undefined');
      setIpfsMode(ipfsService.useRealIPFS ? 'real' : 'simulated');
      checkConnection();
      setupEventListeners();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (account) {
      loadFilesFromStorage();
      loadFoldersFromStorage();
    }
  }, [account]);

  const checkConnection = async () => {
    const { connected, account: walletAccount } = await walletService.checkIfWalletIsConnected();
    if (connected) {
      setAccount(walletAccount);
      setIsConnected(true);
    }
  };

  const setupEventListeners = () => {
    walletService.onAccountsChanged((accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      } else {
        setAccount('');
        setIsConnected(false);
        setFiles([]);
        setFolders([]);
      }
    });

    walletService.onChainChanged(() => {
      window.location.reload();
    });
  };

  const connectWallet = async () => {
    const { success, account: walletAccount, error } = await walletService.connectWallet();
    if (success) {
      setAccount(walletAccount);
      setIsConnected(true);
    } else {
      alert(error || 'Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
    setFiles([]);
    setFolders([]);
    setCurrentFolder('/');
  };

  // File upload (regular)
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    setUploading(true);
    try {
      const fileData = await ipfsService.uploadFile(file, account);
      fileData.folder = currentFolder;
      fileData.encrypted = false;

      const newFiles = [...files, fileData];
      setFiles(newFiles);
      saveFilesToStorage(newFiles);
      alert('✅ File uploaded!');
      event.target.value = '';
    } catch (error) {
      alert('❌ Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Encrypted upload
  const handleEncryptedUpload = (file) => {
    if (!file) return;
    if (!isConnected) {
      alert('Connect wallet first!');
      return;
    }
    setPendingFile(file);
    setShowEncryptDialog(true);
  };

  const handleEncryptionConfirm = async (password) => {
    if (!pendingFile) return;

    setShowEncryptDialog(false);
    setUploading(true);

    try {
      const { encryptedFile, originalName, originalType, originalSize } = 
        await encryptionService.encryptFile(pendingFile, password);

      const encryptedFileObj = new File([encryptedFile], originalName + '.encrypted', {
        type: 'application/octet-stream'
      });

      const fileData = await ipfsService.uploadFile(encryptedFileObj, account);
      fileData.encrypted = true;
      fileData.originalName = originalName;
      fileData.originalType = originalType;
      fileData.originalSize = originalSize;
      fileData.folder = currentFolder;
      fileData.name = originalName;

      const newFiles = [...files, fileData];
      setFiles(newFiles);
      saveFilesToStorage(newFiles);

      alert('✅ Encrypted & uploaded!\n⚠️ Save your password!');
      setPendingFile(null);
    } catch (error) {
      alert('❌ Encryption failed');
    } finally {
      setUploading(false);
    }
  };

  // Storage
  const saveFilesToStorage = (filesData) => {
    localStorage.setItem(`ipfs_files_${account}`, JSON.stringify(filesData));
  };

  const loadFilesFromStorage = () => {
    const stored = localStorage.getItem(`ipfs_files_${account}`);
    setFiles(stored ? JSON.parse(stored) : []);
  };

  const saveFoldersToStorage = (foldersData) => {
    localStorage.setItem(`ipfs_folders_${account}`, JSON.stringify(foldersData));
  };

  const loadFoldersFromStorage = () => {
    const stored = localStorage.getItem(`ipfs_folders_${account}`);
    setFolders(stored ? JSON.parse(stored) : []);
  };

  // Folder operations
  const createFolder = (folderName) => {
    const folderPath = currentFolder === '/' 
      ? `/${folderName}` 
      : `${currentFolder}/${folderName}`;

    if (folders.includes(folderPath)) {
      alert('Folder exists!');
      return;
    }

    const newFolders = [...folders, folderPath];
    setFolders(newFolders);
    saveFoldersToStorage(newFolders);
    alert(`✅ Folder "${folderName}" created!`);
  };

 const navigateToFolder = (folderPath) => {
    setCurrentFolder(folderPath);
    setActiveTab('files');
  };

  const deleteFolder = (folderPath) => {
    // Delete the folder
    const updatedFolders = folders.filter(f => !f.startsWith(folderPath));
    setFolders(updatedFolders);
    saveFoldersToStorage(updatedFolders);

    // Delete all files in that folder
    const updatedFiles = files.filter(file => {
      const fileFolderPath = file.folder || '/';
      return !fileFolderPath.startsWith(folderPath);
    });
    setFiles(updatedFiles);
    saveFilesToStorage(updatedFiles);

    // Navigate to parent folder
    const parentFolder = folderPath.substring(0, folderPath.lastIndexOf('/')) || '/';
    setCurrentFolder(parentFolder);

    alert(`✅ Folder deleted! All files inside were also deleted.`);
  };

  // File operations
  // File operations
  const deleteFile = async (cid) => {
    if (!confirm('Delete file permanently?')) return;

    try {
      const fileToDelete = files.find(f => f.cid === cid);

      if (fileToDelete?.isRealIPFS && ipfsService.useRealIPFS) {
        await ipfsService.deleteFromPinata(cid);
        alert('✅ Deleted from IPFS!');
      } else {
        alert('✅ Deleted locally!');
      }

      const updatedFiles = files.filter(f => f.cid !== cid);
      setFiles(updatedFiles);
      saveFilesToStorage(updatedFiles);
    } catch (error) {
      alert('⚠️ Removed from app');
      const updatedFiles = files.filter(f => f.cid !== cid);
      setFiles(updatedFiles);
      saveFilesToStorage(updatedFiles);
    }
  };

  const generateShareLink = (cid) => {
    const file = files.find(f => f.cid === cid);
    const link = ipfsService.getGatewayUrl(cid);
    setSharedLink({ url: link, file: file });
    navigator.clipboard.writeText(link);
    setActiveTab('share');
  };

  const handleFilePreview = (file) => {
    if (file.encrypted) {
      // Show decrypt dialog for encrypted files
      setFileToDecrypt(file);
      setShowDecryptDialog(true);
      return;
    }

    const fileWithUrl = {
      ...file,
      ipfsUrl: ipfsService.getGatewayUrl(file.cid),
      formattedSize: ipfsService.formatFileSize(file.size)
    };

    setPreviewFile(fileWithUrl);
    setShowPreview(true);
  };

  const handleDecrypt = async (password) => {
    if (!fileToDecrypt) return;

    try {
      // Fetch encrypted file from IPFS
      const ipfsUrl = ipfsService.getGatewayUrl(fileToDecrypt.cid);
      console.log('📥 Downloading encrypted file from IPFS...');

      const response = await fetch(ipfsUrl);
      if (!response.ok) {
        throw new Error('Failed to download file from IPFS');
      }

      const encryptedBlob = await response.blob();
      console.log('🔓 Decrypting file...');

      // Decrypt the file
      const decryptedData = await encryptionService.decryptFile(encryptedBlob, password);

      // Create blob from decrypted data
      const decryptedBlob = new Blob([decryptedData], { 
        type: fileToDecrypt.originalType || 'application/octet-stream' 
      });

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(decryptedBlob);

      console.log('✅ File decrypted successfully!');

      // Close decrypt dialog
      setShowDecryptDialog(false);

      // Show preview with decrypted file
      const fileWithUrl = {
        ...fileToDecrypt,
        name: fileToDecrypt.originalName || fileToDecrypt.name,
        type: fileToDecrypt.originalType || fileToDecrypt.type,
        ipfsUrl: objectUrl,
        formattedSize: ipfsService.formatFileSize(fileToDecrypt.originalSize || fileToDecrypt.size),
        isDecrypted: true
      };

      setPreviewFile(fileWithUrl);
      setShowPreview(true);
      setFileToDecrypt(null);

    } catch (error) {
      console.error('Decryption error:', error);
      throw error; // Let DecryptDialog handle the error
    }
  };

  // Filters
  const getCurrentFolderFiles = () => {
    return files.filter(file => (file.folder || '/') === currentFolder);
  };

  const getFilteredFiles = () => {
    const folderFiles = getCurrentFolderFiles();
    if (!searchTerm) return folderFiles;
    return folderFiles.filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getCurrentSubfolders = () => {
    return folders.filter(folder => {
      const parentPath = folder.substring(0, folder.lastIndexOf('/')) || '/';
      return parentPath === currentFolder;
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.colors.background.primary,
      color: theme.colors.text.primary,
    }}>
      <Header
        isConnected={isConnected}
        account={account}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        ipfsMode={ipfsMode}
      />

      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: theme.spacing.lg,
      }}>
        {!isConnected ? (
          <div style={{
            textAlign: 'center',
            padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
            background: theme.colors.background.card,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border}`,
          }}>
            <div style={{ fontSize: '4rem', marginBottom: theme.spacing.sm }}>🔐</div>
            <h2 style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>
              {isMetaMaskInstalled ? 'Connect Wallet' : 'MetaMask Not Found'}
            </h2>
            <p style={{ color: theme.colors.text.secondary, fontSize: '1.1rem', marginBottom: theme.spacing.lg }}>
              {isMetaMaskInstalled 
                ? 'Authenticate with MetaMask'
                : 'Install MetaMask and refresh'}
            </p>
            {!isMetaMaskInstalled && (
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: theme.colors.blue.gradient,
                  color: 'white',
                  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                  borderRadius: theme.borderRadius.md,
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: theme.spacing.lg,
                }}
              >
                🦊 Download MetaMask
              </a>
            )}
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: theme.spacing.sm,
              marginBottom: theme.spacing.lg,
              borderBottom: `2px solid ${theme.colors.border}`,
            }}>
              {[
                { id: 'upload', label: '📤 Upload' },
                { id: 'files', label: '📁 My Files' },
                { id: 'analytics', label: '📊 Analytics' },
                { id: 'share', label: '🔗 Share' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? `2px solid ${theme.colors.blue.primary}` : '2px solid transparent',
                    color: activeTab === tab.id ? theme.colors.blue.light : theme.colors.text.secondary,
                    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                    marginBottom: '-2px',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            {activeTab === 'upload' && (
              <>
               <FolderManager
                  currentFolder={currentFolder}
                  folders={folders}
                  onCreateFolder={createFolder}
                  onNavigate={navigateToFolder}
                  onDeleteFolder={deleteFolder}
                />







                <UploadSection
                  onFileUpload={handleFileUpload}
                  uploading={uploading}
                  onEncryptedUpload={handleEncryptedUpload}
                />
              </>
            )}

            {activeTab === 'files' && (
              <>
               <FolderManager
                  currentFolder={currentFolder}
                  folders={folders}
                  onCreateFolder={createFolder}
                  onNavigate={navigateToFolder}
                  onDeleteFolder={deleteFolder}
                />





                {getCurrentSubfolders().length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: theme.spacing.md,
                    marginBottom: theme.spacing.lg,
                  }}>
                    {getCurrentSubfolders().map(folder => (
                      <div
                        key={folder}
                        onClick={() => navigateToFolder(folder)}
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: theme.borderRadius.md,
                          padding: theme.spacing.md,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          textAlign: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div style={{ fontSize: '3rem', marginBottom: theme.spacing.xs }}>📁</div>
                        <div style={{ color: theme.colors.text.primary, fontWeight: '500' }}>
                          {folder.substring(folder.lastIndexOf('/') + 1)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <FilesList
                  files={getFilteredFiles()}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onDelete={deleteFile}
                  onShare={generateShareLink}
                  onPreview={handleFilePreview}
                  formatFileSize={ipfsService.formatFileSize}
                  formatDate={ipfsService.formatDate}
                />
              </>
            )}

           {activeTab === 'analytics' && (
              <AnalyticsDashboard
                files={files}
                folders={folders}
              />
            )}

            {activeTab === 'share' && (
              <ShareSection
                sharedLink={sharedLink}
                files={files}
                onGenerateLink={generateShareLink}
              />
            )}
          </>
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: theme.spacing.lg,
        color: theme.colors.text.secondary,
        fontSize: '0.9rem',
      }}>
        <p>🌐 IPFS • 🔐 Blockchain • ⚡ Web3</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
          {files.length} files • {folders.length} folders
        </p>
      </footer>

      {/* Modals */}
      {showPreview && (
        <FilePreview file={previewFile} onClose={() => setShowPreview(false)} />
      )}

      {showEncryptDialog && (
        <EncryptionDialog
          onEncrypt={handleEncryptionConfirm}
          onCancel={() => {
            setShowEncryptDialog(false);
            setPendingFile(null);
          }}
        />
      )}

      {showDecryptDialog && (
        <DecryptDialog
          file={fileToDecrypt}
          onDecrypt={handleDecrypt}
          onCancel={() => {
            setShowDecryptDialog(false);
            setFileToDecrypt(null);
          }}
        />
      )}
    </div>
  );
}
