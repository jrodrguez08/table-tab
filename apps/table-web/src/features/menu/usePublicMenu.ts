import { useEffect, useMemo, useState } from 'react';
import { getJson } from '@/lib/http';
import type { PublicMenuResponse } from './types';

type State =
  | { status: 'idle' | 'loading'; data?: undefined; error?: undefined }
  | { status: 'success'; data: PublicMenuResponse; error?: undefined }
  | { status: 'error'; data?: undefined; error: Error & { status?: number } };

export function usePublicMenu(publicCode?: string) {
  const [state, setState] = useState<State>({ status: 'idle' });

  useEffect(() => {
    if (!publicCode) return;

    let cancelled = false;
    setState({ status: 'loading' });

    getJson<PublicMenuResponse>(`/public/tables/${encodeURIComponent(publicCode)}/menu`)
      .then((data) => {
        if (cancelled) return;
        setState({ status: 'success', data });
      })
      .catch((error: Error & { status?: number }) => {
        if (cancelled) return;
        setState({ status: 'error', error });
      });

    return () => {
      cancelled = true;
    };
  }, [publicCode]);

  const derived = useMemo(() => {
    if (state.status !== 'success') return null;

    const categories = [...state.data.categories].sort(
      (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
    );

    const products = [...state.data.products].sort((a, b) => {
      // opcional: si agregas sortOrder en Product
      const ao = a.sortOrder ?? 0;
      const bo = b.sortOrder ?? 0;
      if (a.categoryId !== b.categoryId)
        return (a.categoryId ?? '').localeCompare(b.categoryId ?? '');
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
