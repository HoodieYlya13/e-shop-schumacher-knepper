import { cookies } from "next/headers";

export async function getPreferredLocale(toUpperCase = false) {
  const locale = (await cookies()).get("preferred_locale")?.value;
  return toUpperCase ? locale?.toUpperCase() : locale;
}