import { useState } from 'react';
import { LoginShell } from '@/features/login/components/Shell';
import { LoginError } from '@/features/login/components/Error';
import { LoginForm } from '@/features/login/components/Form';
import { LoginCard } from '@/features/login/components/Card';
import { useLogin } from '@/features/login/useLogin';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { submitLogin, isLoading, errorMessage } = useLogin();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitLogin({ email, password });
  }

  return (
    <LoginShell>
      <LoginCard>
        <LoginError message={errorMessage} />
        <LoginForm
          email={email}
          password={password}
          loading={isLoading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={onSubmit}
        />
      </LoginCard>
    </LoginShell>
  );
}
