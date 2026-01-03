import PageLayout from "@/components/UI/PageLayout/PageLayout";
import Account from "@/components/Pages/Account/Account";
import { getCustomerAccessToken } from "@/utils/shared/getters/getCustomerAccessToken";
import { redirect } from "next/navigation";
import { fetchCustomerData } from "@/lib/services/store-front/customer";

export default async function AccountPage() {
  const customerAccessToken = await getCustomerAccessToken(true);
  if (!customerAccessToken) redirect("/auth");

  const customer = await fetchCustomerData(customerAccessToken);
  if (!customer) redirect("/auth");
  return (
    <PageLayout>
      <Account customer={customer} />
    </PageLayout>
  );
}
