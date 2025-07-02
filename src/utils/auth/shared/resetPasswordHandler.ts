import { FormValues, Mode } from "@/hooks/auth/useAuthForm";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UseFormSetError } from "react-hook-form";

export async function resetPasswordHandler(
  router: AppRouterInstance,
  setError: UseFormSetError<FormValues>,
  setMode: React.Dispatch<React.SetStateAction<Mode>>,
  setValue: (name: keyof FormValues, value: string) => void,
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
    const message = json.customerResetByUrl?.customerUserErrors?.[0]?.code;
    
    if (token) {
      localStorage.setItem("shopify_token", token);
      router.push("/account");
    } else if (message === "TOKEN_INVALID") {
      setValue("email", "");
      setMode("PASSWORD_RECOVERY");
      setError("root", { message });
    } else {
      setError("root", { message: "GENERIC" });
    }
}