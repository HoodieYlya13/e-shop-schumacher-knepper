import { FormValues, Mode } from "@/hooks/auth/useAuthForm";
import { RegisterValues } from "@/schemas/authSchema";
import { UseFormSetError } from "react-hook-form";
import { authSubmitHandler } from "../authSubmitHandler";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function registerHandler(
  data: FormValues,
  clearErrors: () => void,
  setError: UseFormSetError<FormValues>,
  router: AppRouterInstance,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setMode: React.Dispatch<React.SetStateAction<Mode>>,
  setValue: (name: keyof FormValues, value: string) => void,
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
  },
) {
  const registerErrors = json.customerCreate.customerUserErrors;
  if (registerErrors?.length) {
    registerErrors.forEach(({ field, code }: { field?: string[]; code?: string }) => {
      const key = field?.[1] as keyof RegisterValues;
      
      if (key === "email") {
        setError(key, { message: "EMAIL_TAKEN" });
      } else if (key === "phone" && code === "TAKEN") {
        setError(key, { message: "PHONE_TAKEN" });
      } else {
        setError("root", { message: "GENERIC" });
      }
    });
    return;
  }

  authSubmitHandler(
    data,
    "LOGIN",
    clearErrors,
    setError,
    router,
    setSuccessMessage,
    setMode,
    setValue,
    true
  );
}