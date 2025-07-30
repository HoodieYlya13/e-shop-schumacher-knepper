import { FormValues, Mode } from "@/hooks/auth/useAuthForm";
import { ResetPasswordValues, RegisterValues } from "@/schemas/authSchema";
import { UseFormSetError, UseFormSetValue } from "react-hook-form";
import { registerHandler } from "./shared/registerHandler";
import { loginHandler } from "./shared/loginHandler";
import { passwordRecoveryHandler } from "./shared/passwordRecoveryHandler";
import { resetPasswordHandler } from "./shared/resetPasswordHandler";

export async function authSubmitHandler(
  data: FormValues,
  mode: Mode,
  clearErrors: () => void,
  setError: UseFormSetError<FormValues>,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setMode: React.Dispatch<React.SetStateAction<Mode>>,
  afterRegister: boolean = false,
  setValue?: UseFormSetValue<ResetPasswordValues>
) {
  try {
    clearErrors();
    setSuccessMessage(null);
    
    const response = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ mode, ...data }),
    });
    
    const json = await response.json();
    
    const failed =
      !response.ok ||
      (mode === "REGISTER" && !json.customerCreate) ||
      (mode === "LOGIN" && !json.customerAccessTokenCreate) ||
      (mode === "PASSWORD_RECOVERY" && !json.customerRecover) ||
      (mode === "RESET_PASSWORD" && !json.customerResetByUrl);

    if (failed) return setError("root", { message: "GENERIC" });

    switch (mode) {
      case "REGISTER":
        return registerHandler(
          data as RegisterValues,
          clearErrors,
          setError,
          setSuccessMessage,
          setMode,
          json
        );

      case "LOGIN":
        return loginHandler(setError, json, setMode, afterRegister);

      case "PASSWORD_RECOVERY":
        return passwordRecoveryHandler(setError, setSuccessMessage, json);

      case "RESET_PASSWORD":
        if (!setValue) throw new Error("setValue is required for RESET_PASSWORD mode");
        return resetPasswordHandler(setError, setMode, setValue, json);

      default:
        setError("root", { message: "GENERIC" });
    }
  } catch {
    setError("root", { message: "GENERIC" });
  }
}