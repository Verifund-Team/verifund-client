import { createSignature, generateTimestamp } from './idrx-signature';

interface MintRequestPayload extends Record<string, unknown> {
  toBeMinted: string;
  destinationWalletAddress: string;
  expiryPeriod: number;
  networkChainId: string;
  requestType: string;
}

interface MintRequestResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    merchantCode: string;
    reference: string;
    paymentUrl: string;
    amount: string;
    statusCode: string;
    statusMessage: string;
    merchantOrderId: string;
  };
}

interface TransactionHistoryParams {
  transactionType: 'MINT' | 'BURN' | 'BRIDGE' | 'DEPOSIT_REDEEM';
  page: number;
  take: number;
  userMintStatus?: 'NOT_AVAILABLE' | 'PROCESSING' | 'MINTED' | 'FAILED' | 'REJECTED' | 'REFUND';
  paymentStatus?: 'PAID' | 'WAITING_FOR_PAYMENT' | 'EXPIRED';
  merchantOrderId?: string;
  reference?: string;
  txHash?: string;
  orderByDate?: 'ASC' | 'DESC';
}

interface TransactionRecord {
  id: number;
  paymentAmount: number;
  merchantOrderId: string;
  productDetails: string;
  customerVaName: string;
  email: string;
  chainId: number;
  destinationWalletAddress: string;
  toBeMinted: string;
  createdAt: string;
  updatedAt: string;
  paymentStatus: string;
  expiryTimestamp: string;
  reference: string;
  txHash: string;
  adminMintStatus: string;
  userMintStatus: string;
  reportStatus: string;
  requestType: string;
  userId: number;
  refundStatus: string | null;
}

interface TransactionHistoryResponse {
  statusCode: number;
  message: string;
  metadata: {
    page: number | null;
    perPage: number | null;
    pageCount: number | null;
    totalCount: number;
  };
  records: TransactionRecord[];
}

export class IDRXService {
  private apiKey: string;
  private secretKey: string;
  private baseUrl: string;
  private networkChainId: string;

  constructor() {
    this.apiKey = process.env.IDRX_API_KEY!;
    this.secretKey = process.env.IDRX_SECRET_KEY!;
    this.baseUrl = process.env.IDRX_BASE_URL!;
    this.networkChainId = process.env.IDRX_NETWORK_CHAIN_ID!;
  }

  async createMintRequest(
    amount: string,
    destinationWalletAddress: string,
    expiryPeriodHours: number = 24
  ): Promise<MintRequestResponse> {
    const method = 'POST';
    const url = '/transaction/mint-request';
    const timestamp = generateTimestamp();

    const payload: MintRequestPayload = {
      toBeMinted: amount,
      destinationWalletAddress,
      expiryPeriod: expiryPeriodHours,
      networkChainId: this.networkChainId,
      requestType: 'donation' // atau sesuai kebutuhan
    };

    const signature = createSignature(
      method,
      url,
      payload,
      timestamp,
      this.secretKey
    );

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'idrx-api-key': this.apiKey,
        'idrx-api-sig': signature,
        'idrx-api-ts': timestamp,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`IDRX API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async checkPaymentStatus(reference: string): Promise<TransactionRecord | null> {
    const method = 'GET';
    const url = `/transaction/status/${reference}`;
    const timestamp = generateTimestamp();

    const signature = createSignature(
      method,
      url,
      null,
      timestamp,
      this.secretKey
    );

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'GET',
      headers: {
        'idrx-api-key': this.apiKey,
        'idrx-api-sig': signature,
        'idrx-api-ts': timestamp,
      },
    });

    if (!response.ok) {
      throw new Error(`IDRX API Error: ${response.status} ${response.statusText}`);
    }

    const result: TransactionRecord = await response.json(); // ✅ Proper typing
    return result;
  }
  async getTransactionHistory(params: TransactionHistoryParams): Promise<TransactionHistoryResponse> {
    const method = 'GET';
    const timestamp = generateTimestamp();
    
    // Build query parameters
    const queryParams = new URLSearchParams({
      transactionType: params.transactionType,
      page: params.page.toString(),
      take: params.take.toString(),
    });

    // Add optional parameters
    if (params.userMintStatus) queryParams.append('userMintStatus', params.userMintStatus);
    if (params.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
    if (params.merchantOrderId) queryParams.append('merchantOrderId', params.merchantOrderId);
    if (params.reference) queryParams.append('reference', params.reference);
    if (params.txHash) queryParams.append('txHash', params.txHash);
    if (params.orderByDate) queryParams.append('orderByDate', params.orderByDate);

    const url = `/transaction/user-transaction-history?${queryParams.toString()}`;

    const signature = createSignature(
      method,
      url,
      null, // GET request has no body
      timestamp,
      this.secretKey
    );

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'GET',
      headers: {
        'idrx-api-key': this.apiKey,
        'idrx-api-sig': signature,
        'idrx-api-ts': timestamp,
      },
    });

    if (!response.ok) {
      throw new Error(`IDRX API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async getTransactionByReference(reference: string): Promise<TransactionRecord | null> {
    try {
      const history = await this.getTransactionHistory({
        transactionType: 'MINT',
        page: 1,
        take: 1,
        reference,
      });

      return history.records.length > 0 ? history.records[0] : null;
    } catch (error) {
      console.error('Error getting transaction by reference:', error);
      return null;
    }
  }

  async getCampaignTransactions(campaignAddress: string, page: number = 1, take: number = 10): Promise<TransactionRecord[]> {
    try {
      const history = await this.getTransactionHistory({
        transactionType: 'MINT',
        page,
        take,
        orderByDate: 'DESC',
      });

      // Filter transactions by destination wallet address (campaign address)
      return history.records.filter(record => 
        record.destinationWalletAddress.toLowerCase() === campaignAddress.toLowerCase()
      );
    } catch (error) {
      console.error('Error getting campaign transactions:', error);
      return [];
    }
  }
}

export const idrxService = new IDRXService();