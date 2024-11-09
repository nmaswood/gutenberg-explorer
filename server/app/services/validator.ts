import { getUserByEmail } from "~/server/database/repositories/userRespository";
import type { InputValidation } from "~/types/InputValidation";
import type { RegistrationRequest } from "~/types/IRegistration";

export async function validate(data: RegistrationRequest) {
  const errors = new Map<string, { message: string | undefined }>();

  for (const [key, value] of Object.entries(data)) {
    const val = await validateRegistration(key, value as string);

    if (val.hasError) {
      errors.set(key, { message: val.errorMessage });
    }
  }

  return errors;
}

async function validateRegistration(
  key: string,
  value: string
): Promise<InputValidation> {
  const check: InputValidation = {
    value,
    isBlank: false,
    lenghtMin8: true,
    key,
    hasError: false,
  };

  if (key == "password") {
    if (value.length < 8) {
      check.hasError = true;
      check.errorMessage = `password must be at least 8 characters`;
    }
    check.lenghtMin8 = false;
  }

  if (key == "email") {
    const email = await getUserByEmail(value);
    if (email) {
      check.emailTaken = true;
      check.hasError = true;
      check.errorMessage = `Email already taken`;
    }
  }
  if (key == "name") {
    if (value.length < 1) {
      check.hasError = true;
      check.errorMessage = `Name required`;
    }
  }

  return check;
}
