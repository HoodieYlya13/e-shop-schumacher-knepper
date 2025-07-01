import { NewPasswordValues } from "@/schemas/authSchema";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UseFormSetError } from "react-hook-form";

export async function resetPasswordHandler(
  data: NewPasswordValues,
  router: AppRouterInstance,
  clearErrors: () => void,
  setError: UseFormSetError<NewPasswordValues>,
) {
  try {
    clearErrors();
    const response = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ mode: "NEW_PASSWORD", ...data }),
    });

    const json = await response.json();
    const token = json.customerReset?.customerAccessToken?.accessToken;

    if (token) {
      localStorage.setItem("shopify_token", token);
      router.push("/account");
    } else {
      setError("root", { message: "GENERIC" });
    }
  } catch {
    setError("root", { message: "GENERIC" });
  }
}