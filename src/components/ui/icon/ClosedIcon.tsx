import React from "react";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { IconProps } from "./type";

const ClosedIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <div
      className={`p-2 rounded-lg hover:bg-gray-100 hover:text-brand-main transition-all duration-200 text-gray-600 `}
    >
      <ClearRoundedIcon sx={{ fontSize: size }} />
    </div>
  );
};

export default ClosedIcon;
