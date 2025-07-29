import { CampaignMetadata } from "@/features/campaign/api/get-campaigns";
import axios from "axios";

export const uploadToIPFS = async (metadata: CampaignMetadata): Promise<string> => {
  try {
    const response = await fetch("/api/ipfs/upload-metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      throw new Error("Failed to upload metadata");
    }

    const result = await response.json();
    return result.ipfsHash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error("Failed to upload metadata to IPFS");
  }
};

export const uploadImageToIPFS = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/ipfs/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const result = await response.json();
    return result.imageUrl;
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
