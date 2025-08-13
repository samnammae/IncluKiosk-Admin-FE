import { categoryAPI } from "@/lib/api/category";
import { menuAPI } from "@/lib/api/menu";
import { useMenuStore } from "@/lib/store/MenuStore";
import { useShopStore } from "@/lib/store/shopStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

// 카테고리 조회 + Zustand 동기화
export const useCategoryQuery = () => {
  const { choosedShop } = useShopStore();
  const { setCategories, clearMenuData } = useMenuStore();

  const query = useQuery({
    queryKey: ["category", choosedShop?.storeId],
    queryFn: () => categoryAPI.getAllCategory(choosedShop!.storeId),
    enabled: !!choosedShop?.storeId,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      const categoryData = query.data.data || [];
      setCategories(categoryData);
    } else if (!choosedShop) {
      clearMenuData();
    }
  }, [query.data, query.isSuccess, choosedShop, setCategories, clearMenuData]);

  return query;
};

// 메뉴 조회 + Zustand 동기화
export const useMenuQuery = () => {
  const { choosedShop } = useShopStore();
  const { setMenus, clearMenuData } = useMenuStore();

  const query = useQuery({
    queryKey: ["menu", choosedShop?.storeId],
    queryFn: () => menuAPI.getAllMenu(choosedShop!.storeId),
    enabled: !!choosedShop?.storeId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      const menuData = query.data.data || [];
      setMenus(menuData);
    } else if (!choosedShop) {
      clearMenuData();
    }
  }, [query.data, query.isSuccess, choosedShop, setMenus, clearMenuData]);

  return query;
};

// 통합 훅
export const useMenuAndCategory = () => {
  const menuQuery = useMenuQuery();
  const categoryQuery = useCategoryQuery();

  return {
    menuLoading: menuQuery.isLoading,
    categoryLoading: categoryQuery.isLoading,
    menuError: menuQuery.error,
    categoryError: categoryQuery.error,
    isLoading: menuQuery.isLoading || categoryQuery.isLoading,
    isError: menuQuery.isError || categoryQuery.isError,

    refetchMenus: menuQuery.refetch,
    refetchCategories: categoryQuery.refetch,
    refetchAll: () => {
      menuQuery.refetch();
      categoryQuery.refetch();
    },
  };
};
