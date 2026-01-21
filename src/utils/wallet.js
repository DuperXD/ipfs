import { ethers } from 'ethers';

export class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
  }

  async checkIfWalletIsConnected() {
    try {
      if (typeof window.ethereum === 'undefined') {
        return { connected: false, account: null };
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      });

      if (accounts.length > 0) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        return { connected: true, account: accounts[0] };
      }

      return { connected: false, account: null };
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      return { connected: false, account: null };
    }
  }

  async connectWallet() {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      return { success: true, account: accounts[0] };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return { success: false, error: error.message };
    }
  }

  async signMessage(message) {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }
      const signature = await this.signer.signMessage(message);
      return { success: true, signature };
    } catch (error) {
      console.error('Error signing message:', error);
      return { success: false, error: error.message };
    }
  }

  async getBalance(address) {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  onAccountsChanged(callback) {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', callback);
    }
  }

  onChainChanged(callback) {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('chainChanged', callback);
    }
  }
}
