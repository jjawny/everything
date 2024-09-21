import * as Yup from "yup";

export type ShortFormModel = Yup.InferType<typeof ShortFormModelSchema>;
export const getDefaultShortFormModel = (): ShortFormModel => ShortFormModelSchema.cast({});
export const ShortFormModelSchema = Yup.object().shape({
  focusedField: Yup.string()
    .required("Required field")
    .email("Must be a valid email")
    .default("Subcribe or else 🔫")
    .test("expensive-validation", "Email already registered", async (value) => {
      const isValid = await mockExpensiveEmailValidationCheck(value);
      return isValid;
    }),
});

const mockExpensiveEmailValidationCheck = (email: string): boolean => {
  const start = Date.now();
  while (Date.now() - start < 200) {
    // Simulate blocking task
  }
  return email === "mighty@beanz";
};
