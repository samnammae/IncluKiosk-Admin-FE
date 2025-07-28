import React from "react";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { IconProps } from "./type";

const BackIcon: React.FC<IconProps> = ({
  onClick = () => window.history.back(),
  size = 28,
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg hover:bg-gray-100 hover:text-brand-main transition-all duration-200 text-gray-600 `}
    >
      <ArrowBackIosNewRoundedIcon sx={{ fontSize: size }} />
    </button>
  );
};

export default BackIcon;
