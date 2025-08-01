import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { SUPPORTED_LOCALES } from './i18n/utils';
import { setMiddlewareCookie } from './utils/shared/setters/setServerCookie';
import { getMiddlewareCookie } from './utils/shared/getters/getServerCookie';

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const res = intlMiddleware(req);

  const hasPreferredLocale = getMiddlewareCookie(res, "preferred_locale");

  if (!hasPreferredLocale) {
    const acceptLang = req.headers.get("accept-language");
    const browserLocale = acceptLang?.split(",")[0]?.split("-")[0]?.trim();
    const isSupportedLocale =
      browserLocale &&
      (SUPPORTED_LOCALES as readonly string[]).includes(browserLocale);

    if (isSupportedLocale)
      setMiddlewareCookie(res, "preferred_locale", browserLocale);
  }

  const url = new URL(req.url);
  const resetPasswordUrl = url.searchParams.get("reset_password_url");

  const resetPasswordMode = resetPasswordUrl !== null;

  setMiddlewareCookie(res, "initial_auth_mode", resetPasswordMode
    ? resetPasswordUrl
      ? "RESET_PASSWORD"
      : "PASSWORD_RECOVERY"
    : "", {
    httpOnly: false,
    sameSite: "lax",
    maxAge: resetPasswordMode ? 60 * 10 : 0,
  });

  setMiddlewareCookie(res, "reset_password_url", resetPasswordUrl || "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: resetPasswordMode ? 60 * 10 : 0,
  });

  if (url.pathname.endsWith("/account/login")) {
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};