import { NextRequest, NextResponse } from 'next/server';
import { idrxService } from '@/lib/idrx-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const transactionType = searchParams.get('transactionType') as 'MINT' | 'BURN' | 'BRIDGE' | 'DEPOSIT_REDEEM';
    const page = parseInt(searchParams.get('page') || '1');
    const take = parseInt(searchParams.get('take') || '10');
    const campaignAddress = searchParams.get('campaignAddress');
    const reference = searchParams.get('reference');

    if (!transactionType) {
      return NextResponse.json(
        { error: 'transactionType is required' },
        { status: 400 }
      );
    }

    let result;

    if (reference) {
      // Get specific transaction by reference
      result = await idrxService.getTransactionByReference(reference);
    } else if (campaignAddress) {
      // Get transactions for specific campaign
      result = await idrxService.getCampaignTransactions(campaignAddress, page, take);
    } else {
      // Get general transaction history
      result = await idrxService.getTransactionHistory({
        transactionType,
        page,
        take,
        orderByDate: 'DESC',
      });
    }

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Transaction History API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction history' },
      { status: 500 }
    );
  }
}