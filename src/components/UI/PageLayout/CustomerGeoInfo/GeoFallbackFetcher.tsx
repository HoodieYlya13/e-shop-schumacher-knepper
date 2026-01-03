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
        let country = "unknown";
        if (typeof geo?.country === "string" && geo.country.length === 2)
          country = geo.country.toUpperCase();

          setClientCookie("customer_country", country, {
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