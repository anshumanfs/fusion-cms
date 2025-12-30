'use client';
import * as React from 'react';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader } from '@/components/ui/card';
import Logo from '@/components/ui/logo';
import { Login } from './login';
import { Signup } from './signup';
import { ResetPassword } from './resetPassword';

const AuthContent = () => {
  const [activeTab, setActiveTab] = React.useState('register'); // Default tab
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  React.useEffect(() => {
    if (tab === 'login' || tab === 'register' || tab === 'reset') {
      setActiveTab(tab);
    } else {
      router.push('/404');
    }
  }, [tab, router]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    router.push(`/auth?tab=${newTab}`);
  };

  return (
    <div className="flex min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Decoration Side */}
      <div className="hidden bg-muted lg:block relative overflow-hidden">
        {/* Background Base */}
        <div className="absolute inset-0 bg-[#0f0f12] border-r border-white/5" />

        {/* Abstract Gradients/Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="absolute bottom-[0%] right-[0%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[100px]" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 grid-bg opacity-[0.15]" />

        {/* Content */}
        <div className="relative z-20 flex flex-col h-full justify-between p-12 text-white/90">
          <div className="flex items-center text-xl font-bold tracking-tight text-white">
            <div className="mr-3 rounded-lg bg-white/10 p-1 backdrop-blur">
              <Logo width={32} height={32} />
            </div>
            Fusion CMS
          </div>
          <div className="space-y-6 max-w-md">
            <blockquote className="space-y-4">
              <p className="text-2xl font-medium leading-normal text-white">
                &ldquo;This library has saved me countless hours. The flexibility and speed it provides is
                unmatched.&rdquo;
              </p>
              <footer className="flex items-center gap-4 pt-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-violet-500 to-blue-500" />
                <div>
                  <div className="font-semibold text-white">Sofia Davis</div>
                  <div className="text-sm text-zinc-400">CTO at TechCorp</div>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto w-full max-w-[450px] space-y-6">
          <div className="flex flex-col space-y-2 text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              {activeTab === 'login' && 'Welcome back'}
              {activeTab === 'register' && 'Create an account'}
              {activeTab === 'reset' && 'Reset Password'}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === 'login' && 'Enter your email to sign in to your account'}
              {activeTab === 'register' && 'Enter your email below to create your account'}
              {activeTab === 'reset' && 'Enter your email to receive a reset link'}
            </p>
          </div>

          <Tabs value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-11 mb-6">
              <TabsTrigger value="register" onClick={() => handleTabChange('register')}>
                Register
              </TabsTrigger>
              <TabsTrigger value="login" onClick={() => handleTabChange('login')}>
                Login
              </TabsTrigger>
              <TabsTrigger value="reset" onClick={() => handleTabChange('reset')}>
                Reset
              </TabsTrigger>
            </TabsList>

            <Card className="border-0 shadow-none bg-transparent">
              <TabsContent value="register" className="mt-0">
                <Signup />
              </TabsContent>
              <TabsContent value="login" className="mt-0">
                <Login />
              </TabsContent>
              <TabsContent value="reset" className="mt-0">
                <ResetPassword />
              </TabsContent>
            </Card>
          </Tabs>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Auth() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
