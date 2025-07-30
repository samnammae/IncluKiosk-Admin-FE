import React from "react";
import SearchIcon from "../icon/SearchIcon";
interface SearchBarProps {
  searchQuery: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  count: number;
}
const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onChange,
  count,
  placeholder,
}) => {
  return (
    <>
      {/* 검색창 */}
      <div className="relative flex-1 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder={placeholder || ""}
          value={searchQuery}
          onChange={onChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {/* 검색 결과 개수 */}
      {searchQuery && (
        <div className="pt-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">"{searchQuery}"</span>에 대한 검색
            결과:
            <span className="font-medium text-blue-600 ml-1">{count}개</span>
          </p>
        </div>
      )}
    </>
  );
};

export default SearchBar;
