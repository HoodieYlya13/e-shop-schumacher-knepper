import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function logout(router?: AppRouterInstance, redirectTo = "/") {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (router) {
    router.push(redirectTo);
  }
}