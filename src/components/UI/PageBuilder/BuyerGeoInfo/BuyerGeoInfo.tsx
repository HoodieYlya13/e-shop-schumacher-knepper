import { getBuyerIp } from '@/utils/shared/getters/getBuyerIp';
import GeoFallbackFetcher from './GeoFallbackFetcher';
import { getBuyerCountryServer } from '@/utils/shared/getters/getBuyerCountryServer';

export default async function BuyerGeoInfo() {
  const buyerIp = await getBuyerIp();
  const buyerCountry = await getBuyerCountryServer();

  if (!buyerIp || !buyerCountry) return <GeoFallbackFetcher />;

  return null;
}