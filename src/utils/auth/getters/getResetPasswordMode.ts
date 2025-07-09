export function getResetPasswordMode() {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("reset_password_mode="))
    ?.split("=")[1];
}