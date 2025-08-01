export async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  });
  window.location.href = `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/account/logout`;
}