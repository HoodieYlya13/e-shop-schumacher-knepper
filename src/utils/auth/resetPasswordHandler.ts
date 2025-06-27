import { NewPasswordValues } from "@/schemas/authSchema";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UseFormSetError } from "react-hook-form";

export async function resetPasswordHandler(
  data: NewPasswordValues,
  clearErrors: () => void,
  setError: UseFormSetError<NewPasswordValues>,
  router: AppRouterInstance,
) {
  try {
    clearErrors();
    const response = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ mode: "NEW_PASSWORD", ...data }),
    });

    const json = await response.json();

    if (!response.ok || !json) {
      router.push("/");
      setError("root", { message: "GENERIC" });
      return;
    }
    console.log("json", json);

    // if (token) {
    //   localStorage.setItem("shopify_token", token);
    //   router.push("/account");
    // } else if (afterRegister) {
    //   setMode("LOGIN");
    //   setError("root", { message: "AUTHENTICATION_PROBLEM" });
    // } else {
    //   setError("root", { message: loginError ? "LOGIN_ERROR" : "GENERIC" });
    // }
  } catch {
    setError("root", { message: "GENERIC" });
  }
}