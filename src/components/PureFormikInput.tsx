import { Box, TextField, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { useMemo } from "react";

interface IPureFormikInputProps<T> {
  name: keyof T;
  label?: string;
  value?: string;
  otherErrors?: string;
  isDisabled?: boolean;
  isShowHelperText?: boolean;
}

// A Formik textfield wrapper w feature-rich additions
const PureFormikInput = <T,>({
  name,
  label,
  value,
  otherErrors,
  isDisabled = false,
  isShowHelperText = true,
  ...props
}: IPureFormikInputProps<T>) => {
  const nameString = String(name);
  const [field, meta] = useField(nameString);
  const { initialValues } = useFormikContext<T>();

  const helperText = useMemo(() => otherErrors ?? meta.error, [otherErrors, meta.error]);
  const isError = useMemo(() => otherErrors !== undefined || meta.error !== undefined, [otherErrors, meta.error]);
  const isValueChanged = useMemo(() => field.value !== initialValues[name], [field.value, initialValues, name]);
  const overridenStyles = useMemo(
    () => ({
      "& .MuiInput-root": {
        color: isDisabled ? "grey" : "rgb(41 37 36)",
        ...(!isDisabled && isValueChanged && { backgroundColor: "#fff6e2" }),
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
          value={value ?? field.value ?? ""}
          sx={overridenStyles}
          {...(isShowHelperText && { helperText: helperText })}
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
