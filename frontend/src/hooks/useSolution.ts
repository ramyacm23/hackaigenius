"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError, api } from "@/lib/api";
import type { Solution } from "@/lib/types";

const POLL_INTERVAL = 3000;
const ACTIVE_STATUSES = new Set(["PENDING", "PROCESSING"]);

export function useSolution(id: string) {
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchOnce = useCallback(async () => {
    try {
      const data = await api.getSolution(id);
      setSolution(data);
      setError(null);
      return data.status;
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to load solution";
      setError(message);
      return "FAILED";
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      const status = await fetchOnce();
      if (cancelled) return;
      if (ACTIVE_STATUSES.has(status)) {
        timerRef.current = setTimeout(poll, POLL_INTERVAL);
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fetchOnce]);

  return { solution, loading, error, refetch: fetchOnce };
}
