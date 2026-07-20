"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "prism-active-workspace";

export function useWorkspaceSession() {
  const [hydrated, setHydrated] = useState(false);
  const [restoredSession, setRestoredSession] = useState(null);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) setRestoredSession(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  const save = useCallback((session) => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); } catch { /* Storage is optional. */ }
  }, []);

  const clear = useCallback(() => {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* Storage is optional. */ }
  }, []);

  return { hydrated, restoredSession, save, clear };
}
