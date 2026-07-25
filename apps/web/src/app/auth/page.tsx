import AuthPage from '@/components/AuthPage';

export default function AuthRoute({ searchParams }: { searchParams?: { mode?: string } }) {
  const mode = searchParams?.mode === 'register' ? 'register' : 'login';
  return <AuthPage initialMode={mode} />;
}
