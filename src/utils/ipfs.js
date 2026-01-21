export class IPFSService {
  constructor() {
    this.gatewayUrl = 'https://ipfs.io/ipfs/';
    this.pinataGateway = 'https://gateway.pinata.cloud/ipfs/';
    
    // Read Pinata credentials from environment variables
    this.pinataJWT = import.meta.env.VITE_PINATA_JWT || '';
    this.pinataApiKey = import.meta.env.VITE_PINATA_API_KEY || '';
    this.pinataSecretKey = import.meta.env.VITE_PINATA_SECRET_KEY || '';
    
    // Custom Pinata gateway (optional - faster than public gateways)
    this.customPinataGateway = import.meta.env.VITE_PINATA_GATEWAY || '';
    
    // Check if real IPFS is enabled
    this.useRealIPFS = this.pinataJWT !== '';
  }

  // Generate SHA-256 hash for file integrity verification
  async generateHash(file) {
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (error) {
      console.error('Error generating hash:', error);
      throw error;
    }
  }

  // Upload file to Pinata IPFS
  async uploadToPinata(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Optional: Add metadata
      const metadata = JSON.stringify({
        name: file.name,
      });
      formData.append('pinataMetadata', metadata);

      // Optional: Pin options
      const options = JSON.stringify({
        cidVersion: 1,
      });
      formData.append('pinataOptions', options);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.pinataJWT}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Pinata upload failed: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      return result.IpfsHash; // Returns the real CID
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      throw error;
    }
  }

  // Delete file from Pinata IPFS (unpin)
  async deleteFromPinata(cid) {
    try {
      const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.pinataJWT}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Pinata unpin failed: ${errorData.error || response.statusText}`);
      }

      console.log('✅ File unpinned from Pinata:', cid);
      return true;
    } catch (error) {
      console.error('Error unpinning from Pinata:', error);
      throw error;
    }
  }

  // Main upload function - uses real IPFS or simulation
  async uploadFile(file, ownerAddress) {
    try {
      // Generate cryptographic hash for data integrity
      const hash = await this.generateHash(file);
      
      let cid;
      
      if (this.useRealIPFS) {
        // REAL IPFS UPLOAD via Pinata
        console.log('📤 Uploading to real IPFS via Pinata...');
        cid = await this.uploadToPinata(file);
        console.log('✅ Real IPFS upload successful! CID:', cid);
      } else {
        // SIMULATED IPFS (fallback when no API key)
        console.log('⚠️ Using simulated IPFS (no Pinata key found)');
        cid = `Qm${hash.substring(0, 44)}`;
      }
      
      // Create file metadata
      const fileMetadata = {
        cid: cid,
        name: file.name,
        size: file.size,
        type: file.type,
        hash: hash,
        uploadedAt: new Date().toISOString(),
        owner: ownerAddress,
        isRealIPFS: this.useRealIPFS, // Track if this is real or simulated
      };

      return fileMetadata;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Verify file integrity using hash
  async verifyFileIntegrity(file, expectedHash) {
    try {
      const actualHash = await this.generateHash(file);
      return actualHash === expectedHash;
    } catch (error) {
      console.error('Error verifying file integrity:', error);
      return false;
    }
  }

  // Get IPFS gateway URL
  getGatewayUrl(cid, gateway = 'auto') {
    // If custom Pinata gateway is configured, use it (fastest)
    if (this.customPinataGateway && gateway === 'auto') {
      return `${this.customPinataGateway}/ipfs/${cid}`;
    }
    
    // Otherwise use specified gateway
    if (gateway === 'pinata') {
      return `${this.pinataGateway}${cid}`;
    }
    
    return `${this.gatewayUrl}${cid}`;
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
