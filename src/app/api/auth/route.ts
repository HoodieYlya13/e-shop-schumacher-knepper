import { NextRequest, NextResponse } from 'next/server';
import { createCustomerAccessToken, createCustomerAccount, recoverCustomerAccount, resetCustomerPasswordByUrl } from '@/lib/services/store-front/auth';
import { Mode } from '@/hooks/auth/useAuthForm';
import { getPreferredLocale } from '@/utils/shared/getters/getPreferredLocale';
import { LocaleLanguages } from '@/i18n/utils';

export async function POST(req: NextRequest) {
  const {
    mode,
    email,
    password,
    firstName,
    lastName,
    phone,
    acceptsMarketing,
    resetUrl,
  } = await req.json();

  if (!mode || !(mode as Mode)) return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  
  try {
    let response;

    switch (mode as Mode) {
      case 'REGISTER': {
        const locale = await getPreferredLocale() as LocaleLanguages;
        response = await createCustomerAccount(
          {
            email,
            password,
            firstName,
            lastName,
            phone,
            acceptsMarketing,
          },
          locale
        );
        break;
      }

      case 'LOGIN':
        response = await createCustomerAccessToken({ email, password });
        break;

      case 'PASSWORD_RECOVERY':
        response = await recoverCustomerAccount(email);
        break;

      case 'RESET_PASSWORD':
        response = await resetCustomerPasswordByUrl({ password, resetUrl });
        break;

      default:
        return NextResponse.json({ error: 'Unsupported mode' }, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}