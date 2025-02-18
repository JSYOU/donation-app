import axios from "axios";

export enum CampaignType {
  CHARITY = "CHARITY", // 公益團體
  PROJECT = "PROJECT", // 捐款專案
  PRODUCT = "PRODUCT", // 義賣商品
}

export interface GetCampaignsParams {
  page: number;
  limit: number;
  type?: CampaignType;
  category?: string;
  keyword?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  category: string | null;
  type: CampaignType;
  createdAt: Date;
  updatedAt: Date;
}

interface Meta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface GetCampaignsResponse {
  data: Campaign[];
  meta: Meta;
}

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  timeout: 10000,
});

export const getCampaigns = async (
  params: GetCampaignsParams
): Promise<GetCampaignsResponse> => {
  const response = await apiClient.get<GetCampaignsResponse>("/campaigns", {
    params,
  });
  return response.data;
};
