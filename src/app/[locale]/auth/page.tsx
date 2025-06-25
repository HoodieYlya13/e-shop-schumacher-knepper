'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ModeSwitch from '@/components/Auth/ModeSwitch';
import SubmitButton from '@/components/Auth/SubmitButton';
import SignUp from '@/components/Auth/SignUp';
import SignIn from '@/components/Auth/SignIn';

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

  const fieldTouched = (name: string) => touched[name] || submitted;

  return (
    <main className="max-w-lg mx-auto p-6 space-y-6 border rounded shadow">
      <h1 className="text-2xl font-bold">{t(mode)}</h1>

      <ModeSwitch mode={mode} setMode={setMode} setApiErrors={setApiErrors} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "REGISTER" && (
          <SignUp
            email={email}
            setEmail={setEmail}
            confirmEmail={confirmEmail}
            setConfirmEmail={setConfirmEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            phone={phone}
            setPhone={setPhone}
            acceptsMarketing={acceptsMarketing}
            setAcceptsMarketing={setAcceptsMarketing}
            setTouched={setTouched}
            isFieldInvalid={isFieldInvalid}
            fieldTouched={fieldTouched}
            isPhoneValid={isPhoneValid}
            isPasswordValid={isPasswordValid}
            isEmailMatch={isEmailMatch}
            isPasswordMatch={isPasswordMatch}
            apiErrors={apiErrors}
            errorValues={errorValues}
          />
        )}

        {mode === "LOGIN" && (
          <SignIn
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
        )}

        <SubmitButton
          disabled={!isFormValid || isBlockedByApiError}
          label={mode === "REGISTER" ? t("CREATE_ACCOUNT") : t("LOGIN")}
          isBlockedByApiError={isBlockedByApiError}
        />

        {apiErrors.loginErrorMessage && (
          <p className="text-red-600">{t(`ERRORS.${apiErrors.loginErrorMessage}`)}</p>
        )}

        {apiErrors.generic && (
          <p className="text-red-600">{t(`ERRORS.${apiErrors.generic}`)}</p>
        )}
      </form>
    </main>
  );
}