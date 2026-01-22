import { ethers } from 'ethers';

// Record file upload on blockchain via transaction
export const recordUploadOnChain = async (fileName, cid) => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    console.log('💳 Requesting blockchain transaction...');

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    // Encode file info in transaction data
    const data = ethers.hexlify(
      ethers.toUtf8Bytes(
        JSON.stringify({
          action: 'FILE_UPLOAD',
          fileName: fileName,
          cid: cid,
          timestamp: Date.now()
        })
      )
    );

    // Create transaction
    // Sending 0.0001 ETH to yourself with file data
    const tx = await signer.sendTransaction({
      to: userAddress, // Send to yourself
      value: ethers.parseEther('0.0001'), // 0.0001 ETH
      data: data // File info stored here
    });

    console.log('⏳ Transaction sent! Hash:', tx.hash);
    console.log('Waiting for confirmation...');

    // Wait for confirmation
    const receipt = await tx.wait();

    console.log('✅ Transaction confirmed!');
    console.log('Block number:', receipt.blockNumber);
    console.log('Gas used:', receipt.gasUsed.toString());

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    console.error('❌ Transaction failed:', error);
    
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('Transaction rejected by user');
    }
    
    throw error;
  }
};

// Get transaction details
export const getTransactionInfo = async (txHash) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const tx = await provider.getTransaction(txHash);
    const receipt = await provider.getTransactionReceipt(txHash);

    // Decode the data
    const dataString = ethers.toUtf8String(tx.data);
    const fileInfo = JSON.parse(dataString);

    return {
      hash: txHash,
      from: tx.from,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      fileInfo: fileInfo,
      timestamp: new Date(fileInfo.timestamp).toISOString()
    };
  } catch (error) {
    console.error('Error getting transaction:', error);
    return null;
  }
};
