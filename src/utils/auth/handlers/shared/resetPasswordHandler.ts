import { FormValues, Mode } from "@/hooks/auth/useAuthForm";
import { ResetPasswordValues } from "@/schemas/authSchema";
import { login } from "@/utils/account/login";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UseFormSetError } from "react-hook-form";

export async function resetPasswordHandler(
  router: AppRouterInstance,
  setError: UseFormSetError<FormValues>,
  setMode: React.Dispatch<React.SetStateAction<Mode>>,
  setValue: (name: keyof ResetPasswordValues, value: string) => void,
  json: {
    customerResetByUrl: {
      customer?: {
        id?: string;
        email?: string;
        firstName?: string | null;
        lastName?: string | null;
        phone?: string | null;
      };
      customerAccessToken?: {
        accessToken?: string;
        expiresAt?: string;
      };
      customerUserErrors: {
        code?: string;
        field?: string[];
        message?: string;
      }[];
    };
  },
) {
    const token = json.customerResetByUrl?.customerAccessToken?.accessToken;
    const tokenExpiry =
      json.customerResetByUrl?.customerAccessToken?.expiresAt ||
      new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const message = json.customerResetByUrl?.customerUserErrors?.[0]?.code;
    
    if (token) {
      await login(token, tokenExpiry, router);
    } else {
      const invalidMessage = message === "INVALID"
      setValue("email", "");
      setMode(invalidMessage ? "PASSWORD_RECOVERY" : "LOGIN");
      setError("root", {
        message: invalidMessage ? "TOKEN_INVALID" : "GENERIC",
      });
    }
}