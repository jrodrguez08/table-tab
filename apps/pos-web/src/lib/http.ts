const API_URL = import.meta.env.VITE_API_URL as string | undefined;

function buildUrl(path: string) {
  if (!API_URL) throw new Error('Missing VITE_API_URL');
  return `${API_URL.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('pos.accessToken');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(text || res.statusText);
    // @ts-expect-error Error object does not have a status property
    err.status = res.status;
    throw err;
  }

  return (await res.json()) as T;
}

export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...getAuthHeader(),
    },
    signal,
  });

  return handleResponse<T>(res);
}

export async function postJson<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  signal?: AbortSignal,
): Promise<TResponse> {
  const res = await fetch(buildUrl(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(body),
    signal,
  });

  return handleResponse<TResponse>(res);
}
