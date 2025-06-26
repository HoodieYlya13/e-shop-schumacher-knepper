"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function logout(router: AppRouterInstance, redirectTo = "/") {
  localStorage.removeItem("shopify_token");
  router.push(redirectTo);
}