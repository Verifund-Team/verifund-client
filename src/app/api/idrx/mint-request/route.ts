import { NextRequest, NextResponse } from "next/server";
import { idrxService } from "@/lib/idrx-service";

export async function POST(request: NextRequest) {
  try {
    const { amount, campaignAddress } = await request.json();

    if (!amount || !campaignAddress) {
      return NextResponse.json(
        { error: "Amount and campaign address are required" },
        { status: 400 },
      );
    }

    const mintResponse = await idrxService.createMintRequest(
      amount,
      campaignAddress,
      24, // 24 jam expiry
    );

    return NextResponse.json({
      success: true,
      paymentUrl: mintResponse.data.paymentUrl,
      reference: mintResponse.data.reference,
      amount: mintResponse.data.amount,
    });
  } catch (error) {
    console.error("IDRX Mint Request Error:", error);
    return NextResponse.json({ error: "Failed to create payment request" }, { status: 500 });
  }
}
