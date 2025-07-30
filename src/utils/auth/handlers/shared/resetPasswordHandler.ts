import { FormValues, Mode } from "@/hooks/auth/useAuthForm";
import { ResetPasswordValues } from "@/schemas/authSchema";
import { login } from "@/utils/account/login";
import { UseFormSetError, UseFormSetValue } from "react-hook-form";

interface CustomerResetByUrlResponse {
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
}

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