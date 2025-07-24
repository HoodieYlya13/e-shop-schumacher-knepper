export async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  });
  window.location.href = "https://i621t2-yy.myshopify.com/account/logout";
}