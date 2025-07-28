import React from "react";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { IconProps } from "./type";

const ClosedIcon: React.FC<IconProps> = ({
  onClick = () => window.history.back(),
  size = 20,
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg hover:bg-gray-100 hover:text-brand-main transition-all duration-200 text-gray-600 `}
    >
      <ClearRoundedIcon sx={{ fontSize: size }} />
    </button>
  );
};

export default ClosedIcon;
