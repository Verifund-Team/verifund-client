import { CampaignMetadata } from "@/features/campaign/api/get-campaigns";
import axios from "axios";

export const uploadToIPFS = async (metadata: CampaignMetadata): Promise<string> => {
  try {
    const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT!}`,
      },
    });
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error("Failed to upload metadata to IPFS");
  }
};

export const uploadImageToIPFS = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT!}`,
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading image to IPFS:", error);
    throw new Error("Failed to upload image to IPFS");
  }
};

export const getMetadataFromIPFS = async (ipfsHash: string): Promise<CampaignMetadata> => {
  try {
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching metadata from IPFS:", error);
    throw new Error("Failed to fetch metadata from IPFS");
  }
};
