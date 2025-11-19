import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { SUPPORTED_LOCALES } from './i18n/utils';
import { setMiddlewareCookie } from './utils/shared/setters/shared/setServerCookie';
import { getMiddlewareCookie } from './utils/shared/getters/shared/getServerCookie';

const intlMiddleware = createMiddleware(routing);

const redis = Redis.fromEnv();

function getLimiter(path: string) {
  if (path.startsWith("/api/auth/"))
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 s"),
    });

  if (path.startsWith("/api/checkout/"))
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 m"),
    });

  if (path.startsWith("/api/products/"))
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(200, "1 m"),
    });

  if (path.startsWith("/api/customer/"))
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(50, "30 s"),
    });

  if (path.startsWith("/api/"))
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
    });

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
  });
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const ip = getMiddlewareCookie(req, "customer_ip") || "127.0.0.1";
  
  let res: NextResponse = NextResponse.next();

  const isApiRoute = pathname.startsWith("/api/");

  const isTesting = process.env.NEXT_PUBLIC_TESTING_MODE === "true";

  if (isApiRoute) {
    const shouldLimit =
      isTesting
        ? pathname.startsWith("/api/auth/testing-mode")
        : true;
    
    if (shouldLimit) {
      const limiter = getLimiter(pathname);
      const key = `${pathname}-${ip}`;
      const { success } = await limiter.limit(key);

      if (!success)
        return NextResponse.json(
          { error: "TOO_MANY_REQUESTS" },
          { status: 429 }
        );
    }
  } else {
    res = intlMiddleware(req);

    if (isTesting) {
      const isAuthorized = getMiddlewareCookie(req, "isAuthorized");

      if (!pathname.endsWith("/auth-testing-mode") && !isAuthorized) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = "/auth-testing-mode";
        return NextResponse.redirect(redirectUrl);
      }
    }

    const hasPreferredLocale = getMiddlewareCookie(req, "preferred_locale");
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

    setMiddlewareCookie(
      res,
      "initial_auth_mode",
      resetPasswordMode
        ? resetPasswordUrl
          ? "RESET_PASSWORD"
          : "PASSWORD_RECOVERY"
        : "",
      {
        httpOnly: false,
        sameSite: "lax",
        maxAge: resetPasswordMode ? 60 * 10 : 0,
      }
    );

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
  }

  return res;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next|_vercel|.*\\..*).*)',
  ]
};