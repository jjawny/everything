import BoltIcon from "@mui/icons-material/Bolt";
import { Box, styled, Tooltip, TooltipProps } from "@mui/material";
import Switch from "@mui/material/Switch";
import { tooltipClasses } from "@mui/material/Tooltip";

type FastFormSwitchProps = {
  onToggleCallback: (isOn: boolean) => void;
};

const FastFormSwitch: React.FC<FastFormSwitchProps> = (props) => {
  const { onToggleCallback } = props;

  return (
    <Box display="flex" gap={2} alignItems="center" justifyContent="end">
      {/* <Typography>use fast form...</Typography> */}
      <LightTooltip title="Fix me... PLEASE" arrow placement="left" open>
        <Box>
          <Switch
            size="medium"
            checkedIcon={<BoltIcon />}
            icon={<BoltIcon />}
            onChange={(e) => onToggleCallback(e.target.checked)}
            inputProps={{ "aria-label": "use fast form" }}
            sx={{
              height: 41, // Adjust the height value as needed
            }}
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

export default FastFormSwitch;
