import BoltIcon from "@mui/icons-material/Bolt";
import { Box, styled, Tooltip, TooltipProps } from "@mui/material";
import Switch from "@mui/material/Switch";
import { tooltipClasses } from "@mui/material/Tooltip";

type CustomSwitchProps = {
  isOn?: boolean;
  handleToggle: (isOn: boolean) => void;
  tooltipLabel?: string;
};

const CustomSwitch: React.FC<CustomSwitchProps> = (props) => {
  const { isOn = false, handleToggle, tooltipLabel = "Toggle me!" } = props;

  return (
    <Box display="flex" gap={2} alignItems="center" justifyContent="center">
      <LightTooltip title={tooltipLabel} arrow placement="left">
        <Box>
          <Switch
            size="medium"
            checkedIcon={<BoltIcon />}
            icon={<BoltIcon />}
            checked={isOn}
            onChange={(e) => handleToggle(e.target.checked)}
            inputProps={{ "aria-label": "use fast form" }}
            sx={{ height: 41 }}
          />
        </Box>
      </LightTooltip>
    </Box>
  );
};

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgb(168 162 158)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
    "&:before": {
      border: "1px solid #e0e0e0",
    },
  },
}));

export default CustomSwitch;
