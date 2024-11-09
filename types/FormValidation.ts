import type { InputValidation } from "./InputValidation";

export type FormValidation = {
  hasErrors: boolean;
  errors?: Map<string, { message: InputValidation }>;
  loggedIn?: boolean;
};

export type FormErrors = {
  field: string;
  message: InputValidation;
};
