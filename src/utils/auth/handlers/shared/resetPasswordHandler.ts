import { FormValues, Mode } from "@/hooks/auth/useAuthForm";
import { CustomerResetByUrlResponse } from "@/lib/services/store-front/auth";
import { ResetPasswordValues } from "@/schemas/authSchema";
import { login } from "@/utils/account/login";
import { UseFormSetError, UseFormSetValue } from "react-hook-form";

export async function resetPasswordHandler(
  setError: UseFormSetError<FormValues>,
  setMode: React.Dispatch<React.SetStateAction<Mode>>,
  setValue: UseFormSetValue<ResetPasswordValues>,
  json: CustomerResetByUrlResponse,
) {
    const customerAccessToken = json.customerResetByUrl?.customerAccessToken?.accessToken;
    const tokenExpiry =
      json.customerResetByUrl?.customerAccessToken?.expiresAt ||
      new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const message = json.customerResetByUrl?.customerUserErrors?.[0]?.code;
    
    if (customerAccessToken) await login(customerAccessToken, tokenExpiry);
    
    else {
      const invalidMessage = message === "INVALID"
      setValue("email", "");
      setMode(invalidMessage ? "PASSWORD_RECOVERY" : "LOGIN");
      setError("root", {
        message: invalidMessage ? "TOKEN_INVALID" : "GENERIC",
      });
    }
}