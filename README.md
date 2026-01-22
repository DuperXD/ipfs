# 🗄️ DecentraStore - Web3 Decentralized File Storage

A modern decentralized file storage system built with React, IPFS, and blockchain wallet authentication.

## ✨ Features

- 🔐 **Blockchain Authentication**: MetaMask wallet integration for secure user authentication
- 🔗 **IPFS Storage**: Decentralized file storage using IPFS protocol
- ✅ **Data Integrity**: SHA-256 cryptographic hashing for file verification (CID)
- 📁 **User-Specific File History**: Personal file management per wallet address
- 🌐 **Secure File Sharing**: Share files via decentralized IPFS gateways
- 🎨 **Modern UI**: Beautiful dark-themed interface with shades of blue
- 🔍 **File Search**: Quick search functionality for uploaded files
- 📊 **Storage Stats**: Track total files and storage usage
- 📊  Analytics Dashboard
- ⚙️  QR Code Sharing
## 🏗️ Project Structure

```
web3-ipfs-storage/
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── src/
│   ├── main.jsx           # React entry point
│   ├── App.jsx            # Main application component
│   ├── components/
│   │   ├── Header.jsx     ## Navigation header with wallet connection
        ├── AnalyticsDashboar.jsx   #Analytics Stats
│   │   ├── UploadSection.jsx # File upload interface
│   │   ├── FilesList.jsx  # File management table
│   │   └── ShareSection.jsx   # File sharing interface
│   ├── utils/
│   │   ├── wallet.js      # Blockchain wallet service (MetaMask)
│   │   └── ipfs.js        # IPFS service with hashing
│   └── styles/
│       └── theme.js       # Design system and theme configuration
└── README.md              # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension installed
- **Pinata API Key** (for real IPFS - optional, see setup below)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up Pinata (OPTIONAL but RECOMMENDED for real IPFS)**:
   - See detailed guide: [PINATA_SETUP.md](PINATA_SETUP.md)
   - Quick steps:
     1. Create free account at https://pinata.cloud
     2. Get your JWT token from API Keys section
     3. Copy `.env.example` to `.env`
     4. Add your JWT to `.env` file
     5. Restart dev server

3. **Start development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to `http://localhost:3000`

5. **Connect MetaMask**:
Click "Connect MetaMask" button and approve the connection

6. **Check IPFS Mode**:
   - Look for badge in header:
   - ✅ **"Real IPFS"** (green) = Connected to Pinata, files actually uploaded to IPFS
   - ⚠️ **"Demo Mode"** (yellow) = No Pinata key, using simulation (files NOT on IPFS)

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 🔧 How It Works

### 1. Blockchain Authentication
- Users connect their MetaMask wallet
- Wallet address serves as unique user identifier
- All file operations are tied to the connected wallet

### 2. File Upload Process (Real IPFS with Pinata)
1. User selects a file to upload
2. File is uploaded to Pinata IPFS network
3. System generates SHA-256 hash for data integrity
4. **Real CID** (Content Identifier) is received from IPFS
5. File metadata stored in browser localStorage
6. Files are associated with user's wallet address
7. ✅ Files are **actually on IPFS** and accessible worldwide!

### 2b. File Upload Process (Demo Mode - No Pinata Key)
1. User selects a file to upload
2. System generates SHA-256 hash for data integrity
3. Simulated CID (Content Identifier) is created locally
4. File metadata stored in browser localStorage
5. Files are associated with user's wallet address
6. ⚠️ Files are **NOT on IPFS**, stored in browser only

### 3. Data Integrity (CID)
- Each file gets a cryptographic hash (SHA-256)
- Hash is used to generate IPFS-style CID
- Ensures file hasn't been tampered with
- Provides unique identifier for each file

### 4. File Sharing
- Generate shareable IPFS gateway links
- Multiple gateway options (IPFS.io, Pinata, Cloudflare)
- One-click link copying to clipboard
- Files remain accessible via decentralized network

## 🎨 Design System

