'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import axios from '@/lib/axios';

export function Login() {
  const { toast } = useToast();
  const router = useRouter();
  const [formState, setFormState] = React.useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = JSON.stringify({
      query: `mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          refreshToken
        }
      }`,
      variables: {
        email: formState.email,
        password: formState.password,
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
      });
  };

  const handleValueChange = (e: any) => {
    setFormState((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    return;
  };

  return (
    <form id="loginForm" className="p-4" onSubmit={handleSubmit}>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="framework">Email</Label>
          <Input id="email" placeholder="admin@fusion-cms.io" onChange={handleValueChange} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="framework">Password</Label>
          <Input id="password" type="password" placeholder="" onChange={handleValueChange} />
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
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>
        <div className="flex flex-col space-y-2">
          <Button className="w-full" type="submit">
            LogIn
          </Button>
        </div>
      </div>
    </form>
  );
}
