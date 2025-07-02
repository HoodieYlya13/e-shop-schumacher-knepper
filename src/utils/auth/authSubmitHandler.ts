import { FormValues, Mode } from "@/hooks/auth/useAuthForm";
import { RegisterValues } from "@/schemas/authSchema";
import { UseFormSetError } from "react-hook-form";
import { passwordRecoveryHandler } from "./shared/passwordRecoveryHandler";
import { loginHandler } from "./shared/loginHandler";
import { registerHandler } from "./shared/registerHandler";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { resetPasswordHandler } from "./shared/resetPasswordHandler";

export async function authSubmitHandler(
  data: FormValues,
  mode: Mode,
  clearErrors: () => void,
  setError: UseFormSetError<FormValues>,
  router: AppRouterInstance,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setMode: React.Dispatch<React.SetStateAction<Mode>>,
  setValue: (name: keyof FormValues, value: string) => void,
  afterRegister: boolean = false
) {
  try {
    clearErrors();
    setSuccessMessage(null);
    
    const response = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ mode, ...data }),
    });
    
    const json = await response.json();
    
    if (
      !response.ok ||
      (mode === "REGISTER" && !json.customerCreate) ||
      (mode === "LOGIN" && !json.customerAccessTokenCreate) ||
      (mode === "PASSWORD_RECOVERY" && !json.customerRecover) ||
      (mode === "NEW_PASSWORD" && !json.customerResetByUrl)
    ) {
      setError("root", { message: "GENERIC" });
      return;
    }
    
    if (mode === "REGISTER") {
      return registerHandler(
        data as RegisterValues,
        clearErrors,
        setError,
        router,
        setSuccessMessage,
        setMode,
        setValue,
        json
      );
    }

    if (mode === "LOGIN") {
      return loginHandler(setError, router, json, setMode, afterRegister);
    }

    if (mode === "PASSWORD_RECOVERY") {
      return passwordRecoveryHandler(setError, setSuccessMessage, json);
    }

    if (mode === "NEW_PASSWORD") {
      return resetPasswordHandler(router, setError, setMode, setValue, json);
    }
  } catch {
    setError("root", { message: "GENERIC" });
  }
}