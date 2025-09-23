import axios from "axios";
import api from "./api";

const nextApi = axios.create({
  baseURL: `/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

nextApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dashboardAPI = {
  getCategory: async (storeId: number, type: "amount" | "items") => {
    const response = await nextApi.get(`/dashboard/category`, {
      params: { storeId, type },
    });
    console.log("카테고리 별 조회", response);
    return response.data;
  },

  getHourly: async (storeId: number) => {
    const response = await nextApi.get(`/dashboard/hourly`, {
      params: { storeId },
    });
    console.log("시간대별 조회", response);
    return response.data;
  },

  getPeriod: async (
    storeId: number,
    options?: {
      unit?: "daily" | "weekly" | "monthly";
      limit?: number;
      startDate?: string; // "YYYY-MM-DD"
      endDate?: string; // "YYYY-MM-DD"
    }
  ) => {
    const { unit = "daily", limit, startDate, endDate } = options || {};

    const response = await nextApi.get(`/dashboard/period`, {
      params: {
        storeId,
        unit,
        ...(limit ? { limit } : {}),
        ...(startDate && endDate ? { startDate, endDate } : {}),
      },
    });

    console.log("기간별 조회", response);
    return response.data;
  },

  getRecent: async (storeId: number, page = 0, size = 20) => {
    const response = await nextApi.get(`/dashboard/recent`, {
      params: { storeId, page, size },
    });
    console.log("최근 주문 조회", response);
    return response.data;
  },
};
