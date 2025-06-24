'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const t = useTranslations('AUTH');
  const router = useRouter();

  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const [errorValues, setErrorValues] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<'REGISTER' | 'LOGIN'>('REGISTER');
  const [submitted, setSubmitted] = useState(false);

  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptsMarketing, setAcceptsMarketing] = useState(true);

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isPhoneValid = phone.trim() === '' || /^\+?[0-9]{7,15}$/.test(phone.trim());
  const isPasswordValid = password.length >= 5;
  const isEmailMatch = email === confirmEmail;
  const isPasswordMatch = password === confirmPassword;

  const isFormValid = mode === 'LOGIN'
    ? email && password
    : email && password && firstName && lastName && isPhoneValid && isPasswordValid && isEmailMatch && isPasswordMatch;

  const isFieldInvalid = (field: string): boolean => {
    if (field === "email") {
      return (
        (apiErrors.email === "EMAIL_TAKEN" && email === errorValues.email) ||
        (submitted && email.trim() === "")
      );
    }
    if (field === "phone") {
      return (
        (apiErrors.phone === "PHONE_TAKEN" && phone === errorValues.phone) ||
        (fieldTouched("phone") && !isPhoneValid)
      );
    }
    return false;
  };

  const isBlockedByApiError =
    (apiErrors.email === 'EMAIL_TAKEN' && email === errorValues.email) ||
    (apiErrors.phone === 'PHONE_TAKEN' && phone === errorValues.phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setApiErrors({});

    if (!isFormValid) return;

    if (
      (apiErrors.email === 'EMAIL_TAKEN' && email === errorValues.email) ||
      (apiErrors.phone === 'PHONE_TAKEN' && phone === errorValues.phone)
    ) {
      return;
    }

    const trimmedPhone = phone.trim();
    const requestBody: Record<string, any> = {
      mode,
      email,
      password,
      firstName,
      lastName,
      acceptsMarketing,
      ...(trimmedPhone && { phone: trimmedPhone }),
    };

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const json = await res.json();

      if (!res.ok) {
        setApiErrors({ generic: 'GENERIC' });
        return;
      }

      if (mode === 'LOGIN') {
        const loginError = json?.customerAccessTokenCreate?.customerUserErrors?.[0]?.message;
        const token = json?.customerAccessTokenCreate?.customerAccessToken?.accessToken;

        if (loginError) {
          setApiErrors({ loginErrorMessage: 'LOGIN_ERROR' });
        } else if (token) {
          localStorage.setItem('shopify_token', token);
          router.push('/account');
        } else {
          setApiErrors({ generic: 'GENERIC' });
        }

        return;
      }

      if (!json.customerCreate) {
        setApiErrors({ generic: 'GENERIC' });
        return;
      }
      
      const regErrors = json.customerCreate.customerUserErrors as {
        field: string[]; code: string;
      }[];
    
      const newErrors: Record<string, string> = {};
      const newValues: Record<string, string> = {};
    
      regErrors?.forEach(({ field, code }) => {
        const key = field?.[1];
        if (key === 'email') {
          newErrors.email = 'EMAIL_TAKEN';
          newValues.email = email;
        } else if (key === 'phone' && code === 'TAKEN') {
          newErrors.phone = 'PHONE_TAKEN';
          newValues.phone = phone;
        } else if (code) {
          newErrors.generic = code;
        }
      });
    
      setApiErrors(newErrors);
      setErrorValues(newValues);
    
      if (Object.keys(newErrors).length > 0) return;

      const loginRes = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ mode: 'LOGIN', email, password }),
      });

      const loginJson = await loginRes.json();
      const loginToken = loginJson?.customerAccessTokenCreate?.customerAccessToken?.accessToken;

      if (loginToken) {
        localStorage.setItem('shopify_token', loginToken);
        router.push('/account');
      } else {
        setMode('LOGIN');
        setApiErrors({ authentificationProblem: 'AUTHENTIFICATION_PROBLEM' });
      }

    } catch (err) {
      setApiErrors(err instanceof Error ? { generic: err.message } : { generic: 'GENERIC' });
    }
  };

  const inputClass = (invalid: boolean) =>
    `w-full p-2 border rounded ${invalid ? 'border-red-500' : ''}`;

  const fieldTouched = (name: string) => touched[name] || submitted;

  return (
    <main className="max-w-lg mx-auto p-6 space-y-6 border rounded shadow">
      <h1 className="text-2xl font-bold">{t(mode)}</h1>

      <div className="flex gap-4">
        <button
          onClick={() => {
            setMode("REGISTER");
            setApiErrors({});
          }}
          className={`px-4 py-2 rounded ${mode === "REGISTER" ? "bg-black text-white" : "bg-gray-200"}`}
        >
          {t("REGISTER")}
        </button>
        <button
          onClick={() => {
            setMode("LOGIN");
            setApiErrors({});
          }}
          className={`px-4 py-2 rounded ${mode === "LOGIN" ? "bg-black text-white" : "bg-gray-200"}`}
        >
          {t("LOGIN")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder={t("EMAIL")}
            required
            className={inputClass(isFieldInvalid("email"))}
          />
          {apiErrors.email === "EMAIL_TAKEN" && email === errorValues.email && (
            <p className="text-sm text-red-600">{t("ERRORS.EMAIL_TAKEN")}</p>
          )}
        </div>

        {mode === "REGISTER" && (
          <div>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirmEmail: true }))}
              placeholder={t("CONFIRM_EMAIL")}
              required
              className={inputClass(
                fieldTouched("confirmEmail") && !isEmailMatch
              )}
            />
            {fieldTouched("confirmEmail") && confirmEmail && !isEmailMatch && (
              <p className="text-sm text-red-600">
                {t("ERRORS.EMAIL_MISMATCH")}
              </p>
            )}
          </div>
        )}

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder={t("PASSWORD")}
            required
            className={inputClass(fieldTouched("password") && !isPasswordValid)}
          />
          {fieldTouched("password") && !isPasswordValid && (
            <p className="text-sm text-red-600">{t("ERRORS.TOO_SHORT")}</p>
          )}
        </div>

        {mode === "REGISTER" && (
          <>
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() =>
                  setTouched((t) => ({ ...t, confirmPassword: true }))
                }
                placeholder={t("CONFIRM_PASSWORD")}
                required
                className={inputClass(
                  fieldTouched("confirmPassword") && !isPasswordMatch
                )}
              />
              {fieldTouched("confirmPassword") &&
                confirmPassword &&
                !isPasswordMatch && (
                  <p className="text-sm text-red-600">
                    {t("ERRORS.PASSWORD_MISMATCH")}
                  </p>
                )}
            </div>

            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t("FIRST_NAME")}
              required
              className={inputClass(firstName.trim() === "" && submitted)}
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t("LAST_NAME")}
              required
              className={inputClass(lastName.trim() === "" && submitted)}
            />

            <div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                placeholder={`${t("PHONE")} (${t("OPTIONAL")})`}
                className={inputClass(isFieldInvalid("phone"))}
              />
              {apiErrors.phone === "PHONE_TAKEN" &&
                phone === errorValues.phone && (
                  <p className="text-sm text-red-600">
                    {t("ERRORS.PHONE_TAKEN")}
                  </p>
                )}
              {fieldTouched("phone") && !isPhoneValid && (
                <p className="text-sm text-red-600">{t("ERRORS.INVALID")}</p>
              )}
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={acceptsMarketing}
                onChange={(e) => setAcceptsMarketing(e.target.checked)}
              />
              <span>{t("ACCEPTS_MARKETING")}</span>
            </label>
          </>
        )}

        <button
          type="submit"
          disabled={!isFormValid || isBlockedByApiError}
          className={`w-full py-2 rounded ${
            !isFormValid || isBlockedByApiError
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-white"
          }`}
        >
          {mode === "REGISTER" ? t("CREATE_ACCOUNT") : t("LOGIN")}
        </button>

        {isBlockedByApiError && (
          <p className="text-sm text-red-500">
            {t("ERRORS.CORRECT_FIELDS_BEFORE_RESUBMIT")}
          </p>
        )}
      </form>

      {apiErrors.generic && (
        <p className="text-red-600">{t(`ERRORS.${apiErrors.generic}`)}</p>
      )}
    </main>
  );
}