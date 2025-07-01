import { FormValues } from "@/hooks/auth/useAuthForm";
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
  const loginError =
    json?.customerAccessTokenCreate?.customerUserErrors?.[0]?.message;

  if (!token) {
    const errorMessage = afterRegister ? "AUTHENTICATION_PROBLEM" : (loginError || "GENERIC");
    if (afterRegister) setMode("LOGIN");
    setError("root", { message: errorMessage });
    return;
  }
  
  localStorage.setItem("shopify_token", token);
  router.push("/account");
    
  return;
}