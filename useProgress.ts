/**
 * hooks/useProgress.ts
 *
 * Custom hook that fetches the current user's progress data from /api/progress.
 * Returns the data, loading state, error, and a manual refetch function.
 */
'use client';

import { useCallback, useEffect, useState } from 'react';

import type { ProgressData } from '@/types';

interface UseProgressReturn {
  data: ProgressData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProgress(): UseProgressReturn {
  const [data, setData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/progress', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Include credentials so NextAuth session cookie is sent
        credentials: 'include',
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Request failed with status ${response.status}`);
      }

      const json = (await response.json()) as ProgressData;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { data, isLoading, error, refetch: fetchProgress };
}

export default useProgress;
