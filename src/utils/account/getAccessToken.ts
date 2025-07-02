import { logout } from "./logout";

export function getAccessToken() {
  const tokenExpiry = localStorage.getItem("shopify_token_expiry");
  const expiryDate = tokenExpiry ? new Date(tokenExpiry) : new Date();
  const now = new Date();
  const bufferMs = 24 * 60 * 60 * 1000;

  const tokenExpired = !tokenExpiry || (expiryDate.getTime() - now.getTime() < bufferMs);
  const token = localStorage.getItem('shopify_token');

  if (tokenExpired || !token) {
    logout();
    return null;
  }

  return token;
}