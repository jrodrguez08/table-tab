import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { postJson } from '@/lib/http';
import type { LoginRequest } from './types';

type LoginResponse = { accessToken: string };

function getErrorMessage(error: unknown): string {
  const err = error as any;
  if (err?.status === 401) return 'Credenciales inválidas.';
  return err?.message || 'No se pudo iniciar sesión.';
}

export function useLogin() {
  const { login: setToken } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: LoginRequest) => postJson<LoginResponse, LoginRequest>('/auth/login', data),
    onSuccess: (data) => {
      setToken(data.accessToken);
      navigate('/platform', { replace: true });
    },
  });

  return {
    submitLogin: mutation.mutate,
    isLoading: mutation.isPending,
    errorMessage: mutation.error ? getErrorMessage(mutation.error) : null,
  };
}

export { getErrorMessage };
