import { cookies } from "next/headers";

export async function getCookie(name: string): Promise<string | undefined> {
  return (await cookies()).get(name)?.value;
}