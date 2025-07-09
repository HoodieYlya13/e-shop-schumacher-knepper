import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function login(token: string, tokenExpiry: string, router?: AppRouterInstance, redirectTo?: string) {
  await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, tokenExpiry }),
  });

  if (router) {
    router.push(redirectTo || "/account");
  }
}