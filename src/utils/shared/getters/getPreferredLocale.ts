export function getPreferredLocale() {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("preferred_locale="))
    ?.split("=")[1];
}