export function getPreferredLocale(toUpperCase = false) {
  if (typeof document === 'undefined') return undefined;

  const preferredLocale = document.cookie
    .split("; ")
    .find((row) => row.startsWith("preferred_locale="))
    ?.split("=")[1];

  return toUpperCase && preferredLocale
    ? preferredLocale.toUpperCase()
    : preferredLocale;
}