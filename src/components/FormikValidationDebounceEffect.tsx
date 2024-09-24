"use client";
import { useFormikContext } from "formik";
import _ from "lodash";
import { useEffect, useMemo } from "react";

/**
 * Recommend turning off default Formik validations
 *  - validateOnBlur
 *  - validateOnChange
 *  - validateOnMount
 */
type FormikValidationDebouncedEffectProps<T> = {
  saveFormProgress: (form: T) => void;
  toggleIsAutoSavingProgress: (isOn: boolean) => void;
};

const FormikValidationDebouncedEffect = <T,>(props: FormikValidationDebouncedEffectProps<T>) => {
  const { saveFormProgress, toggleIsAutoSavingProgress } = props;
  const { dirty, values, validateForm, isSubmitting } = useFormikContext<T>();
  const debouncedValidate = useMemo(() => _.debounce(validateForm, 800), [validateForm]);
  const debouncedAutoSave = useMemo(
    () =>
      _.debounce(() => {
        saveFormProgress(values);
        const now = new Date();
        console.log(
          `Auto-saved at ${now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}`
        );
        toggleIsAutoSavingProgress(false);
      }, 1600),
    [values, saveFormProgress, toggleIsAutoSavingProgress]
  );

  useEffect(() => {
    if (dirty) {
      toggleIsAutoSavingProgress(true);
      debouncedValidate();
      debouncedAutoSave();
    }

    // Cancel auto-save if submitting to avoid race-conditions
    if (isSubmitting) {
      debouncedAutoSave.cancel();
      toggleIsAutoSavingProgress(false);
    }

    return () => {
      debouncedValidate.cancel();
      debouncedAutoSave.cancel();
      toggleIsAutoSavingProgress(false);
    };
  }, [dirty, isSubmitting, values, debouncedValidate, debouncedAutoSave, toggleIsAutoSavingProgress]);

  return null;
};

export default FormikValidationDebouncedEffect;
