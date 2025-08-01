import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { SUPPORTED_LOCALES } from './i18n/utils';
import { setMiddlewareCookie } from './utils/shared/setters/setServerCookie';

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const res = intlMiddleware(req);

  const hasPreferredLocale = req.cookies.get("preferred_locale");

  if (!hasPreferredLocale) {
    const acceptLang = req.headers.get("accept-language");
    const browserLocale = acceptLang?.split(",")[0]?.split("-")[0]?.trim();
    const isSupportedLocale =
      browserLocale &&
      (SUPPORTED_LOCALES as readonly string[]).includes(browserLocale);

    if (isSupportedLocale)
      setMiddlewareCookie(res, "preferred_locale", browserLocale);
  }

  const ipCookie = req.cookies.get("buyer_ip");
  const countryCookie = req.cookies.get("buyer_country");

  if (!ipCookie || !countryCookie) {
    try {
      const forwarded = req.headers.get("x-forwarded-for");
      const ip = forwarded?.split(",")[0] ?? "unknown";

      const geoRes = await fetch(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN}`);
      const geo = await geoRes.json();

      setMiddlewareCookie(res, "buyer_ip", geo.ip ?? "unknown", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      });

      setMiddlewareCookie(res, "buyer_country", geo.country ?? "unknown", {
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      });
    } catch (error) {
      console.warn("Failed to fetch IP info:", error);
    }
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