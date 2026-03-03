import React, { useMemo, useState } from 'react';
import { AuthContext, TOKEN_KEY, type AuthContextValue } from '@/contexts/auth.context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      isAuthenticated: !!accessToken,
      login: (token: string) => {
        localStorage.setItem(TOKEN_KEY, token);
        setAccessToken(token);
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        setAccessToken(null);
      },
    }),
    [accessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
