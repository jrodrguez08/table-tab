export function LoginShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="tt-page tt-page-gradient flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
