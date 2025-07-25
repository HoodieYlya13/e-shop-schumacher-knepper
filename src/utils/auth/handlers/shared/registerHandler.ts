import { FormValues, Mode } from "@/hooks/auth/useAuthForm";
import { RegisterValues } from "@/schemas/authSchema";
import { UseFormSetError } from "react-hook-form";
import { authSubmitHandler } from "../authSubmitHandler";

export async function registerHandler(
  data: FormValues,
  clearErrors: () => void,
  setError: UseFormSetError<FormValues>,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setMode: React.Dispatch<React.SetStateAction<Mode>>,
  json: {
    customerCreate: {
      customer?: {
        id?: string;
        email?: string;
        firstName?: string | null;
        lastName?: string | null;
        phone?: string | null;
      };
      customerUserErrors: {
        code?: string;
        field?: string[];
        message?: string;
      }[];
    };
  }
) {
  const registerErrors = json.customerCreate.customerUserErrors;
  if (registerErrors?.length) {
    registerErrors.forEach(({ field, code }: { field?: string[]; code?: string }) => {
      const key = field?.[1] as keyof RegisterValues;
      
      if (key === "email") {
        if (code === "BAD_DOMAIN") return setError(key, { message: code });
        if (code === "CUSTOMER_DISABLED") return setError(key, { message: code });
        return setError(key, { message: "EMAIL_TAKEN" });
      } else if (key === "phone") {
        if (code === "INVALID") return setError(key, { message: "INVALID" });
        if (code === "TAKEN") return setError(key, { message: "PHONE_TAKEN" });
      } else if (key === "password") return setError(key, { message: "PASSWORD_INVALID" });
      setError("root", { message: "GENERIC" });
    });
    return;
  }

  const id = json.customerCreate.customer?.id;

  if (id)
    await fetch("/api/customer", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

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