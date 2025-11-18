import { UseFormSetError } from "react-hook-form";
import { LoginTestingModeValues } from "@/schemas/authTestingModeSchema";

export async function authTestingModeSubmitHandler(
  data: LoginTestingModeValues,
  clearErrors: () => void,
  setError: UseFormSetError<LoginTestingModeValues>,
) {
  try {
    clearErrors();
    
    const response = await fetch("/api/auth/testing-mode", {
      method: "POST",
      body: JSON.stringify({ ...data }),
    });
    
    const json = await response.json();

    if (json.ok) return window.location.href = "/";

    const message = json.error || "AUTHENTICATION_PROBLEM";

    if (message) return setError("root", { message });
  } catch {
    setError("root", { message: "GENERIC" });
  }
}