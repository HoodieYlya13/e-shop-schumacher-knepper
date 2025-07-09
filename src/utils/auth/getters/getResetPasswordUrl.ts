import { cookies } from "next/headers";

export async function getResetPasswordUrl(): Promise<string | undefined> {
  return (await cookies()).get("reset_password_url")?.value;
}