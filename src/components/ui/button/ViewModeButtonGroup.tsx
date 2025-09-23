import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const ViewModeButtonGroup = ({
  viewType,
  handleChange,
  isExtend,
}: {
  viewType: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isExtend?: boolean;
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
        label="매출액"
      />
      <FormControlLabel
        value="items"
        control={<Radio size="small" />}
        label="판매 수량"
      />
      {isExtend && (
        <FormControlLabel
          value="counts"
          control={<Radio size="small" />}
          label="주문건수"
        />
      )}
    </RadioGroup>
  );
};
export default ViewModeButtonGroup;
