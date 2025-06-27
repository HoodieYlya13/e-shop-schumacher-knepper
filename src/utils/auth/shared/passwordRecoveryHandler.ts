import { FormValues } from "@/hooks/auth/useAuthForm";
import { UseFormSetError } from "react-hook-form";

export async function passwordRecoveryHandler(
  setError: UseFormSetError<FormValues>,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
  json: {
    customerRecover: {
      customerUserErrors: {
        code?: string;
        field?: string[];
        message?: string;
      }[];
    };
  },
) {
  const message = json.customerRecover?.customerUserErrors?.[0]?.code;

  if (message) {
    setError("root", { message: message });
    return;
  }
  setSuccessMessage("PASSWORD_RESET_SENT");
  return;
}