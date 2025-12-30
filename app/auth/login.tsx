'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToastAction } from '@/components/ui/toast';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from '@/lib/axios';

export function Login() {
  const { toast } = useToast();
  const logInBtn = React.useRef(null as any);
  const [logInBtnText, setLogInBtnText] = React.useState('Sign In' as any);
  const router = useRouter();
  const [formState, setFormState] = React.useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    logInBtn.current.setAttribute('disabled', 'true');
    setLogInBtnText(
      <>
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        Signing in...
      </>
    );
    const data = JSON.stringify({
      query: `mutation Login($email: String!, $password: String!, $rememberMe: Boolean) {
        login(email: $email, password: $password, rememberMe: $rememberMe) {
          token
          refreshToken
        }
      }`,
      variables: {
        email: formState.email,
        password: formState.password,
        rememberMe: formState.remember,
      },
    });
    axios
      .post('/appManager', data)
      .then((res) => {
        const { data, errors } = res.data;
        if (errors) {
          toast({
            variant: 'destructive',
            title: 'Login failed',
            description: errors[0].message,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          logInBtn.current.removeAttribute('disabled');
          setLogInBtnText('Sign In');
          return;
        }
        toast({
          variant: 'default',
          title: 'Login Successful!',
          description: 'You have successfully logged in',
        });
        localStorage.setItem('token', data.login.token);
        localStorage.setItem('refreshToken', data.login.refreshToken);
        router.push('/dashboard');
      })
      .catch((err) => {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: 'An error occurred while trying to login',
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        logInBtn.current.removeAttribute('disabled');
        setLogInBtnText('Sign In');
      });
  };

  const handleValueChange = (e: any) => {
    setFormState((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    return;
  };

  return (
    <form id="loginForm" className="p-1" onSubmit={handleSubmit}>
      <div className="grid w-full items-center gap-5">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="email" className="text-muted-foreground/80">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              placeholder="name@example.com"
              onChange={handleValueChange}
              className="pl-10 h-10 bg-muted/50 border-input/50"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-muted-foreground/80">
              Password
            </Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              onChange={handleValueChange}
              className="pl-10 h-10 bg-muted/50 border-input/50"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            onCheckedChange={() => {
              setFormState({
                ...formState,
                remember: !formState.remember,
              });
            }}
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
          >
            Remember me
          </label>
        </div>
        <div className="flex flex-col space-y-2 mt-2">
          <Button className="w-full h-11 text-base shadow-lg shadow-primary/20" ref={logInBtn} type="submit">
            {logInBtnText}
          </Button>
        </div>
      </div>
    </form>
  );
}
