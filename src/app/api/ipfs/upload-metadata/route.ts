import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const metadata = await request.json();
    
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PINATA_JWT!}`,
        },
      }
    );
    
    return NextResponse.json({ 
      success: true, 
      ipfsHash: response.data.IpfsHash 
    });

  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    return NextResponse.json(
      { error: 'Failed to upload metadata to IPFS' }, 
      { status: 500 }
    );
  }
}