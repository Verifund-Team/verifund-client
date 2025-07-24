import { type WalletClient } from 'viem';
import { ethers } from 'ethers';

export async function walletClientToSigner(walletClient: WalletClient): Promise<ethers.Signer> {
  const { account, chain, transport } = walletClient;
  
  if (!account) {
    throw new Error('No account found in wallet client');
  }
  
  if (!chain) {
    throw new Error('No chain found in wallet client. Please ensure wallet is connected to a network.');
  }
  
  if (!transport) {
    throw new Error('No transport found in wallet client');
  }
  
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  
  const provider = new ethers.BrowserProvider(transport, network);
  return await provider.getSigner(account.address);
}