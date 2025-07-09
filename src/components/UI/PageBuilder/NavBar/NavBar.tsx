import { getAccessToken } from "@/utils/shared/getters/getAccessToken";
import LanguageSwitcher from "./LanguageSwitcher";
import Navigation from "./Navigation";

export default async function NavBar() {
  const token = await getAccessToken();
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <Navigation token={token} />
      <LanguageSwitcher />
    </header>
  );
}