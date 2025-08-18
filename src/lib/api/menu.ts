import api from "./api";

export const menuAPI = {
  getAllMenu: async (shopId: number) => {
    const response = await api.get(`/menu/${shopId}`);
    console.log("메뉴 조회", response.data);
    return response.data;
  },
  addMenu: async (shopId: number, fromData: FormData) => {
    const response = await api.post(`/menu/${shopId}`, fromData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("메뉴 생성", response.data);
    return response.data;
  },
  updateMenu: async (shopId: number, menuId: string, fromData: FormData) => {
    const response = await api.put(`/menu/${shopId}/${menuId}`, fromData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("메뉴 수정", response.data);
    return response.data;
  },
  deleteMenu: async (shopId: number, menuId: string) => {
    const response = await api.delete(`/menu/${shopId}/${menuId}`);
    console.log("메뉴 삭제", response.data);
    return response.data;
  },
};
