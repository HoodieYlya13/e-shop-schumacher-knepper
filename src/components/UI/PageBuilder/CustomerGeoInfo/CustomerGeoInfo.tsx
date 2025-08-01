import { getCustomerIp } from '@/utils/shared/getters/getCustomerIp';
import GeoFallbackFetcher from './GeoFallbackFetcher';
import { getCustomerCountryServer } from '@/utils/shared/getters/getCustomerCountryServer';

export default async function CustomerGeoInfo() {
  const customerIp = await getCustomerIp();
  const customerCountry = await getCustomerCountryServer();

  if (!customerIp || !customerCountry) return <GeoFallbackFetcher />;

  return null;
}