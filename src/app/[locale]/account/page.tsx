'use client';

import PageBuilder from '@/components/PageBuilder/PageBuilder';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Customer, Metafield } from '@shopify/hydrogen-react/storefront-api-types';

export default function AccountPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('shopify_token');
    router.push('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('shopify_token');
    if (!token) {
      setError('Not logged in');
      setLoading(false);
      return;
    }

    async function fetchCustomer() {
      try {
        const response = await fetch("/api/customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            identifiers: [
              { namespace: "Membership", key: "VIP level" },
              { namespace: "Membership", key: "startDate" },
              { namespace: "note", key: "preference" },
            ],
          }),
        });

        const json = await response.json();

        if (!response.ok || json.error) {
          setError(json.error || 'Failed to fetch customer');
          return;
        }

        setCustomer(json);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCustomer();
  }, []);

  if (loading) return <p>Loading customer data...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!customer) return <p>No customer information available.</p>;

  const validMetafields = customer.metafields.filter((mf): mf is Exclude<Metafield, null> => mf !== null);

  return (
    <PageBuilder>
      <section className="max-w-lg mx-auto p-6 border rounded shadow space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Account Information</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 underline hover:text-red-800"
          >
            Log out
          </button>
        </div>

        <p><strong>ID:</strong> {customer.id}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>First Name:</strong> {customer.firstName}</p>
        <p><strong>Last Name:</strong> {customer.lastName}</p>
        <p><strong>Phone:</strong> {customer.phone ?? 'Not provided'}</p>

        <section>
          <h2 className="text-xl font-semibold mt-6">Metafields</h2>
          {validMetafields.length === 0 ? (
            <p>No metafields set.</p>
          ) : (
            <ul className="list-disc pl-5">
              {validMetafields.map((mf) => (
                <li key={mf.id}>
                  <strong>{mf.namespace}:{mf.key}</strong> — {mf.value}
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </PageBuilder>
  );
}