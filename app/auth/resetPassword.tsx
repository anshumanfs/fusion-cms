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
import Link from 'next/link';

export function ResetPassword() {
  const { toast } = useToast();
  const router = useRouter();
  const [formState, setFormState] = React.useState({
    email: '',
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = JSON.stringify({
      query: `mutation RequestPasswordChangeEmail($email: String!) {
                requestPasswordChangeEmail(email: $email) {
                    message
                }
            }`,
      variables: {
        email: formState.email,
      },
    });
    axios
      .post('/appManager', data)
      .then((res) => {
        const { data, errors } = res.data;
        alert(JSON.stringify(res.data));
        if (errors) {
          toast({
            variant: 'destructive',
            title: 'Failed!',
            description: errors[0].message,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          return;
        }
        toast({
          variant: 'default',
          title: 'Sent!',
          description: 'A password reset link has been sent to your email',
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
          <Button className="w-full" type="submit">
            Send Reset Link
          </Button>
        </div>
      </div>
    </form>
  );
}
