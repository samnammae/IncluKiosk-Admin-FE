"use client";
import MenuCard from "@/components/ui/card/MenuCard";
import React from "react";
import EmptyMenu from "./EmptyMenu";
import { MenuItem } from "@/lib/store/MenuStore";

interface MenuCardGridProps {
  data: MenuItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleSoldOut?: (id: string) => void;
}

const MenuCardGrid: React.FC<MenuCardGridProps> = ({
  data,
  onEdit,
  onDelete,
  onToggleSoldOut,
}) => {
  if (data.length === 0) {
    return <EmptyMenu />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
      {data.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleSoldOut={onToggleSoldOut}
        />
      ))}
    </div>
  );
};

export default MenuCardGrid;