### Color Palette
- **Background**: Dark gradients (#0a0e27 to #1a1f3a)
- **Primary Blue**: #3b82f6
- **Secondary Blue**: #1d4ed8
- **Light Blue**: #60a5fa
- **Text Primary**: #e0e7ff
- **Text Secondary**: #94a3b8

### Components
- Modern card-based layout
- Smooth hover transitions
- Responsive grid system
- Professional table design

## 🔐 Environment Variables

The app uses environment variables for Pinata API configuration:

```env
# Required for real IPFS uploads
VITE_PINATA_JWT=your_pinata_jwt_token

# Optional (alternative auth method)
VITE_PINATA_API_KEY=your_api_key
VITE_PINATA_SECRET_KEY=your_secret_key
```

**Setup**:
1. Copy `.env.example` to `.env`
2. Add your Pinata JWT token
3. Restart dev server
4. See [PINATA_SETUP.md](PINATA_SETUP.md) for detailed instructions

**Security**: Never commit `.env` file (already in `.gitignore`)

## 📝 Technical Details

### Storage
- **Local Storage**: Files metadata stored per wallet address
- **Key Format**: `ipfs_files_{walletAddress}`
- **Persistence**: Data persists across sessions

### IPFS Integration
Current implementation uses simulated IPFS for demonstration.

**For Production IPFS Integration**:

```javascript
// Install IPFS HTTP client
npm install ipfs-http-client

// Example integration
import { create } from 'ipfs-http-client';

const ipfs = create({ 
  host: 'ipfs.infura.io', 
  port: 5001, 
  protocol: 'https',
  headers: {
    authorization: 'Bearer YOUR_PROJECT_ID'
  }
});

const result = await ipfs.add(file);
const cid = result.path; // Real IPFS CID
```

### Wallet Service
- Ethers.js v6 for Ethereum interactions
- MetaMask provider integration
- Event listeners for account/chain changes
- Message signing capabilities

## 🔐 Security Features

- ✅ Client-side wallet authentication
- ✅ Cryptographic file hashing (SHA-256)
- ✅ Content addressing (CID)
- ✅ No server-side storage of credentials
- ✅ Decentralized file access

### Security Notes
- Files shared via IPFS gateways are publicly accessible
- Do not upload sensitive data without encryption
- Wallet private keys never leave the browser

## 🚀 Future Enhancements
- [ ] Download tracking
- [ ] Blockchain-based file registry smart contract
- [ ] ENS (Ethereum Name Service) integration
- [ ] File versioning
- [ ] Collaborative file sharing
- [ ] Mobile responsive improvements

## 🛠️ Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Ethers.js v6**: Ethereum wallet integration
- **Web Crypto API**: SHA-256 hashing
- **LocalStorage**: Client-side persistence
- **MetaMask**: Wallet provider

## 📖 Usage Guide

### Uploading Files
1. Connect your MetaMask wallet
2. Click "Upload" tab
3. Click "Choose File" button
4. Select file from your computer
5. File is hashed and stored

### 📊 Analytics Dashboard
- **Storage Insights** - Real-time storage usage with visual progress bars
- **Upload Activity Charts** - 7-day upload activity with bar graphs
- **File Type Breakdown** - Visual distribution of images, videos, documents, audio
- **Recent Uploads** - Timeline of latest file uploads
- **Largest Files Ranking** - Top 5 files by size
- **Encryption Statistics** - Percentage of encrypted vs public files
- **Folder Analytics** - Total folders and organization metrics

### Managing Files
1. Click "My Files" tab
2. Search files using search bar
3. View file details (name, CID, size, date)
4. Share or delete files using action buttons

### Sharing Files
1. Click "Share" tab
2. Click "Generate Link" on desired file
3. Link is copied to clipboard automatically
4. Share the IPFS gateway URL

### 📱 QR Code Sharing
- **Smart QR Generation** - Automatic QR code for any file
- **Encrypted File Support** - QR opens decrypt page for encrypted files
- **Direct Access** - QR opens file directly for public files
- **Mobile-First** - Scan with any phone camera (no app needed)
- **Downloadable QR Codes** - Save QR as PNG image
- **High Quality** - 300x300 pixel QR with error correction
- **Theme Matched** - Blue QR codes matching app design

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- IPFS Protocol for decentralized storage
- MetaMask for wallet infrastructure
- Ethers.js for blockchain interactions
- React team for amazing framework

---

**Built with ❤️ for the decentralized web**
