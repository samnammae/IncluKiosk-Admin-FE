import ViewHeadlineRoundedIcon from "@mui/icons-material/ViewHeadlineRounded";
import { IconProps } from "./type";

const ViewListIcon: React.FC<IconProps> = ({ size = 24 }) => {
  return <ViewHeadlineRoundedIcon sx={{ fontSize: size }} />;
};
export default ViewListIcon;
