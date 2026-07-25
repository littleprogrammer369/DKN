import AuthPage from '@/components/AuthPage';

export default function AuthRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[420px] mx-auto px-4 py-10">
        <AuthPage />
      </div>
    </div>
  );
}
