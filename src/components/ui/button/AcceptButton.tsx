import React from "react";
import { ButtonProps } from "./type";

const AcceptButton: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 bg-gradient-to-r from-brand-main to-brand-dark text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export default AcceptButton;
