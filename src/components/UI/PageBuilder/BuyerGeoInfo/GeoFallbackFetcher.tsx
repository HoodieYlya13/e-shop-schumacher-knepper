'use client';

import { setClientCookie } from '@/utils/shared/setters/setClientCookie';
import { useEffect } from 'react';

export default function GeoFallbackFetcher() {
  useEffect(() => {
    fetch("https://ipinfo.io/json")
      .then((res) => res.json())
      .then((geo) => {
        if (geo?.ip)
          setClientCookie("buyer_ip", geo.ip ?? "unknown", {
            path: "/",
            maxAge: 60 * 60 * 24,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
          });
        if (geo?.country)
          setClientCookie("buyer_country", geo.country ?? "unknown", {
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