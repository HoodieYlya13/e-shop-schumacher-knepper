import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { getTranslations } from "next-intl/server";
import React from "react";
import { getColorsConfig, getShopName } from "@/lib/services/store-front/shop";
import ThemeUpdater from "@/components/UI/PageLayout/ThemeUpdater";
import { LocaleLanguages } from "@/i18n/utils";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    locale: LocaleLanguages;
  };
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: { locale: LocaleLanguages };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HOME_PAGE" });

  const shopName = await getShopName();

  return {
    title: t("META.TITLE", { shopName }),
    description: t("META.DESCRIPTION", { shopName }),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  const colors = await getColorsConfig();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ThemeUpdater colors={colors}>{children}</ThemeUpdater>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
