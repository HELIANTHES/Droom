"use client";

import { useEffect, useState } from "react";
import { UTMParams } from "../types";

const UTM_KEYS: (keyof UTMParams)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

const STORAGE_KEY = "eht_utm_params";

export function useUTMParams(): UTMParams {
  const [params, setParams] = useState<UTMParams>({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlParams: Partial<UTMParams> = {};
    let hasUrlParams = false;

    for (const key of UTM_KEYS) {
      const value = searchParams.get(key);
      if (value) {
        urlParams[key] = value;
        hasUrlParams = true;
      }
    }

    if (hasUrlParams) {
      const stored = getStoredParams();
      const merged = { ...stored, ...urlParams } as UTMParams;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      setParams(merged);
    } else {
      setParams(getStoredParams());
    }
  }, []);

  return params;
}

function getStoredParams(): UTMParams {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
  };
}
