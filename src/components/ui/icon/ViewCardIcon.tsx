import ViewCompactRoundedIcon from "@mui/icons-material/ViewCompactRounded";
import { IconProps } from "./type";

const ViewCardIcon: React.FC<IconProps> = ({ size = 24 }) => {
  return <ViewCompactRoundedIcon sx={{ fontSize: size }} />;
};
export default ViewCardIcon;
