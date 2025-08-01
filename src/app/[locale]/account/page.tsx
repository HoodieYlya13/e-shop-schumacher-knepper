import PageBuilder from "@/components/UI/PageBuilder/PageBuilder";
import Account from '@/components/Pages/Account/Account';
import { getCustomerAccessToken } from "@/utils/shared/getters/getCustomerAccessToken";
import { redirect } from "next/navigation";
import { fetchCustomerData } from "@/lib/services/store-front/customer";

export default async function AccountPage() {
  const customerAccessToken = await getCustomerAccessToken(true);
  if (!customerAccessToken) redirect("/auth");
  
  const customer = await fetchCustomerData(customerAccessToken);
  return (
    <PageBuilder>
      <Account customer={customer} />
    </PageBuilder>
  );
}