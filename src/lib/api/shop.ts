import api from "./api";

export const shopAPI = {
  getAllShop: async () => {
    const response = await api.get("/admin/store");
    console.log("매장 전체 조회", response.data);
    return response.data;
  },
  addShop: async (formData: FormData) => {
    const response = await api.post("/admin/store", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("매장 추가", response.data);
    return response.data;
  },
  getShopById: async (shopId: string) => {
    const response = await api.get(`/admin/store/${shopId}`);
    console.log("매장 개별 조회", response.data);
    return response.data;
  },
  updateShop: async (shopId: string, formData: FormData) => {
    const response = await api.put(`/admin/store/${shopId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("매장 추가", response.data);
    return response.data;
  },
  deleteShop: async (shopId: string) => {
    const response = await api.delete(`/admin/store/${shopId}`);
    console.log("매장 삭제", response.data);
    return response.data;
  },
};
