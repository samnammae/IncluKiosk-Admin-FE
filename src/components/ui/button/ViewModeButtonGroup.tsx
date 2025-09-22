import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const ViewModeButtonGroup = ({
  viewType,
  handleChange,
}: {
  viewType: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <RadioGroup
      row
      value={viewType}
      onChange={handleChange}
      className="flex space-x-0"
    >
      <FormControlLabel
        value="amount"
        control={<Radio size="small" />}
        label="주문 금액"
      />
      <FormControlLabel
        value="count"
        control={<Radio size="small" />}
        label="주문 건수"
      />
    </RadioGroup>
  );
};
export default ViewModeButtonGroup;
