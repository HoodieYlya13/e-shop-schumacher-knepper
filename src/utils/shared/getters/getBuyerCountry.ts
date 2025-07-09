export function getBuyerCountry() {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('buyer_country='))
    ?.split('=')[1];
}