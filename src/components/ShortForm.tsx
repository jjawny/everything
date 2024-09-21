"use client";
import { getDefaultShortFormModel, ShortFormModel, ShortFormModelSchema } from "@/models/ShortFormModel";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import { Badge, Box, Button, FormHelperText, LinearProgress } from "@mui/material";
import { Form, Formik, useFormikContext } from "formik";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import CustomSwitch from "./CustomSwitch";
import PureFormikInput from "./PureFormikInput";

const ShortForm = () => {
  const [isFastForm, setIsFastForm] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false); // extracted to control reset button separately (keep alive after submit)
  const [isShowEmailValidationProgressBar, setIsShowEmailValidationProgressBar] = useState<boolean>(false); // extracted as Formik 'isValidating' bool not working

  return (
    <div>
      <Formik
        initialValues={getDefaultShortFormModel()}
        {...(isFastForm && { validateOnBlur: false, validateOnChange: false, validateOnMount: false })}
        validationSchema={ShortFormModelSchema}
        onSubmit={(values, { setSubmitting }) => {
          const updateLocationPromise = new Promise<void>(async (resolve, reject) => {
            try {
              setIsSaving(true);
              await ShortFormModelSchema.validate(values); // final line of defense
              setTimeout(() => resolve(), 1000);
            } catch (err) {
              const rejectionErr =
                err instanceof Yup.ValidationError ? new Error("Please fix errors before saving") : err;
              reject(rejectionErr);
            } finally {
              setIsSaving(false);
            }
          });

          toast.promise(updateLocationPromise, {
            loading: "Saving...",
            success: "Saved!",
            error: () => {
              setSubmitting(false);
              return <b>Failed to save</b>;
            },
          });
        }}
      >
        {({ isSubmitting, errors, isValidating, isValid }) => {
          const errorsCount = Object.keys(errors).length;
          const isAvailable = !isValidating && !errors.focusedField;

          useEffect(
            function ensureValidationProgressBarIsShown() {
              if (isValidating) {
                setIsShowEmailValidationProgressBar(true);
                setTimeout(() => {
                  setIsShowEmailValidationProgressBar(false);
                }, 1000);
              }
            },
            [isValidating]
          );

          return (
            <Form style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {isFastForm && <FormikValidationDebouncedEffect />}
              <p className="text-stone-400">a very...</p>
              <Badge badgeContent={errorsCount} color="error">
                <Box display="flex" flexWrap="nowrap" gap={2} width={"100%"} justifyContent="flex-end">
                  <h1 className="font-sedgwick text-stone-800 text-8xl text-start">{isFastForm ? "FAST" : "SLOW"}</h1>
                  <h1 className="font-sedgwick text-stone-800 text-8xl text-end">FORM</h1>
                </Box>
              </Badge>
              <Box position="relative">
                <PureFormikInput<ShortFormModel> name="focusedField" isDisabled={isSubmitting} size="medium" />
                {isShowEmailValidationProgressBar && !errors.focusedField && (
                  <LinearProgress style={{ marginBottom: "18.5px" }} />
                )}
                {!isShowEmailValidationProgressBar && isAvailable && !isSubmitting && (
                  <FormHelperText style={{ color: "green" }}>Email available</FormHelperText>
                )}
                <HandDrawnArrow />
              </Box>
              <FormControls isResetDisabled={isSaving} isSubmitDisabled={isSubmitting || !isValid} />
              <CustomSwitch isOn={isFastForm} handleToggle={setIsFastForm} tooltipLabel="Fix me..." />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

const FormikValidationDebouncedEffect: React.FC = () => {
  const formik = useFormikContext();
  const debouncedValidate = useMemo(() => _.debounce(formik.validateForm, 800), [formik.validateForm]);

  useEffect(
    function validate() {
      if (formik.dirty) {
        debouncedValidate(formik.values);
      }

      return () => {
        debouncedValidate.cancel();
      };
    },
    [formik.values, debouncedValidate]
  );

  return null;
};

type FormControlsProps = {
  isSubmitDisabled: boolean;
  isResetDisabled: boolean;
};

const FormControls: React.FC<FormControlsProps> = (props) => {
  const { isSubmitDisabled = false, isResetDisabled = false } = props;
  return (
    <Box display="flex" justifyContent="space-between" paddingTop={1} gap={1}>
      <Button variant="outlined" size="small" fullWidth type="reset" disabled={isResetDisabled} endIcon={<ClearIcon />}>
        Reset
      </Button>
      <Button
        variant="contained"
        fullWidth
        size="small"
        type="submit"
        disabled={isSubmitDisabled}
        color="primary"
        endIcon={<DoneIcon />}
      >
        Submit
      </Button>
    </Box>
  );
};

const HandDrawnArrow: React.FC = () => {
  return (
    <img
      src="/images/arrow.svg"
      alt="handrawn arrow pointing to textfield"
      style={{
        position: "absolute",
        width: 40,
        top: -30,
        right: -30,
        transform: "scaleX(-1) scaleY(.7) rotate(135deg)",
      }}
    />
  );
};

export default ShortForm;
