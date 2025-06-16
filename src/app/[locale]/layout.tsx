import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { getTranslations } from 'next-intl/server';
import React from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'HOME_PAGE' });

  return {
    title: t('META.TITLE'),
    description: t('META.DESCRIPTION'),
  };
}

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