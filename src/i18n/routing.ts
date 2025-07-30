import { defineRouting } from 'next-intl/routing';
import { defaultLocale, SUPPORTED_LOCALES } from './utils';
 
export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
 
  defaultLocale: defaultLocale
});