"use client";
import useMockValidationProgressBarHook from "@/hooks/useMockValidationProgressBarHook";
import { getDefaultShortFormModel, ShortFormModel, ShortFormModelSchema } from "@/models/ShortFormModel";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import { Badge, Box, Button, FormHelperText, LinearProgress } from "@mui/material";
import { Form, Formik, useFormikContext } from "formik";
import _ from "lodash";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import CustomSwitch from "./CustomSwitch";
import PureFormikInput from "./PureFormikInput";

const ShortForm = () => {
  const [isFastForm, setIsFastForm] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false); // extracted to control reset button separately (keep alive after submit)

  const handleSubmit = async (values: ShortFormModel, formikSetSubmitting: (isSubmitting: boolean) => void) => {
    const saveFormPromise = new Promise<void>(async (resolve, reject) => {
      try {
        setIsSaving(true);
        await ShortFormModelSchema.validate(values); // final line of defense
        setTimeout(() => resolve(), 1000); // mock network call
      } catch (err) {
        const rejectionErr = err instanceof Yup.ValidationError ? new Error("Please fix errors before saving") : err;
        reject(rejectionErr);
      } finally {
        setIsSaving(false);
      }
    });

    toast.promise(saveFormPromise, {
      loading: "Saving...",
      success: "Saved!",
      error: () => {
        formikSetSubmitting(false);
        return <b>Failed to save</b>;
      },
    });
  };

  return (
    <Formik
      initialValues={getDefaultShortFormModel()}
      {...(isFastForm && { validateOnBlur: false, validateOnChange: false, validateOnMount: false })}
      validationSchema={ShortFormModelSchema}
      onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting)}
    >
      {({ isSubmitting, isValid }) => {
        return (
          <Form style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {isFastForm && <FormikValidationDebouncedEffect />}
            <FormTitle isFastForm={isFastForm} />
            <EmailField />
            <FormControlPanel
              isResetDisabled={isSaving}
              isSubmitDisabled={isSubmitting || !isValid}
              isFastForm={isFastForm}
              toggleIsFastForm={setIsFastForm}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

const FormikValidationDebouncedEffect: React.FC = () => {
  const formikCtx = useFormikContext();
  const debouncedValidate = useMemo(() => _.debounce(formikCtx.validateForm, 800), [formikCtx.validateForm]);

  useEffect(
    function validate() {
      if (formikCtx.dirty) debouncedValidate(formikCtx.values);

      return () => {
        debouncedValidate.cancel();
      };
    },
    // Don't run effect when 'formikCtx.dirty' changes
    // eslint-disable-next-line
    [formikCtx.values, debouncedValidate]
  );

  return null;
};

type FormTitleProps = {
  isFastForm: boolean;
};

const FormTitle: React.FC<FormTitleProps> = (props) => {
  const { isFastForm } = props;
  const { errors } = useFormikContext();
  const errorsCount = Object.keys(errors).length;

  return (
    <>
      <p className="text-stone-400">a very...</p>
      <Badge badgeContent={errorsCount} color="error">
        <Box display="flex" flexWrap="nowrap" gap={2} width={"100%"} justifyContent="flex-end">
          <h1 className="font-sedgwick text-stone-800 text-8xl text-start">{isFastForm ? "FAST" : "SLOW"}</h1>
          <h1 className="font-sedgwick text-stone-800 text-8xl text-end">FORM</h1>
        </Box>
      </Badge>
    </>
  );
};

const EmailField = () => {
  const { isValidating, isSubmitting, errors, values, initialValues, dirty } = useFormikContext<ShortFormModel>();
  const { isShowValidationProgressBar } = useMockValidationProgressBarHook(values.email, initialValues.email);
  const isAvailable = !isValidating && !errors["email"];
  const isShowBlankPlaceholderHelperText = isShowValidationProgressBar || isSubmitting || !dirty;
  const helperText = isShowBlankPlaceholderHelperText ? " " : isAvailable ? "Email available" : errors.email ?? " ";
  return (
    <Box position="relative">
      <PureFormikInput<ShortFormModel> name="email" isDisabled={isSubmitting} isShowHelperText={false} />
      {isShowValidationProgressBar ? <LinearProgress /> : <Box minHeight={"4px"}></Box>}
      <FormHelperText style={{ color: isAvailable ? "green" : "red" }}>{helperText}</FormHelperText>
      <Image
        src="/images/arrow.svg"
        alt="handrawn arrow pointing to textfield"
        width={40}
        height={40}
        className="absolute w-10 top-[-30px] right-[-30px] transform scale-x-[-1] scale-y-[0.7] rotate-[-125deg]"
      />
    </Box>
  );
};

type FormControlPanelProps = {
  isSubmitDisabled?: boolean;
  isResetDisabled?: boolean;
  isFastForm: boolean;
  toggleIsFastForm: (isFastForm: boolean) => void;
};

const FormControlPanel: React.FC<FormControlPanelProps> = (props) => {
  const { isSubmitDisabled = false, isResetDisabled = false, isFastForm, toggleIsFastForm } = props;
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box display="flex" justifyContent="space-between" paddingTop={1} gap={1}>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          type="reset"
          disabled={isResetDisabled}
          endIcon={<ClearIcon />}
        >
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
      <CustomSwitch isOn={isFastForm} handleToggle={toggleIsFastForm} tooltipLabel="Use the fast form..." />
    </Box>
  );
};

export default ShortForm;
