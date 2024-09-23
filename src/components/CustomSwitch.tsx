import BoltIcon from "@mui/icons-material/Bolt";
import { Box } from "@mui/material";
import Switch from "@mui/material/Switch";
import CustomTooltip from "./CustomTooltip";

type CustomSwitchProps = {
  isOn: boolean;
  handleToggle: (isOn: boolean) => void;
  tooltipLabel?: string;
};

const CustomSwitch: React.FC<CustomSwitchProps> = (props) => {
  const { isOn, handleToggle, tooltipLabel = "Toggle me!" } = props;

  return (
    <Box display="flex" gap={2} alignItems="center" justifyContent="center">
      <CustomTooltip title={tooltipLabel} arrow placement="left">
        <Box>
          <Switch
            size="medium"
            icon={<BoltIcon />}
            checkedIcon={<BoltIcon />}
            checked={isOn}
            onChange={(e) => handleToggle(e.target.checked)}
            inputProps={{ "aria-label": tooltipLabel }}
            sx={{ height: 41 }}
          />
        </Box>
      </CustomTooltip>
    </Box>
  );
};

export default CustomSwitch;
