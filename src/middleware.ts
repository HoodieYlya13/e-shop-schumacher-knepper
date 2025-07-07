import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const intlResponse = intlMiddleware(req);

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-buyer-ip', ip);

  intlResponse.headers.set('x-buyer-ip', ip);

  return intlResponse;
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};