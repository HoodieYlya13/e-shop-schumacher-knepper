import { getServerCookie } from './shared/getServerCookie';

export async function getCustomerIp(): Promise<string | undefined> {
  return getServerCookie('customer_ip');
}