"use client";
import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { useMemo } from "react";

const FormikDebugPanel = <T,>() => {
  const { values, errors } = useFormikContext<T>();
  const valuesMemoized = useMemo(() => JSON.stringify(values, null, 2), [values]);
  const errorsMemoized = useMemo(() => JSON.stringify(errors, null, 2), [errors]);

  return (
    <Box position={"absolute"} top={0} right={500} borderRadius={1} style={{ backgroundColor: "lightgray" }}>
      <p className="w-full bg-stone-600 text-white rounded-t-sm px-1">DEBUG PANEL</p>

      <div className="p-1 text-xs">
        <pre>
          <code>values: {valuesMemoized}</code>
        </pre>
        <pre>
          <code>errors: {errorsMemoized}</code>
        </pre>
      </div>
    </Box>
  );
};

export default FormikDebugPanel;
