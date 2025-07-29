import { create } from "zustand";

interface ShopType {
  storeId: number;
  name: string;
  phone: string;
  address: string;
  mainImg: string;
  createdAt: string;
  updatedAt: string;
}

interface ShopStore {
  totalCount: number;
  shops: ShopType[];
  choosedShop: ShopType | null;
  setShops: (shops: ShopType[], totalCount: number) => void;
  setChooseShop: (shop: ShopType | null) => void;
}

export const useShopStore = create<ShopStore>((set) => ({
  totalCount: 0,
  shops: [] as ShopType[],
  choosedShop: null as ShopType | null,

  setShops: (shops: ShopType[], totalCount: number) =>
    set({ shops, totalCount }),

  setChooseShop: (shop: ShopType | null) => set({ choosedShop: shop }),
}));
