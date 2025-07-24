import { ethers } from 'ethers';
import { getWalletClient, getAccount, getPublicClient } from '@wagmi/core';
import { config } from '@/app/providers';
import { walletClientToSigner } from '@/lib/ethers';
import CampaignFactoryABI from '@/app/contracts/CampaignFactory.json';
import CampaignABI from '@/app/contracts/Campaign.json';
import VerifundSBTABI from '@/app/contracts/VerifundSBT.json';

export class Web3Service {
  private rpcProvider: ethers.JsonRpcProvider;

  constructor() {
    this.rpcProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL!);
  }

  // Helper untuk mendapatkan signer dari Wagmi
  private async getSigner(): Promise<ethers.Signer> {
    const walletClient = await getWalletClient(config);
    if (!walletClient) {
      throw new Error('Wallet not connected');
    }
    return walletClientToSigner(walletClient);
  }

  // Helper untuk mendapatkan address yang terhubung
  private async getConnectedAddress(): Promise<string> {
    const account = getAccount(config);
    if (!account.address) {
      throw new Error('Wallet not connected');
    }
    return account.address;
  }

  // Helper untuk format IDRX dengan decimals yang benar
  private async formatIDRX(amount: bigint): Promise<string> {
    const tokenContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_IDRX_TOKEN_ADDRESS!,
      ["function decimals() external view returns (uint8)"],
      this.rpcProvider
    );
    const decimals = await tokenContract.decimals();
    return ethers.formatUnits(amount, decimals);
  }

  // Helper untuk parse IDRX dengan decimals yang benar
  private async parseIDRX(amount: string): Promise<bigint> {
    const tokenContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_IDRX_TOKEN_ADDRESS!,
      ["function decimals() external view returns (uint8)"],
      this.rpcProvider
    );
    const decimals = await tokenContract.decimals();
    return ethers.parseUnits(amount, decimals);
  }

  async createCampaign(
    name: string,
    targetAmount: string,
    durationInDays: number,
    ipfsHash: string
  ): Promise<string> {
    const signer = await this.getSigner();
    const factoryAddress = process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS!;
    const factory = new ethers.Contract(factoryAddress, CampaignFactoryABI.abi, signer);

    const targetAmountInUnits = await this.parseIDRX(targetAmount);
    
    const tx = await factory.createCampaign(name, targetAmountInUnits, durationInDays, ipfsHash);
    const receipt = await tx.wait();
    
    return receipt.hash;
  }

  async getAllCampaigns(): Promise<string[]> {
    const factoryAddress = process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS!;
    const factory = new ethers.Contract(factoryAddress, CampaignFactoryABI.abi, this.rpcProvider);
    
    return await factory.getDeployedCampaigns();
  }

  async getCampaignInfo(campaignAddress: string) {
    const campaign = new ethers.Contract(campaignAddress, CampaignABI.abi, this.rpcProvider);
    const info = await campaign.getCampaignInfo();

    const isOwnerVerified = await this.checkVerificationStatus(info[0]);

    return {
      owner: info[0],
      name: info[1],
      target: await this.formatIDRX(info[2]),
      raised: await this.formatIDRX(info[3]),
      timeRemaining: Number(info[4]),
      status: Number(info[5]),
      isOwnerVerified
    };
  }

  async getCampaignDetails(campaignAddress: string) {
    const campaign = new ethers.Contract(campaignAddress, CampaignABI.abi, this.rpcProvider);
    
    const [info, ipfsHash] = await Promise.all([
      campaign.getCampaignInfo(),
      campaign.ipfsHash()
    ]);

    const isOwnerVerified = await this.checkVerificationStatus(info[0]);

    return {
      address: campaignAddress,
      owner: info[0],
      name: info[1],
      target: await this.formatIDRX(info[2]),
      raised: await this.formatIDRX(info[3]),
      timeRemaining: Number(info[4]),
      status: Number(info[5]),
      ipfsHash,
      isOwnerVerified
    };
  }

  async donateToCampaign(campaignAddress: string, amount: string): Promise<string> {
    const signer = await this.getSigner();
    const userAddress = await this.getConnectedAddress();
    const idrxTokenAddress = process.env.NEXT_PUBLIC_IDRX_TOKEN_ADDRESS!;
    
    const tokenContract = new ethers.Contract(
      idrxTokenAddress, 
      [
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function allowance(address owner, address spender) external view returns (uint256)",
        "function decimals() external view returns (uint8)",
        "function balanceOf(address owner) external view returns (uint256)"
      ], 
      signer
    );

    const amountInUnits = await this.parseIDRX(amount);

    // Check IDRX balance
    const balance = await tokenContract.balanceOf(userAddress);
    const balanceFormatted = await this.formatIDRX(balance);
    
    if (parseFloat(balanceFormatted) < parseFloat(amount)) {
      throw new Error(`Insufficient IDRX balance. You have ${balanceFormatted} IDRX, need ${amount} IDRX`);
    }

    // Check gas balance
    const gasBalance = await this.checkGasBalance(userAddress);
    if (parseFloat(gasBalance) < 0.00001) {
      throw new Error(`Insufficient LSK for gas. You need at least 0.00001 LSK for transaction fees`);
    }

    try {
      const currentAllowance = await tokenContract.allowance(userAddress, campaignAddress);
      
      if (currentAllowance >= amountInUnits) {
        console.log('Sufficient allowance already exists, skipping approve');
      } else {
        // Reset allowance if exists
        if (currentAllowance > 0) {
          console.log('Resetting existing allowance to 0');
          const resetTx = await tokenContract.approve(campaignAddress, 0);
          await resetTx.wait();
        }

        // Approve tokens
        console.log('Approving tokens...');
        const approveTx = await tokenContract.approve(campaignAddress, amountInUnits);
        await approveTx.wait();
        console.log('Tokens approved successfully');
      }

      // Execute donation
      const campaign = new ethers.Contract(campaignAddress, CampaignABI.abi, signer);
      const donateTx = await campaign.donate(amountInUnits);
      const receipt = await donateTx.wait();

      return receipt.hash;
    } catch (error: unknown) {
      console.error('Detailed error:', error);
      
      const err = error as { code?: string; reason?: string; message?: string };
      
      if (err.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient funds for gas fees. Please add more LSK to your wallet.');
      } else if (err.reason) {
        throw new Error(`Transaction failed: ${err.reason}`);
      } else {
        throw new Error(`Transaction failed: ${err.message || 'Unknown error'}`);
      }
    }
  }

  async withdrawFromCampaign(campaignAddress: string): Promise<string> {
    const signer = await this.getSigner();
    const campaign = new ethers.Contract(campaignAddress, CampaignABI.abi, signer);
    const tx = await campaign.withdraw();
    const receipt = await tx.wait();
    return receipt.hash;
  }

  async refundFromCampaign(campaignAddress: string): Promise<string> {
    const signer = await this.getSigner();
    const campaign = new ethers.Contract(campaignAddress, CampaignABI.abi, signer);
    const tx = await campaign.refund();
    const receipt = await tx.wait();
    return receipt.hash;
  }

  async getUserDonation(campaignAddress: string, userAddress: string): Promise<string> {
    const campaign = new ethers.Contract(campaignAddress, CampaignABI.abi, this.rpcProvider);
    const donation = await campaign.donations(userAddress);
    return await this.formatIDRX(donation);
  }

  async checkTokenBalance(walletAddress: string): Promise<string> {
    const tokenContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_IDRX_TOKEN_ADDRESS!,
      ["function balanceOf(address owner) external view returns (uint256)"],
      this.rpcProvider
    );
    
    const balance = await tokenContract.balanceOf(walletAddress);
    return await this.formatIDRX(balance);
  }

  async checkGasBalance(walletAddress: string): Promise<string> {
    const balance = await this.rpcProvider.getBalance(walletAddress);
    return ethers.formatEther(balance);
  }

  async checkVerificationStatus(userAddress: string): Promise<boolean> {
    try {
      const sbtContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_VERIFUND_SBT_ADDRESS!,
        VerifundSBTABI.abi,
        this.rpcProvider
      );

      const isVerified = await sbtContract.isVerified(userAddress);
      return isVerified;
    } catch (error) {
      console.error('Error checking verification status:', error);
      return false;
    }
  }

  async getBadgeInfo(userAddress: string): Promise<{
    hasWhitelistPermission: boolean;
    isCurrentlyVerified: boolean;
    tokenId: string;
    metadataURI: string;
  }> {
    try {
      const sbtContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_VERIFUND_SBT_ADDRESS!,
        VerifundSBTABI.abi,
        this.rpcProvider
      );

      const badgeInfo = await sbtContract.getBadgeInfo(userAddress);
      
      return {
        hasWhitelistPermission: badgeInfo[0],
        isCurrentlyVerified: badgeInfo[1],
        tokenId: badgeInfo[2].toString(),
        metadataURI: badgeInfo[3]
      };
    } catch (error) {
      console.error('Error getting badge info:', error);
      return {
        hasWhitelistPermission: false,
        isCurrentlyVerified: false,
        tokenId: '0',
        metadataURI: ''
      };
    }
  }

  // Utility function untuk check apakah wallet terhubung
  isWalletConnected(): boolean {
    const account = getAccount(config);
    return account.isConnected;
  }

  // Utility function untuk mendapatkan address saat ini
  getCurrentAddress(): string | undefined {
    const account = getAccount(config);
    return account.address;
  }
}

export const web3Service = new Web3Service();