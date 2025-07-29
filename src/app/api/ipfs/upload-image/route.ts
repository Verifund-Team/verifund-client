import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const pinataFormData = new FormData();
    pinataFormData.append('file', file);

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      pinataFormData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PINATA_JWT!}`,
        },
      }
    );

    const imageUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    
    return NextResponse.json({ 
      success: true, 
      imageUrl,
      ipfsHash: response.data.IpfsHash 
    });

  } catch (error) {
    console.error('Error uploading image to IPFS:', error);
    return NextResponse.json(
      { error: 'Failed to upload image to IPFS' }, 
      { status: 500 }
    );
  }
}