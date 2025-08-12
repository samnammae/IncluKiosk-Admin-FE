import api from "./api";

export const categoryAPI = {
  addCategory: async (shopId: number, data: addCategoryData) => {
    const response = await api.post(`/menu/${shopId}/category`, data);
    console.log("카테고리 추가", response.data);
    return response.data;
  },
  getAllCategory: async (shopId: number) => {
    const response = await api.get(`/menu/${shopId}/category`);
    console.log("카테고리 조회", response.data);
    return response.data;
  },
  updateCategory: async (shopId: number, data: updateCategoryData[]) => {
    const response = await api.patch(`/menu/${shopId}/category`, data);
    console.log("카테고리 수정", response.data);
    return response.data;
  },
  deleteCategory: async (shopId: number, categoryId: string) => {
    const response = await api.delete(`/menu/${shopId}/category/${categoryId}`);
    console.log("카테고리 삭제", response.data);
    return response.data;
  },
};

export interface addCategoryData {
  name: string;
  displayOrder: number;
}
export interface updateCategoryData {
  id: string;
  name: string;
  displayOrder: number;
}
