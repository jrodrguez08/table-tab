const API_URL = import.meta.env.VITE_API_URL as string | undefined;

function buildUrl(path: string) {
  if (!API_URL) throw new Error('Missing VITE_API_URL');
  return `${API_URL.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`Request failed (${res.status}): ${text || res.statusText}`);
    // @ts-expect-error attach status for UI decisions
    err.status = res.status;
    throw err;
  }

  return (await res.json()) as T;
}
