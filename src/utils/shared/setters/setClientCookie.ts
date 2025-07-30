export function setClientCookie(
  name: string,
  value: string,
  options: {
    path?: string;
    maxAge?: number;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
  } = {}
) {
  let cookieStr = `${name}=${encodeURIComponent(value)}`;

  if (options.path) cookieStr += `; path=${options.path}`;
  if (options.maxAge) cookieStr += `; max-age=${options.maxAge}`;
  if (options.secure) cookieStr += `; secure`;
  if (options.sameSite) cookieStr += `; SameSite=${options.sameSite}`;

  document.cookie = cookieStr;
}