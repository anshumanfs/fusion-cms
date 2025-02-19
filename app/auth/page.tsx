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
    <div className="flex h-screen">
      <div className="m-auto">
        <Logo width={120} height={120} />
        <span className="text-3xl mx-auto">Fusion CMS</span>
        <br />
        <span>The Most Advanced and Generic Headless-CMS</span>
      </div>
      <Card className="m-auto">
        <Tabs className="w-[400px]" value={activeTab}>
          <CardHeader>
            <TabsList>
              <TabsTrigger value="register" className="w-1/3" onClick={() => handleTabChange('register')}>
                Register
              </TabsTrigger>
              <TabsTrigger value="login" className="w-1/3" onClick={() => handleTabChange('login')}>
                Login
              </TabsTrigger>
              <TabsTrigger value="reset" className="w-1/3" onClick={() => handleTabChange('reset')}>
                Reset
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <TabsContent value="register">
            <Signup />
          </TabsContent>
          <TabsContent value="login">
            <Login />
          </TabsContent>
          <TabsContent value="reset">
            <ResetPassword />
          </TabsContent>
        </Tabs>
      </Card>
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
