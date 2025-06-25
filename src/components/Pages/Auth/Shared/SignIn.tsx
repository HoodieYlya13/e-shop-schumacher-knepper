import { useTranslations } from "next-intl";
import InputField from "./InputField";

interface SignInProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
}

export default function SignIn({
  email,
  setEmail,
  password,
  setPassword
}: SignInProps) {
  const t = useTranslations('AUTH');

    return (
      <>
        <InputField
          type="email"
          value={email}
          setter={setEmail}
          placeholder={t("EMAIL")}
        />

        <InputField
          type="password"
          value={password}
          setter={setPassword}
          placeholder={t("PASSWORD")}
        />
      </>
    );
}