import * as Yup from "yup";

const mockExpensiveValidationCallLikeNetworkReqOrHeavyFunction = (value: string) => {
  const start = Date.now();
  while (Date.now() - start < 200) {
    // Simulate blocking task
  }
  return value !== "mighty@beanz.com";
};

export type TheBigForm = Yup.InferType<typeof TheBigFormSchema>;
export const getDefaultTheBigForm = (): TheBigForm => TheBigFormSchema.cast({});
export const TheBigFormSchema = Yup.object().shape({
  focusedField: Yup.string()
    .required("Required field")
    .email("Must be a valid email")
    .default("Subcribe or else 🔫")
    .test("expensive-validation", "Email already registered", async (value) => {
      const isValid = await mockExpensiveValidationCallLikeNetworkReqOrHeavyFunction(value);
      return isValid;
    }),

  // ...REST
  field1: Yup.string().optional().url("Must be a valid URL").default("https://www.youtube.com/@jjawny"),
  field2: Yup.string().optional().url("Must be a valid URL").default("https://www.youtube.com/@jjawny"),
  field3: Yup.string().optional().url("Must be a valid URL").default("https://www.youtube.com/@jjawny"),
  field4: Yup.string().optional().url("Must be a valid URL").default("https://www.youtube.com/@jjawny"),
  field5: Yup.string().optional().url("Must be a valid URL").default("https://www.tiktok.com/@jjjawny"),
  field6: Yup.string().optional().url("Must be a valid URL").default("https://www.tiktok.com/@jjjawny"),
  field7: Yup.string().optional().url("Must be a valid URL").default("https://www.tiktok.com/@jjjawny"),
  field8: Yup.string().optional().url("Must be a valid URL").default("https://www.tiktok.com/@jjjawny"),
  field9: Yup.string().optional().url("Must be a valid URL").default("https://www.instagram.com/jjjjawny"),
  field10: Yup.string().optional().url("Must be a valid URL").default("https://www.instagram.com/jjjjawny"),
  field11: Yup.string().optional().url("Must be a valid URL").default("https://www.instagram.com/jjjjawny"),
  field12: Yup.string().optional().url("Must be a valid URL").default("https://www.instagram.com/jjjjawny"),
});
