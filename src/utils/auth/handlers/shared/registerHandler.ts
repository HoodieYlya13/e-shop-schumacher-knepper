import { FormValues, Mode } from "@/hooks/auth/useAuthForm";
import { RegisterValues } from "@/schemas/authSchema";
import { UseFormSetError } from "react-hook-form";
import { authSubmitHandler } from "../authSubmitHandler";
import { CustomerCreateResponse } from "@/lib/services/store-front/auth";

export async function registerHandler(
  data: FormValues,
  clearErrors: () => void,
  setError: UseFormSetError<FormValues>,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setMode: React.Dispatch<React.SetStateAction<Mode>>,
  json: CustomerCreateResponse
) {
  const registerErrors = json.customerCreate.customerUserErrors;
  if (registerErrors?.length) {
    registerErrors.forEach(({ field, code }: { field?: string[]; code?: string }) => {
      const key = field?.[1] as keyof RegisterValues;
  
      switch (key) {
        case "email":
          switch (code) {
            case "BAD_DOMAIN":
            case "CUSTOMER_DISABLED":
              return setError(key, { message: code });
            default:
              return setError(key, { message: "EMAIL_TAKEN" });
          }
  
        case "phone":
          switch (code) {
            case "INVALID":
              return setError(key, { message: "INVALID" });
            case "TAKEN":
              return setError(key, { message: "PHONE_TAKEN" });
            default:
              return setError("root", { message: "GENERIC" });
          }
  
        case "password":
          return setError(key, { message: "PASSWORD_INVALID" });
  
        default:
          return setError("root", { message: "GENERIC" });
      }
    });
    return;
  }

  authSubmitHandler(
    data,
    "LOGIN",
    clearErrors,
    setError,
    setSuccessMessage,
    setMode,
    true
  );
}