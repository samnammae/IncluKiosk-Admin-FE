import api from "./api";

export const menuAPI = {
  getAllMenu: async (shopId: number) => {
    const response = await api.get(`/menu/${shopId}`);
    console.log("메뉴 조회", response.data);
    return response.data;
  },
};
