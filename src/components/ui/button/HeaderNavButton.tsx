import React from "react";

const HeaderNavButton = ({
  text,
  onClick = () => {},
}: {
  text: string;
  onClick?: () => void;
}) => {
  return (
    <button
      className="p-3 text-gray-500 font-medium cursor-pointer rounded-2xl hover:bg-gray-200 hover:text-gray-900 transition-all"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default HeaderNavButton;
