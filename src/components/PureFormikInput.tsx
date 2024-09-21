import { Box, TextField, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { useMemo } from "react";

interface IPureFormikInputProps<T> {
  name: keyof T;
  label?: string;
  value?: string;
  manualErrorText?: string;
  isDisabled?: boolean;
  size?: "small" | "medium";
}

// A Formik textfield wrapper w feature-rich additions
const PureFormikInput = <T,>({
  name,
  label,
  value = "",
  manualErrorText,
  isDisabled = false,
  size = "small",
  ...props
}: IPureFormikInputProps<T>) => {
  const nameString = String(name);
  const [field, meta] = useField(nameString);
  const { initialValues } = useFormikContext<T>();
  const helperText = manualErrorText ?? (meta.error ? meta.error : size === "small" ? undefined : undefined);
  const isError = manualErrorText !== undefined || meta.error !== undefined;
  const isValueChanged = field.value !== initialValues[name];
  const overridenStyles = useMemo(
    () => ({
      "& .MuiInput-root": {
        color: isDisabled ? "grey" : "rgb(41 37 36)",
        ...(!isDisabled && isValueChanged && { backgroundColor: "#fff6e2" }),
        ...(size === "small" && {
          height: 10,
          color: "rgb(168 162 158)",
          fontSize: 8,
          "& .MuiInputBase-input": { padding: 0, height: "100%" },
        }),
      },
    }),
    [isDisabled, isValueChanged]
  );

  return (
    <Box>
      {label && <Typography variant="body1">{label}</Typography>}
      <Box display="flex" flexDirection="column" width="100%">
        <TextField
          {...field}
          {...props}
          size={size}
          value={value ? value : field.value ?? ""}
          sx={overridenStyles}
          helperText={helperText}
          disabled={isDisabled}
          name={nameString}
          error={isError}
          variant="standard"
          fullWidth
        />
      </Box>
    </Box>
  );
};

export default PureFormikInput;
