'use client';
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/ui/logo';
import { Login } from './login';
import { Signup } from './signup';

export default function Auth() {
  const [activeTab, setActiveTab] = React.useState('');
  const router = useRouter();
  const authTabs = React.useRef({} as any);
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  React.useEffect(() => {
    if (tab === 'login') {
      setActiveTab('login');
      return;
    }
    if (tab === 'register') {
      setActiveTab('register');
      return;
    }
    router.push('/404');
  }, []);

  React.useEffect(() => {
    if (activeTab === 'login') {
      router.push('/auth?tab=login');
    }
    if (activeTab === 'register') {
      router.push('/auth?tab=register');
    }
  }, [activeTab, tab, router]);

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <Logo width={120} height={120} />
        <span className="text-3xl mx-auto">Fusion CMS</span>
        <br />
        <span>The Most Advanced and Generic Headless-CMS</span>
      </div>
      <Card className="m-auto" hidden={activeTab === ''}>
        <Tabs defaultValue="register" className="w-[400px]" ref={authTabs} value={activeTab}>
          <CardHeader>
            <TabsList>
              <TabsTrigger
                value="register"
                className="w-1/2"
                onClick={() => {
                  setActiveTab('register');
                }}
              >
                Register
              </TabsTrigger>
              <TabsTrigger
                value="login"
                className="w-1/2"
                onClick={() => {
                  setActiveTab('login');
                }}
              >
                Login
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <TabsContent value="register">
            <Signup />
          </TabsContent>
          <TabsContent value="login">
            <Login />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
