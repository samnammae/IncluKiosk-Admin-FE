import React from "react";
import { ButtonProps } from "./type";

const CancelButton: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export default CancelButton;
