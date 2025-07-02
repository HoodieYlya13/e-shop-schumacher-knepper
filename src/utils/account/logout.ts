"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function logout(router?: AppRouterInstance, redirectTo = "/") {
  localStorage.removeItem("shopify_token");
  localStorage.removeItem("shopify_token_expiry");
  
  if (router) {
    router.push(redirectTo);
  }
}