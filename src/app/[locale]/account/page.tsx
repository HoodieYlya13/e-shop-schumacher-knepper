import PageBuilder from "@/components/UI/PageBuilder/PageBuilder";
import Account from '@/components/Pages/Account/Account';
import { getAccessToken } from "@/utils/shared/getters/getAccessToken";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const token = await getAccessToken();
  if (!token) {
    redirect("/auth");
  }
  return (
    <PageBuilder>
      <Account token={token} />
    </PageBuilder>
  );
}