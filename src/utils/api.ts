import axios from "axios";

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

export const getProjects = async (
  params: GetProjectsParams
): Promise<GetProjectsResponse> => {
  const response = await apiClient.get<GetProjectsResponse>("/projects", {
    params,
  });
  return response.data;
};
