export async function login(token: string, tokenExpiry: string, redirectTo?: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      tokenExpiry,
      redirectTo,
      checkoutUrl: new URLSearchParams(window.location.search).get(
        "checkout_url"
      ),
    }),
  });

  const data = await res.json();

  if (data.redirectUrl) {
    window.location.href = data.redirectUrl;
  }
}