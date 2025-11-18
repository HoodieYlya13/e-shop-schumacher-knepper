export async function login(customerAccessToken: string, tokenExpiry: string, redirectTo?: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerAccessToken,
      tokenExpiry,
      redirectTo,
      checkoutUrlPath: new URLSearchParams(window.location.search).get(
        "checkout_url"
      ),
    }),
  });

  const data = await res.json();

  if (data.redirectUrl) window.location.href = data.redirectUrl;
}