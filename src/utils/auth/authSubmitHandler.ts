import { FormValues, Mode } from "@/hooks/auth/useAuthForm";
import { RegisterValues } from "@/schemas/authSchema";
import { UseFormSetError } from "react-hook-form";
import { passwordRecoveryHandler } from "./shared/passwordRecoveryHandler";
import { loginHandler } from "./shared/loginHandler";
import { registerHandler } from "./shared/registerHandler";
import { useRouter } from "next/navigation";

export async function authSubmitHandler(
  data: FormValues,
  mode: Mode,
  clearErrors: () => void,
  setError: UseFormSetError<FormValues>,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setMode: (mode: "LOGIN") => void,
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
      (mode === "PASSWORD_RECOVERY" && !json.customerRecover)
    ) {
      setError("root", { message: "GENERIC" });
      return;
    }

    const router = useRouter();
    
    if (mode === "REGISTER") {
      registerHandler(
        data as RegisterValues,
        clearErrors,
        setError,
        router,
        setSuccessMessage,
        setMode,
        json
      );
    }

    if (mode === "LOGIN") {
      loginHandler(setError, router, json, setMode, afterRegister);
    }

    if (mode === "PASSWORD_RECOVERY") {
      passwordRecoveryHandler(setError, setSuccessMessage, json);
    }
  } catch {
    setError("root", { message: "GENERIC" });
  }
}