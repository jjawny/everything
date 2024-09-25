"use client";
import useManageLocalStorage from "@/hooks/useManageLocalStorage";
import useMockValidationProgressBarHook from "@/hooks/useMockValidationProgressBarHook";
import { FastFormModel, FastFormModelSchema, getDefaultFastFormModel } from "@/models/FastFormModel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SyncIcon from "@mui/icons-material/Sync";
import { Badge, Box, FormHelperText, LinearProgress } from "@mui/material";
import { Form, Formik, FormikHelpers, useFormikContext } from "formik";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import toast from "react-hot-toast";
import * as Yup from "yup";
import MemoizedFastFormControlPanel from "./FastFormControlPanel";
import FastFormSkeleton from "./FastFormSkeleton";
import FormikDebugPanel from "./FormikDebugPanel";
import FormikValidationDebouncedEffect from "./FormikValidationDebounceEffect";
import PureFormikInput from "./PureFormikInput";

const FAST_FORM_KEY = "fastFormData";

const FastForm = () => {
  const [isFastForm, setIsFastForm] = useState<boolean>(true);
  const [isAutoSavingProgress, setIsAutoSavingProgress] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false); // extracted to control reset button separately (keep alive after submit)
  const [isForceFailDuringSubmit, setIsForceFailDuringSubmit] = useState<boolean>(false);
  const [isForceSkeleton, setIsForceSkeleton] = useState<boolean>(false);
  const initialValues = getDefaultFastFormModel();
  const {
    data: autoSavedForm,
    isLoadingDataForFirstTime,
    clearData,
    saveData,
  } = useManageLocalStorage<FastFormModel>(FAST_FORM_KEY);

  // TODO: move to tricks tab
  // const [forceReRenderKey, setForceReRenderKey] = useState<number>(0);
  // const forceReRender = () => setForceReRenderKey((curr) => (curr === 0 ? 1 : 0));

  // Gotcha: If the handleSubmit is 'async' in the signature, Formik 'isSubmitting' bool is no longer accurate...
  // Solution: Remove 'async' from signature lol
  // See: https://github.com/jaredpalmer/formik/issues/2442#issuecomment-619404491
  const handleSubmit = useCallback(
    (values: FastFormModel, { setSubmitting, validateForm, setFieldValue }: FormikHelpers<FastFormModel>) => {
      const saveFormPromise = new Promise<void>(async (resolve, reject) => {
        try {
          setIsSaving(true);

          // As we only reach here when form is valid (Formik blocks submit otherwise)
          // Allow a rapid way to mock a failure here in the user's journey...
          if (isForceFailDuringSubmit) {
            flushSync(() => {
              setFieldValue("email", "BAD E M A I L");
            });
          }

          // Final line of defense (don't trust Formik to always prevent submitting a bad form)
          const errors = await validateForm();
          if (Object.keys(errors).length > 0) {
            throw new Error("Please fix errors before saving");
          }

          await new Promise((resolve) => setTimeout(resolve, 1000)); // mock network call
          clearData();
          resolve();
        } catch (err) {
          console.warn("Failed to submit form", err);
          const rejectionErr = err instanceof Yup.ValidationError ? new Error("Please fix errors before saving") : err;
          setSubmitting(false);
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
    },
    [isForceFailDuringSubmit, clearData] // Closure gotcha... forgot to regen this function when this bool changes
  );

  const handleResetSideEffects = useCallback(() => {
    clearData();

    // Problem: When Formik resets the form, we always want default values to be shown, but its reverted back to the auto-saved data (from page load)...

    // Old solution:
    // - To reset the form properly, update 'initialValues' w the default values
    // - Must have 'enableReinitialize' on (default off) to trigger a re-render (key method won't work)
    // - This caused common confusion, see https://github.com/jaredpalmer/formik/issues/811
    // - Separate bug caused by loading 'initialValues' w auto-saved data:
    //   - Validation isn't triggered on the auto-saved data from page load
    //   - This means if we load valid form, edit a field to be invalid, then...
    //     undo edit (original valid value from page load), no validation is triggered...
    //     aka can NEVER submit a valid auto-saved form after being first time editted to trigger validation error...

    // New solution:
    // - The above was overengineering due to 'initialValues' being loaded w auto-saved form (although fixed, other bugs remained...)
    // - Instead we will ALWAYS assign 'initialValues' w the default form
    // - When the auto-saved data has been fetched, we can assign to the current VALUES (NOT 'initialValues')
    // - This conceptually makes more sense:
    //   - The same form is loaded every time
    //   - If there's auto-saved data, we update the form
    //   - Now Whenever we reset the form, the initial state is always correct
    // - This achieves the same outcome and value, w none of the complexity, #GAINZ
  }, [clearData]);

  const isLoading = isLoadingDataForFirstTime || isForceSkeleton;

  if (isLoading)
    return <FastFormSkeleton isForceSkeleton={isForceSkeleton} toggleIsForceSkeleton={setIsForceSkeleton} />;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      {...(isFastForm && { validateOnBlur: false, validateOnChange: false, validateOnMount: false })}
      validationSchema={FastFormModelSchema}
      onSubmit={handleSubmit}
      onReset={handleResetSideEffects}
    >
      {({ isSubmitting, isValid }) => {
        return (
          <Form style={{ display: "flex", flexDirection: "column", gap: 5, position: "relative" }}>
            <PrefillFormEffect data={autoSavedForm} />
            {isFastForm && (
              <FormikValidationDebouncedEffect<FastFormModel>
                saveFormProgress={saveData}
                toggleIsAutoSavingProgress={setIsAutoSavingProgress}
              />
            )}
            {isAutoSavingProgress ? (
              <SyncIcon className="animate-spin transform rotate-180" color="disabled" />
            ) : (
              <CheckCircleIcon color="disabled" />
            )}
            <FormTitle isFastForm={isFastForm} />
            <EmailField />
            <MemoizedFastFormControlPanel
              isResetDisabled={isSaving}
              isSubmitDisabled={isSubmitting || isSaving || !isValid}
              isFastForm={isFastForm}
              isForceSkeleton={isForceSkeleton}
              isForceFailDuringSubmit={isForceFailDuringSubmit}
              toggleIsFastForm={setIsFastForm}
              toggleIsForceSkeleton={setIsForceSkeleton}
              toggleIsForceFailDuringSubmit={setIsForceFailDuringSubmit}
            />
            <FormikDebugPanel<FastFormModel> />
          </Form>
        );
      }}
    </Formik>
  );
};

type PrefillFormEffectProps = {
  data?: FastFormModel;
};

const PrefillFormEffect: React.FC<PrefillFormEffectProps> = (props) => {
  const { data } = props;
  const { setValues } = useFormikContext<FastFormModel>();
  const hasRunForTheFirstTime = useRef<boolean>(false);
  // Even though we render <Formik> by the time we have the auto-saved data ready...
  // <Formik> only accepts 'initialValues', no 'values' prop, this makes sense but...
  // means we have to sync via a useEffect, and to avoid lint warnings, extract it here (into a FC)

  // 'useManageLocalStorage' is OUR custom hook, but for fun, let's make is super generic as if it's from some pkg...
  // super generic meaning it manages both data in localStorage and its internal React state, so, to only render ONCE...
  // use a ref (and we know this pre-filling effect will only run after we've attempted to load from localStorage
  useEffect(() => {
    if (hasRunForTheFirstTime.current) {
      return;
    } else {
      if (data) setValues(data);
      hasRunForTheFirstTime.current = true;
    }
  }, [setValues, data]);

  return null;
};

type FormTitleProps = {
  isFastForm: boolean;
};

const FormTitle: React.FC<FormTitleProps> = (props) => {
  const { isFastForm } = props;
  const { errors } = useFormikContext<FastFormModel>();
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
  const { isValidating, isSubmitting, errors, values, initialValues, dirty } = useFormikContext<FastFormModel>();
  const { isShowValidationProgressBar } = useMockValidationProgressBarHook(values.email, initialValues.email);
  const isAvailable = !isValidating && !errors["email"];
  const isShowBlankPlaceholderHelperText = isShowValidationProgressBar || isSubmitting;
  const helperText = isShowBlankPlaceholderHelperText
    ? " "
    : isAvailable && dirty
    ? "Email available"
    : errors.email ?? " ";

  return (
    <Box position="relative">
      <PureFormikInput<FastFormModel> name="email" isDisabled={isSubmitting} isShowHelperText={false} />
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

export default FastForm;
