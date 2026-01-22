import { ethers } from 'ethers';

// Record file upload on blockchain via transaction
export const recordUploadOnChain = async (fileName, cid) => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    console.log('💳 Preparing blockchain transaction...');

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    console.log('📝 User address:', userAddress);

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

    console.log('💸 Sending transaction...');
    console.log('Amount: 0.00001 ETH');
    console.log('Gas limit: 100000');

    // Create transaction - Let MetaMask handle balance check
    const tx = await signer.sendTransaction({
      to: userAddress,
      value: ethers.parseEther('0.00001'),
      data: data,
      gasLimit: 100000
    });

    console.log('⏳ Transaction sent! Hash:', tx.hash);
    console.log('⏳ Waiting for confirmation (this may take 15-30 seconds)...');

    // Wait for confirmation
    const receipt = await tx.wait();

    console.log('✅ Transaction confirmed!');
    console.log('✅ Block number:', receipt.blockNumber);
    console.log('✅ Gas used:', receipt.gasUsed.toString());

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    console.error('❌ Transaction error:', error);
    
    if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
      throw new Error('Transaction rejected by user');
    }
    
    if (error.message.includes('insufficient funds')) {
      throw new Error('Insufficient funds. Please get test ETH from: https://sepoliafaucet.com');
    }
    
    if (error.code === -32603) {
      throw new Error('RPC error. Please try again in a few minutes.');
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

    if (!tx || !receipt) {
      throw new Error('Transaction not found');
    }

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
