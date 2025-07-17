import { getAccessToken } from "@/utils/shared/getters/getAccessToken";
import Navigation from "./shared/Navigation";
import Logout from "./shared/Logout";
import LanguageSwitcher from "./shared/LanguageSwitcher";
import ShoppingCart from "./shared/ShoppingCart";

export default async function NavBar() {
  const token = await getAccessToken();
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <Navigation token={token} />
      {token && <Logout />}
      <LanguageSwitcher />
      <ShoppingCart />
    </header>
  );
}