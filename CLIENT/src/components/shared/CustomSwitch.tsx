import { Box } from "@mui/material";
import Switch from "@mui/material/Switch";
import React from "react";

type CustomSwitchProps = {
  isOn: boolean;
  handleToggle: (isOn: boolean) => void;
  customIcon?: React.ReactNode;
};

const CustomSwitch = React.forwardRef<HTMLDivElement, CustomSwitchProps>((props, ref) => {
  const { isOn, handleToggle, customIcon, ...rest } = props;

  return (
    <Box
      ref={ref} // our <Tooltip> wrapper to work (must pass ref down)
      {...rest} // for <Tooltip> wrapper
    >
      <Switch
        size="medium"
        {...(customIcon && { icon: customIcon, checkedIcon: customIcon })}
        checked={isOn}
        onChange={(e) => handleToggle(e.target.checked)}
      />
    </Box>
  );
});

CustomSwitch.displayName = "CustomSwitch";

export default CustomSwitch;
