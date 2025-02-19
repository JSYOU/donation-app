import axios from "axios";

const BASE_URL = `${
  process.env.NEXT_PUBLIC_API_BASEURL || "http://localhost:8080"
}/api/v1`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export enum Status {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  COMPLETED = "COMPLETED",
}

export interface GetCampaignsParams {
  page: number;
  limit: number;
  type?: string;
  category?: string;
  keyword?: string;
  status?: Status;
}

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  category: string[];
  type: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetProjectsParams {
  page: number;
  limit: number;
  category?: string;
  keyword?: string;
  status?: Status;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  bannerUrl: string | null;
  category: string[];
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface GetCampaignsResponse {
  data: Campaign[];
  meta: Meta;
}

export interface GetProjectsResponse {
  data: Project[];
  meta: Meta;
}

export interface ProductVariant {
  price: number;
}

export interface Product {
  id: string;
  name: string;
  brandName: string;
  description: string;
  imageUrl: string;
  category: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
  priceMin: number;
  priceMax: number;
}

export interface GetProductsResponse {
  data: Product[];
  meta: Meta;
}

export interface GetProductsParams {
  page: number;
  limit: number;
  category?: string;
  keyword?: string;
  status?: string;
}

export const getCampaigns = async (
  params: GetCampaignsParams
): Promise<GetCampaignsResponse> => {
  const response = await apiClient.get<GetCampaignsResponse>("/campaigns", {
    params,
  });
  return response.data;
};

export const getProjects = async (
  params: GetProjectsParams
): Promise<GetProjectsResponse> => {
  const response = await apiClient.get<GetProjectsResponse>("/projects", {
    params,
  });
  return response.data;
};

export const getProducts = async (
  params: GetProductsParams
): Promise<GetProductsResponse> => {
  const response = await apiClient.get<GetProductsResponse>("/products", {
    params,
  });
  return response.data;
};
