import { FormValues } from "@/hooks/auth/useAuthForm";
import { login } from "@/utils/account/login";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UseFormSetError } from "react-hook-form";

export async function loginHandler(
  setError: UseFormSetError<FormValues>,
  router: AppRouterInstance,
  json: {
    customerAccessTokenCreate: {
      customerAccessToken?: {
        accessToken?: string;
        expiresAt?: string;
      },
      customerUserErrors: {
        field?: string[];
        message?: string;
      }[];
    };
  },
  setMode: (mode: "LOGIN") => void,
  afterRegister: boolean,
) {
  const token =
    json?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
  const tokenExpiry =
    json.customerAccessTokenCreate?.customerAccessToken?.expiresAt ||
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const loginError = json?.customerAccessTokenCreate?.customerUserErrors?.[0]
    ?.message
    ? "UNIDENTIFIED_CUSTOMER"
    : null;

  if (!token) {
    const errorMessage = afterRegister ? "AUTHENTICATION_PROBLEM" : (loginError || "GENERIC");
    if (afterRegister) setMode("LOGIN");
    setError("root", { message: errorMessage });
    return;
  }
  
  await login(token, tokenExpiry, router);
  router.push("/account");
}