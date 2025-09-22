import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FormControl } from "@mui/material";

interface ListButtonProps {
  val: string;
  options: string[];
  handleChange: (event: SelectChangeEvent) => void;
}
const ListButton: React.FC<ListButtonProps> = ({
  val,
  options,
  handleChange,
}) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
      <Select<string> value={val} onChange={handleChange} displayEmpty>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
export default ListButton;
