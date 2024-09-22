"use client";
import useMockValidationProgressBarHook from "@/hooks/useMockValidationProgressBarHook";
import { getDefaultShortFormModel, ShortFormModel, ShortFormModelSchema } from "@/models/ShortFormModel";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Badge, Box, Button, FormHelperText, LinearProgress } from "@mui/material";
import { Form, Formik, useFormikContext } from "formik";
import _ from "lodash";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Button73 from "./Button73";
import CustomSwitch from "./CustomSwitch";
import PureFormikInput from "./PureFormikInput";

const ShortForm = () => {
  const [isFastForm, setIsFastForm] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false); // extracted to control reset button separately (keep alive after submit)

  // Known Gotcha: If the handleSubmit is 'async' in the signature, Formik 'isSubmitting' is no longer accurate...
  // Solution: Remove 'async' from signature
  // See: https://github.com/jaredpalmer/formik/issues/2442#issuecomment-619404491
  const handleSubmit = (values: ShortFormModel, formikSetSubmitting: (isSubmitting: boolean) => void) => {
    const saveFormPromise = new Promise<void>(async (resolve, reject) => {
      try {
        setIsSaving(true);
        await ShortFormModelSchema.validate(values); // final line of defense
        await new Promise((resolve) => setTimeout(resolve, 1000)); // mock network call
        resolve();
      } catch (err) {
        console.warn("Failed to submit form", err);
        const rejectionErr = err instanceof Yup.ValidationError ? new Error("Please fix errors before saving") : err;
        formikSetSubmitting(false);
        reject(rejectionErr);
      } finally {
        setIsSaving(false);
      }
    });

    toast.promise(saveFormPromise, {
      loading: "Saving...",
      success: "Saved!",
      error: (err: Error) => err.message,
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
              isSubmitDisabled={isSubmitting || isSaving || !isValid}
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
      <p className="font-sedgwick text-stone-400 max-w-max transform rotate-[-20deg]">a very...</p>
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
      <UploadFileButton />
      <Box display="flex" justifyContent="space-between" paddingTop={1} gap={1}>
        <Button
          variant="outlined"
          fullWidth
          size="small"
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
      <Box display={"flex"} flexWrap={"wrap"} gap={2} alignItems={"center"}>
        <CustomSwitch isOn={isFastForm} handleToggle={toggleIsFastForm} tooltipLabel="Use the fast form..." />
        <a href="/files/mockShortFormModelFileToUpload.json" download="GOOD test file.json">
          <Button73 text="⬇️ GOOD test file" handleClick={() => {}} />
        </a>
        <a href="/files/mockCorruptFileToUpload.json" download="BAD test file.json">
          <Button73 text="⬇️ BAD test file" handleClick={() => {}} />
        </a>
      </Box>
    </Box>
  );
};

const UploadFileButton: React.FC = () => {
  const { setValues } = useFormikContext();
  const [isHoveringFile, setIsHoveringFile] = useState<boolean>(false);

  const preventBrowserDefaultBehaviour = (e: React.MouseEvent | React.KeyboardEvent | React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const loadFileContent = (file: File | undefined) => {
    if (!file) return;

    const parsingFilePromise = new Promise((resolve, reject) => {
      const reader = new FileReader(); // Don't worry, GC will clean this up...
      reader.onload = async (e) => {
        try {
          const rawContent = e.target?.result as string;
          const jsonContent = JSON.parse(rawContent);
          const newValues = await ShortFormModelSchema.cast(jsonContent);
          setValues(newValues);
          resolve(newValues);
        } catch (err) {
          console.warn("Unable to parse uploaded file", err);
          reject(new Error("Unable to load your file"));
        }
      };
      reader.readAsText(file);
    });

    toast.promise(
      parsingFilePromise,
      {
        loading: "Loading file...",
        success: "Pre-filled with your file!",
        error: (e: Error) => e.message,
      },
      { error: { icon: "⚠️" } } // most times the user's file is the problem, don't imply (red) error
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    loadFileContent(file);
    event.target.value = ""; // allow re-upload w same file name
  };

  const handleOnDrag = (event: React.DragEvent<HTMLDivElement>) => {
    preventBrowserDefaultBehaviour(event);
    const file = event.dataTransfer.files?.[0];
    loadFileContent(file);
    setIsHoveringFile(false);
  };

  const handleOnDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    preventBrowserDefaultBehaviour(event);
  };

  return (
    <div
      onDrop={handleOnDrag}
      onDragOver={handleOnDragOver}
      onDragEnter={() => setIsHoveringFile(true)}
      onDragLeave={() => setIsHoveringFile(false)}
      className={isHoveringFile ? "duration-150 ease-in-out scale-105" : ""}
    >
      <Button
        startIcon={<UploadFileIcon />}
        variant="outlined"
        component="label"
        size="small"
        color="info"
        fullWidth
        style={{ padding: 10 }}
      >
        Pre-fill with your JSON file
        <input type="file" accept=".json" hidden onChange={handleFileUpload} />
      </Button>
    </div>
  );
};

export default ShortForm;
