import { categoryAPI } from "@/lib/api/category";
import { menuAPI } from "@/lib/api/menu";
import { optionAPI } from "@/lib/api/option";
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
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      const menuData = query.data.data.menusByCategory || [];
      setMenus(menuData);
    } else if (!choosedShop) {
      clearMenuData();
    }
  }, [query.data, query.isSuccess, choosedShop, setMenus, clearMenuData]);

  return query;
};

//옵션 조회 훅
export const useOptionQuery = () => {
  const { choosedShop } = useShopStore();
  const { setOptionCategories, clearMenuData } = useMenuStore();

  const query = useQuery({
    queryKey: ["option", choosedShop?.storeId],
    queryFn: () => optionAPI.getAllOptions(choosedShop!.storeId),
    enabled: !!choosedShop?.storeId,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      const optionData = query.data.data || [];

      setOptionCategories(optionData);
    } else if (!choosedShop) {
      clearMenuData();
    }
  }, [
    query.data,
    query.isSuccess,
    choosedShop,
    setOptionCategories,
    clearMenuData,
  ]);

  return query;
};

// 통합 훅
export const useMenuAndCategory = () => {
  const menuQuery = useMenuQuery();
  const categoryQuery = useCategoryQuery();
  const optionQuery = useOptionQuery();
  return {
    //로딩
    menuLoading: menuQuery.isLoading,
    categoryLoading: categoryQuery.isLoading,
    optionLoading: optionQuery.isLoading,
    //에러
    menuError: menuQuery.error,
    categoryError: categoryQuery.error,
    optionError: optionQuery.error,
    isLoading: menuQuery.isLoading || categoryQuery.isLoading,
    isError: menuQuery.isError || categoryQuery.isError,

    refetchMenus: menuQuery.refetch,
    refetchCategories: categoryQuery.refetch,
    refetchOptions: optionQuery.refetch,
    refetchAll: () => {
      menuQuery.refetch();
      categoryQuery.refetch();
      optionQuery.refetch();
    },
  };
};
