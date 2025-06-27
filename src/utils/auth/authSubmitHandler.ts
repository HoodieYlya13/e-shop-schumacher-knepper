import { FormValues, Mode } from "@/hooks/auth/useAuthForm";
import { RegisterValues } from "@/schemas/authSchema";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UseFormSetError } from "react-hook-form";

export async function handleAuthSubmit(
  data: FormValues,
  mode: Mode,
  clearErrors: () => void,
  setError: UseFormSetError<FormValues>,
  router: AppRouterInstance,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
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
      (mode === "PASSWORD_RECOVER" && !json.customerRecover)
    ) {
      setError("root", { message: "GENERIC" });
      return;
    }

    if (mode === "PASSWORD_RECOVER") {
      const message = json.customerRecover?.customerUserErrors?.[0]?.code;

      if (message) {
        setError("root", { message: message });
        return;
      }
      setSuccessMessage("PASSWORD_RESET_SENT");
      return;
    }

    if (mode === "LOGIN") {
      const token = json?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
      const loginError = json?.customerAccessTokenCreate?.customerUserErrors?.[0]?.message;

      if (token) {
        localStorage.setItem("shopify_token", token);
        router.push("/account");
      } else {
        setError("root", { message: loginError ? "LOGIN_ERROR" : "GENERIC" });
      }
      return;
    }

    if (mode === "REGISTER") {
      const registerErrors = json.customerCreate.customerUserErrors;
      if (registerErrors?.length) {
        registerErrors.forEach(({ field, code }: { field?: string[]; code?: string }) => {
          const key = field?.[1] as keyof RegisterValues;

          if (key === "email") {
            setError(key, { message: "EMAIL_TAKEN" });
          } else if (key === "phone" && code === "TAKEN") {
            setError(key, { message: "PHONE_TAKEN" });
          } else if (code) {
            setError("root", { message: code });
          }
        });
        return;
      }

      const loginResponse = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({
          mode: "LOGIN",
          email: data.email,
          password: data.password,
        }),
      });

      const loginJson = await loginResponse.json();
      const loginToken = loginJson?.customerAccessTokenCreate?.customerAccessToken?.accessToken;

      if (loginToken) {
        localStorage.setItem("shopify_token", loginToken);
        router.push("/account");
      } else {
        setError("root", { message: "AUTHENTICATION_PROBLEM" });
      }
      return;
    }
  } catch {
    setError("root", { message: "GENERIC" });
  }
}