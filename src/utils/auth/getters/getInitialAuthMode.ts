import { Mode } from "@/hooks/auth/useAuthForm";
import { cookies } from "next/headers";

export async function getInitialAuthMode() {
  return ((await cookies()).get("initial_auth_mode")?.value ?? "LOGIN") as Mode;
}