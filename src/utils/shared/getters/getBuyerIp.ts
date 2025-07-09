import { cookies } from 'next/headers';

export async function getBuyerIp(): Promise<string | undefined> {
  return (await cookies()).get('buyer_ip')?.value;
}