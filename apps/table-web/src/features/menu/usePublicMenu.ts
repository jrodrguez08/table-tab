import { useEffect, useMemo, useState } from 'react';
import { getJson } from '@/lib/http';
import type { PublicMenuResponse } from './types';

type State =
  | { status: 'idle'; data?: undefined; error?: undefined }
  | { status: 'loading'; data?: undefined; error?: undefined }
  | { status: 'success'; data: PublicMenuResponse; error?: undefined }
  | { status: 'error'; data?: undefined; error: Error & { status?: number } };

export function usePublicMenu(publicCode?: string) {
  const [state, setState] = useState<State>({ status: 'idle' });

  useEffect(() => {
    if (!publicCode) return;

    const controller = new AbortController();

    queueMicrotask(() => {
      setState({ status: 'loading' });
    });

    getJson<PublicMenuResponse>(
      `/public/tables/${encodeURIComponent(publicCode)}/menu`,
      controller.signal,
    )
      .then((data) => {
        if (controller.signal.aborted) return;
        setState({ status: 'success', data });
      })
      .catch((error: Error & { status?: number; name?: string }) => {
        if (controller.signal.aborted) return;
        if (error?.name === 'AbortError') return;
        setState({ status: 'error', error: error as Error & { status?: number } });
      });

    return () => controller.abort();
  }, [publicCode]);

  const derived = useMemo(() => {
    if (state.status !== 'success') return null;

    const categories = [...state.data.categories].sort(
      (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
    );

    const products = [...state.data.products].sort((a, b) => {
      if (a.categoryId !== b.categoryId)
        return (a.categoryId ?? '').localeCompare(b.categoryId ?? '');
      const ao = a.sortOrder ?? 0;
      const bo = b.sortOrder ?? 0;
      if (ao !== bo) return ao - bo;
      return a.name.localeCompare(b.name);
    });

    const productsByCategory = new Map<string, typeof products>();
    for (const p of products) {
      const key = p.categoryId ?? '__uncategorized__';
      const list = productsByCategory.get(key) ?? [];
      list.push(p);
      productsByCategory.set(key, list);
    }

    return { categories, products, productsByCategory };
  }, [state]);

  return { state, derived };
}
