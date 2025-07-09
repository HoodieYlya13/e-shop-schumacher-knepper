import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const res = intlMiddleware(req);

  const supportedLocales = ['fr', 'en', 'de'];

  const hasPreferredLocale = req.cookies.get('preferred_locale');

  if (!hasPreferredLocale) {
    const acceptLang = req.headers.get('accept-language');
    const browserLocale = acceptLang
      ?.split(',')[0]
      ?.split('-')[0]
      ?.trim();

    if (browserLocale && supportedLocales.includes(browserLocale)) {
      res.cookies.set('preferred_locale', browserLocale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    }
  }

  const ipCookie = req.cookies.get("buyer_ip");
  const countryCookie = req.cookies.get("buyer_country");

  if (!ipCookie || !countryCookie) {
      try {
        const geoRes = await fetch(`https://ipinfo.io/json`);
        const geo = await geoRes.json();   

        res.cookies.set("buyer_ip", geo.ip ?? "unknown", {
          path: "/",
          maxAge: 60 * 60 * 24,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        res.cookies.set("buyer_country", geo.country ?? "unknown", {
          path: "/",
          maxAge: 60 * 60 * 24,
          httpOnly: false,
          sameSite: "lax",
        });
      } catch (error) {
        console.warn("Failed to fetch IP info:", error);
      }
  }

  const url = new URL(req.url);
  const resetPasswordUrl = url.searchParams.get("reset_password_url");

  const resetPasswordMode = resetPasswordUrl !== null;

  res.cookies.set(
    "initial_auth_mode",
    resetPasswordMode
      ? resetPasswordUrl
        ? "RESET_PASSWORD"
        : "PASSWORD_RECOVERY"
      : "",
    {
      path: "/",
      maxAge: resetPasswordMode ? 60 * 10 : 0,
      httpOnly: false,
      sameSite: "lax",
    }
  );

  res.cookies.set("reset_password_url", resetPasswordUrl || "", {
    path: "/",
    maxAge: resetPasswordMode ? 60 * 10 : 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

    return res;
  }

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};