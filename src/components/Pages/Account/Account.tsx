"use client";

import { Customer, Metafield } from "@shopify/hydrogen-react/storefront-api-types";

interface AccountProps {
  customer: Customer;
}

export default function Account({ customer }: AccountProps) {
  const validMetafields = customer.metafields.filter(
    (mf): mf is Exclude<Metafield, null> => mf !== null
  );

  return (
    <section className="max-w-lg mx-auto p-6 border rounded shadow space-y-4">
      <h1 className="text-2xl font-bold">Account Information</h1>

      <p>
        <strong>ID:</strong> {customer.id}
      </p>
      <p>
        <strong>Email:</strong> {customer.email}
      </p>
      <p>
        <strong>First Name:</strong> {customer.firstName ? customer.firstName : "Not provided"}
      </p>
      <p>
        <strong>Last Name:</strong> {customer.lastName ? customer.firstName : "Not provided"}
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