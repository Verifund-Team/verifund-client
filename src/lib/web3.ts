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

  private async getSigner(): Promise<ethers.Signer> {
    const walletClient = await getWalletClient(config);
    if (!walletClient) {
      throw new Error('Wallet not connected');
    }
    return walletClientToSigner(walletClient);
  }

  private async getConnectedAddress(): Promise<string> {
    const account = getAccount(config);
    if (!account.address) {
      throw new Error('Wallet not connected');
    }
    return account.address;
  }

  private async formatIDRX(amount: bigint): Promise<string> {
    const tokenContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_IDRX_TOKEN_ADDRESS!,
      ["function decimals() external view returns (uint8)"],
      this.rpcProvider
    );
    const decimals = await tokenContract.decimals();
    return ethers.formatUnits(amount, decimals);
  }

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
    durationInSeconds: number,
    ipfsHash: string
  ): Promise<string> {
    const signer = await this.getSigner();
    const factoryAddress = process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS!;
    const factory = new ethers.Contract(factoryAddress, CampaignFactoryABI.abi, signer);

    const targetAmountInUnits = await this.parseIDRX(targetAmount);
    
    const tx = await factory.createCampaign(name, targetAmountInUnits, durationInSeconds, ipfsHash);
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
    const [info, isWithdrawn] = await Promise.all([
      campaign.getCampaignInfo(),
      campaign.isWithdrawn()
    ]);

    const isOwnerVerified = await this.checkVerificationStatus(info[0]);
    
    const timeRemaining = Number(info[4]);
    const raised = await this.formatIDRX(info[3]);
    const target = await this.formatIDRX(info[2]);
    
    let correctedStatus = Number(info[5]);
    
    if (timeRemaining === 0) {
      if (parseFloat(raised) >= parseFloat(target) || isWithdrawn) {
        correctedStatus = 1;
      } else {
        correctedStatus = 2;
      }
    }

    return {
      owner: info[0],
      name: info[1],
      target,
      raised,
      timeRemaining,
      status: correctedStatus,
      isOwnerVerified
    };
  }

  async getCampaignDetails(campaignAddress: string) {
    const campaign = new ethers.Contract(campaignAddress, CampaignABI.abi, this.rpcProvider);
    
    const [info, ipfsHash, isWithdrawn] = await Promise.all([
      campaign.getCampaignInfo(),
      campaign.ipfsHash(),
      campaign.isWithdrawn()
    ]);

    const isOwnerVerified = await this.checkVerificationStatus(info[0]);
    
    const timeRemaining = Number(info[5]);
    const raised = await this.formatIDRX(info[3]);
    const target = await this.formatIDRX(info[2]);
    const actualBalance = await this.formatIDRX(info[4]);
    
    let correctedStatus = Number(info[6]);
    
    if (timeRemaining === 0) {
      if (parseFloat(raised) >= parseFloat(target) || isWithdrawn) {
        correctedStatus = 1;
      } else {
        correctedStatus = 2;
      }
    }

    return {
      address: campaignAddress,
      owner: info[0],
      name: info[1],
      target,
      raised,
      actualBalance,
      timeRemaining,
      status: correctedStatus,
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

    const balance = await tokenContract.balanceOf(userAddress);
    const balanceFormatted = await this.formatIDRX(balance);
    
    if (parseFloat(balanceFormatted) < parseFloat(amount)) {
      throw new Error(`Insufficient IDRX balance. You have ${balanceFormatted} IDRX, need ${amount} IDRX`);
    }

    const gasBalance = await this.checkGasBalance(userAddress);
    if (parseFloat(gasBalance) < 0.00001) {
      throw new Error(`Insufficient LSK for gas. You need at least 0.00001 LSK for transaction fees`);
    }

    try {
      const currentAllowance = await tokenContract.allowance(userAddress, campaignAddress);
      
      if (currentAllowance >= amountInUnits) {
        console.log('Sufficient allowance already exists, skipping approve');
      } else {
        if (currentAllowance > 0) {
          console.log('Resetting existing allowance to 0');
          const resetTx = await tokenContract.approve(campaignAddress, 0);
          await resetTx.wait();
        }

        console.log('Approving tokens...');
        const approveTx = await tokenContract.approve(campaignAddress, amountInUnits);
        await approveTx.wait();
        console.log('Tokens approved successfully');
      }

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

  async getDirectTransfers(campaignAddress: string, userAddress: string): Promise<string> {
    try {
      const idrxTokenAddress = process.env.NEXT_PUBLIC_IDRX_TOKEN_ADDRESS!;
      const tokenContract = new ethers.Contract(
        idrxTokenAddress,
        [
          "event Transfer(address indexed from, address indexed to, uint256 value)"
        ],
        this.rpcProvider
      );

      const filter = tokenContract.filters.Transfer(userAddress, campaignAddress);
      
      const currentBlock = await this.rpcProvider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 10000);
      
      const events = await tokenContract.queryFilter(filter, fromBlock, currentBlock);
      
      let totalDirectTransfers = ethers.getBigInt(0);
      for (const event of events) {
        if ('args' in event && event.args) {
          totalDirectTransfers += event.args.value;
        }
      }
      
      return await this.formatIDRX(totalDirectTransfers);
    } catch (error) {
      console.error('Error getting direct transfers:', error);
      return '0';
    }
  }

  async getTotalUserDonation(campaignAddress: string, userAddress: string): Promise<{
    fromDonateFunction: string;
    fromDirectTransfer: string;
    total: string;
  }> {
    try {
      const [donateAmount, directTransfer] = await Promise.all([
        this.getUserDonation(campaignAddress, userAddress),
        this.getDirectTransfers(campaignAddress, userAddress)
      ]);

      const total = (
        parseFloat(donateAmount) + parseFloat(directTransfer)
      ).toFixed(6);

      return {
        fromDonateFunction: donateAmount,
        fromDirectTransfer: directTransfer,
        total: total
      };
    } catch (error) {
      console.error('Error getting total user donation:', error);
      return {
        fromDonateFunction: '0',
        fromDirectTransfer: '0',
        total: '0'
      };
    }
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

  isWalletConnected(): boolean {
    const account = getAccount(config);
    return account.isConnected;
  }

  getCurrentAddress(): string | undefined {
    const account = getAccount(config);
    return account.address;
  }
  async syncIDRXDonations(campaignAddress: string): Promise<string> {
    try {
      const signer = await this.getSigner();
      const campaignContract = new ethers.Contract(campaignAddress, CampaignABI.abi, signer);
      
      const tx = await campaignContract.syncIDRXDonations();
      await tx.wait();
      
      return tx.hash;
    } catch (error) {
      console.error('Error syncing IDRX donations:', error);
      throw error;
    }
  }
}

export const web3Service = new Web3Service();