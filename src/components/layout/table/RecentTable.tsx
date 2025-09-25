"use client";
import React, { useEffect, useMemo, useRef } from "react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { orderColumns } from "./orderColumns";
import { OrderSubRow } from "./OrderSubRow";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useShopStore } from "@/lib/store/shopStore";
import { dashboardAPI } from "@/lib/api/dashboard";

// 타입 정의
type OrderItem = {
  menuId: number;
  menuName: string;
  basePrice: number;
  quantity: number;
  totalPrice: number;
};

export type Order = {
  orderId: string;
  orderNumber: string;
  storeName: string;
  orderType: string;
  status: string;
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  items: OrderItem[];
};

const RecentTable: React.FC = () => {
  const { choosedShop } = useShopStore();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["recentOrders", choosedShop],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await dashboardAPI.getRecent(
          choosedShop!.storeId,
          pageParam,
          2
        );
        return res.data;
      },
      getNextPageParam: (lastPage) => {
        const { page, size, total } = lastPage;
        const maxPage = Math.ceil(total / size);
        return page < maxPage ? page + 1 : undefined;
      },
      initialPageParam: 1,
      enabled: !!choosedShop,
    });

  const orders = useMemo(() => {
    return data?.pages.flatMap((page) => page.orders) ?? [];
  }, [data]);

  const table = useReactTable({
    data: orders,
    columns: orderColumns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  });

  const { rows } = table.getRowModel();
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 10,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },

      { root: parentRef.current, threshold: 0, rootMargin: "100px" }
    );

    observer.observe(bottomRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {/* 총 {data.length.toLocaleString()}개의 주문 (가상화 + 확장 가능) */}
        </p>
      </div>

      <div
        ref={parentRef}
        className="h-[600px] overflow-auto border border-gray-200 rounded-lg "
      >
        {/* 헤더 */}
        <div
          className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200"
          style={{ display: "flex", width: "100%" }}
        >
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => (
              <div
                key={header.id}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0 flex items-center"
                style={{
                  flex: header.column.columnDef.meta?.flex ?? 1,
                  minWidth: 0,
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </div>
            ))
          )}
        </div>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {/* 가상화된 행 */}
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            const isSubRow = row.depth > 0;

            return (
              <div key={row.id}>
                <div
                  ref={virtualizer.measureElement}
                  className="absolute w-full hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    display: "flex",
                  }}
                  onClick={
                    !isSubRow ? row.getToggleExpandedHandler() : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <div
                      key={cell.id}
                      className="px-4 py-4 text-sm text-gray-700 border-r border-gray-100 last:border-r-0 flex items-center"
                      style={{
                        flex: cell.column.columnDef.meta?.flex ?? 1,
                        minWidth: 0,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  ))}
                </div>

                {row.getIsExpanded() && (
                  <div
                    className="absolute w-full"
                    style={{
                      transform: `translateY(${
                        virtualRow.start + virtualRow.size
                      }px)`,
                      zIndex: 1,
                    }}
                  >
                    <OrderSubRow row={row} />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>
    </div>
  );
};

export default RecentTable;
