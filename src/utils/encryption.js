// File Encryption Service using Web Crypto API
export class EncryptionService {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
  }

  // Derive encryption key from password
  async deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      passwordKey,
      { name: this.algorithm, length: this.keyLength },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt file with password
  async encryptFile(file, password) {
    try {
      // Generate random salt and IV
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Derive encryption key from password
      const key = await this.deriveKey(password, salt);

      // Read file as array buffer
      const fileData = await file.arrayBuffer();

      // Encrypt the file
      const encryptedData = await crypto.subtle.encrypt(
        { name: this.algorithm, iv: iv },
        key,
        fileData
      );

      // Combine salt + iv + encrypted data
      const encryptedFile = new Blob([
        salt,
        iv,
        encryptedData
      ]);

      return {
        encryptedFile: encryptedFile,
        originalName: file.name,
        originalType: file.type,
        originalSize: file.size
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  }

  // Decrypt file with password
  async decryptFile(encryptedBlob, password) {
    try {
      // Read the encrypted blob
      const buffer = await encryptedBlob.arrayBuffer();
      const data = new Uint8Array(buffer);

      // Extract salt, IV, and encrypted data
      const salt = data.slice(0, 16);
      const iv = data.slice(16, 28);
      const encryptedData = data.slice(28);

      // Derive decryption key from password
      const key = await this.deriveKey(password, salt);

      // Decrypt the data
      const decryptedData = await crypto.subtle.decrypt(
        { name: this.algorithm, iv: iv },
        key,
        encryptedData
      );

      return decryptedData;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Incorrect password or corrupted file');
    }
  }

  // Check if file is encrypted (has encryption metadata)
  isEncrypted(fileMetadata) {
    return fileMetadata.encrypted === true;
  }
}
