import api from "./api";

export const shopAPI = {
  getAllShop: async () => {
    const response = await api.get("/admin/store");
    console.log("매장 조회", response.data);
    return response.data;
  },
};
