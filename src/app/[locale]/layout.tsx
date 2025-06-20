import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { shopifyServerFetch } from '@/lib/shopify/server';

const QUERY = `
  query {
    shop {
      name
    }
  }
`;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Disabling lint because of Next.js 15 types nonsense
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'HOME_PAGE' });
  const data = await shopifyServerFetch<{ shop: { name: string } }>(QUERY);

  return {
    title: t('META.TITLE', { name: data.shop.name }),
    description: t('META.DESCRIPTION', { name: data.shop.name }),
  };
}

// Disabling lint because of Next.js 15 types nonsense
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function LocaleLayout({ children, params }: any) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}