"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Customer, Metafield } from "@shopify/hydrogen-react/storefront-api-types";
import { logout } from "@/utils/account/logoutHandler";
import { fetchCustomerData } from "@/utils/account/fetchCustomer";
import { useTranslations } from "next-intl";

export default function Account() {
  const t = useTranslations("AUTH");

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("shopify_token");
    if (!token) {
      setError("Not logged in");
      setLoading(false);
      return;
    }

    fetchCustomerData(token)
      .then(setCustomer)
      .catch(() => setError("GENERIC"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading customer data...</p>;
  if (error) return <p className="text-red-600">{t("ERRORS." + error)}</p>;
  if (!customer) return <p>No customer information available.</p>;

  const validMetafields = customer.metafields.filter(
    (mf): mf is Exclude<Metafield, null> => mf !== null
  );

  return (
    <section className="max-w-lg mx-auto p-6 border rounded shadow space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Account Information</h1>
        <button
          onClick={() => logout(router)}
          className="text-sm text-red-600 underline hover:text-red-800"
        >
          Log out
        </button>
      </div>

      <p>
        <strong>ID:</strong> {customer.id}
      </p>
      <p>
        <strong>Email:</strong> {customer.email}
      </p>
      <p>
        <strong>First Name:</strong> {customer.firstName}
      </p>
      <p>
        <strong>Last Name:</strong> {customer.lastName}
      </p>
      <p>
        <strong>Phone:</strong> {customer.phone ?? "Not provided"}
      </p>

      <section>
        <h2 className="text-xl font-semibold mt-6">Metafields</h2>
        {validMetafields.length === 0 ? (
          <p>No metafields set.</p>
        ) : (
          <ul className="list-disc pl-5">
            {validMetafields.map((mf) => (
              <li key={mf.id}>
                <strong>
                  {mf.namespace}:{mf.key}
                </strong>{" "}
                — {mf.value}
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}