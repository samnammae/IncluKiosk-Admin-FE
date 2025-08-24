import { OptionGroupFormData } from "@/components/layout/modal/OptionFormModal";
import api from "./api";

export const optionAPI = {
  getAllOptions: async (storeId: number) => {
    const response = await api.get(`/menu/${storeId}/option`);
    console.log("옵션 전체 조회", response.data);
    return response.data;
  },
  addOptions: async (storeId: number, data: OptionGroupFormData) => {
    const response = await api.post(`menu/${storeId}/option`, data);
    console.log("옵션 생성", response.data);
    return response.data;
  },
  deleteOptionCategory: async (storeId: number, optionCategoryId: number) => {
    const response = await api.delete(
      `/menu/${storeId}/option/${optionCategoryId}`
    );
    console.log("옵션 카테고리 삭제", response.data);
    return response;
  },
  deleteOption: async (
    storeId: number,
    optionCategoryId: number,
    optionId: number
  ) => {
    const response = await api.delete(
      `/menu/${storeId}/option/${optionCategoryId}/${optionId}`
    );
    console.log("옵션 카테고리 삭제", response.data);
    return response;
  },
};
