import React from "react";
interface TitleProps {
  title: string;
  subText: string;
}
const TitleHeader: React.FC<TitleProps> = ({ title, subText }) => {
  return (
    <div className="mb-8">
      <div className="flex gap-1 items-center mb-2">
        <h1 className="text-3xl font-semibold text-gray-800">{title}</h1>
      </div>
      <p className="text-gray-600 text-base">{subText}</p>
    </div>
  );
};

export default TitleHeader;
