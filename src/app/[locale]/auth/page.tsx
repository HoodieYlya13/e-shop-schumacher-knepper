'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const t = useTranslations('AUTH');
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'REGISTER' | 'LOGIN'>('REGISTER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptsMarketing, setAcceptsMarketing] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({
          mode,
          email,
          password,
          firstName,
          lastName,
          phone,
          acceptsMarketing,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t('ERRORS.GENERIC'));

      if (mode === 'LOGIN') {
        const token = json?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
        if (token) {
          localStorage.setItem('shopify_token', token);
          router.push('/account');
        }
      } else {
        setMode('LOGIN');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('ERRORS.GENERIC'));
      }
    }
  };

  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <main className="max-w-lg mx-auto p-6 space-y-6 border rounded shadow">
      <h1 className="text-2xl font-bold">{t(mode)}</h1>

      <div className="flex gap-4">
        <button
          onClick={() => setMode('REGISTER')}
          className={`px-4 py-2 rounded ${mode === 'REGISTER' ? 'bg-black text-white' : 'bg-gray-200'}`}
        >
          {t('REGISTER')}
        </button>
        <button
          onClick={() => setMode('LOGIN')}
          className={`px-4 py-2 rounded ${mode === 'LOGIN' ? 'bg-black text-white' : 'bg-gray-200'}`}
        >
          {t('LOGIN')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('EMAIL')}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('PASSWORD')}
          required
          className="w-full p-2 border rounded"
        />

        {mode === 'REGISTER' && (
          <>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t('FIRST_NAME')}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t('LAST_NAME')}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={`${t('PHONE')} (${t('OPTIONAL')})`}
              className="w-full p-2 border rounded"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={acceptsMarketing}
                onChange={(e) => setAcceptsMarketing(e.target.checked)}
              />
              <span>{t('ACCEPTS_MARKETING')}</span>
            </label>
          </>
        )}

        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          {mode === 'REGISTER' ? t('CREATE_ACCOUNT') : t('LOGIN')}
        </button>
      </form>
    </main>
  );
}