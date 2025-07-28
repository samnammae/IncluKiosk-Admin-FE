import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { IconProps } from "./type";

const SearchIcon: React.FC<IconProps> = ({ size = 24 }) => {
  return <SearchRoundedIcon sx={{ fontSize: size }} />;
};
export default SearchIcon;
