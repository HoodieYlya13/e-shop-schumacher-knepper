import PageBuilder from "@/components/UI/PageBuilder/PageBuilder";
import Account from '@/components/Pages/Account/Account';
import { getAccessToken } from "@/utils/shared/getters/getAccessToken";
import { redirect } from "next/navigation";
import { fetchCustomerData } from "@/lib/services/customer";

export default async function AccountPage() {
  const token = await getAccessToken();
  if (!token) {
    redirect("/auth");
  }
  
  const customer = await fetchCustomerData(token);
  return (
    <PageBuilder>
      <Account customer={customer} />
    </PageBuilder>
  );
}