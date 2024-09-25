import BoltIcon from "@mui/icons-material/Bolt";
import { Box } from "@mui/material";
import Switch from "@mui/material/Switch";
import React from "react";

type CustomSwitchProps = {
  isOn: boolean;
  handleToggle: (isOn: boolean) => void;
};

const CustomSwitch = React.forwardRef<HTMLDivElement, CustomSwitchProps>((props, ref) => {
  const { isOn, handleToggle, ...rest } = props;

  return (
    <Box
      ref={ref} // our <Tooltip> wrapper to work (must pass ref down)
      {...rest} // for <Tooltip> wrapper
    >
      <Switch
        size="medium"
        icon={<BoltIcon />}
        checkedIcon={<BoltIcon />}
        checked={isOn}
        onChange={(e) => handleToggle(e.target.checked)}
        sx={{ height: 41 }}
      />
    </Box>
  );
});

export default CustomSwitch;
