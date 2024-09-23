import { styled, Tooltip, TooltipProps } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
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

export default CustomTooltip;
