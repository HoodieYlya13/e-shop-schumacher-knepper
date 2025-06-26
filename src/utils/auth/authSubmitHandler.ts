import { FormValues, Mode } from "@/hooks/auth/useAuthForm";
import { RegisterValues } from "@/schemas/authSchema";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UseFormSetError } from "react-hook-form";

export async function handleAuthSubmit(
  data: FormValues,
  mode: Mode,
  clearErrors: () => void,
  setError: UseFormSetError<FormValues>,
  router: AppRouterInstance
) {
  try {
    clearErrors();

    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ mode, ...data }),
    });

    const json = await res.json();

    if (!res.ok || (mode === "REGISTER" && !json.customerCreate)) {
      setError("root", { message: "GENERIC" });
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

    const regErrors = json.customerCreate.customerUserErrors;
    if (regErrors?.length) {
      regErrors.forEach(({ field, code }: { field?: string[]; code?: string }) => {
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

    const loginRes = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({
        mode: "LOGIN",
        email: data.email,
        password: data.password,
      }),
    });

    const loginJson = await loginRes.json();
    const loginToken = loginJson?.customerAccessTokenCreate?.customerAccessToken?.accessToken;

    if (loginToken) {
      localStorage.setItem("shopify_token", loginToken);
      router.push("/account");
    } else {
      setError("root", { message: "AUTHENTICATION_PROBLEM" });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "GENERIC";
    setError("root", { message });
  }
}