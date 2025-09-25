"use client";
import React, { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { orderColumns } from "./orderColumns";
import { OrderSubRow } from "./OrderSubRow";

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
type TableMeta = {
  flex?: number;
};

// 대용량 샘플 데이터 생성
const generateSampleData = (count: number): Order[] => {
  const data: Order[] = [];
  const statuses = ["READY", "COMPLETED", "PROCESSING", "CANCELLED"];
  const orderTypes = ["STORE", "TAKEOUT"];
  const storeNames = ["삼남매 카페", "스타벅스", "이디야", "커피빈"];
  const menuNames = [
    "아메리카노",
    "라떼",
    "카푸치노",
    "에스프레소",
    "프라푸치노",
  ];

  for (let i = 0; i < count; i++) {
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const items: OrderItem[] = [];

    for (let j = 0; j < itemCount; j++) {
      const basePrice = Math.floor(Math.random() * 3000) + 2000;
      const quantity = Math.floor(Math.random() * 5) + 1;
      items.push({
        menuId: j + 1,
        menuName: menuNames[j % menuNames.length],
        basePrice,
        quantity,
        totalPrice: basePrice * quantity,
      });
    }

    data.push({
      orderId: `order_${i + 1}`,
      orderNumber: `20250924-${String(i + 1).padStart(8, "0")}`,
      storeName: storeNames[i % storeNames.length],
      orderType: orderTypes[i % orderTypes.length],
      status: statuses[i % statuses.length],
      totalAmount: items.reduce((sum, item) => sum + item.totalPrice, 0),
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      createdAt: `2025-09-${String(24 - Math.floor(i / 100)).padStart(
        2,
        "0"
      )} ${String(14 - (Math.floor(i / 50) % 10)).padStart(2, "0")}:${String(
        Math.floor(Math.random() * 60)
      ).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(
        2,
        "0"
      )}`,
      items,
    });
  }
  return data;
};

const RecentTable: React.FC = () => {
  const data = useMemo(() => generateSampleData(5000), []);

  const columnHelper = createColumnHelper<Order>();

  const table = useReactTable({
    data,
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
    estimateSize: () => 60,
    overscan: 10,
  });

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">최근 주문 내역</h2>
        <p className="text-sm text-gray-600">
          총 {data.length.toLocaleString()}개의 주문 (가상화 + 확장 가능)
        </p>
      </div>

      <div
        ref={parentRef}
        className="h-[600px] overflow-auto border border-gray-200 rounded-lg"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
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

          {/* 가상화된 행 */}
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            const isSubRow = row.depth > 0;

            return (
              <div key={row.id}>
                <div
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
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500 flex gap-4">
        <span>표시 중: {virtualizer.getVirtualItems().length}행</span>
        <span>
          스크롤 범위: {virtualizer.getVirtualItems()[0]?.index || 0} ~{" "}
          {virtualizer.getVirtualItems()[
            virtualizer.getVirtualItems().length - 1
          ]?.index || 0}
        </span>
      </div>
    </div>
  );
};

export default RecentTable;
