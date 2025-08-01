'use client';

import { setCustomerIp } from '@/utils/shared/setters/setCustomerIp';
import { setClientCookie } from '@/utils/shared/setters/shared/setClientCookie';
import { useEffect } from 'react';

export default function GeoFallbackFetcher() {
  useEffect(() => {
    fetch("https://ipinfo.io/json")
      .then((res) => res.json())
      .then((geo) => {
        if (geo?.ip) setCustomerIp(geo.ip);
        if (geo?.country)
          setClientCookie("customer_country", geo.country ?? "unknown", {
            path: "/",
            maxAge: 60 * 60 * 24,
            sameSite: "Lax",
          });
      })
      .catch((err) => {
        console.warn("GeoFallbackFetcher error:", err);
      });
  }, []);

  return null;
}