import { getCookie } from './getCookie';

export async function getBuyerIp(): Promise<string | undefined> {
  return getCookie('buyer_ip');
}