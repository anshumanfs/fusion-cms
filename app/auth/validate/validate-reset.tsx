'use client';
import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import axios from '@/lib/axios';

export function ValidateReset() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const resetBtn = React.useRef(null as any);
  const [resetBtnText, setResetBtnText] = React.useState('Change Password' as any);
  const router = useRouter();
  const [formState, setFormState] = React.useState({
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    resetBtn.current.setAttribute('disabled', 'true');
    setResetBtnText(
      <>
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Changing Password...
      </>
    );
    if (formState.password !== formState.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Password not matching',
        description: 'Please make sure the password and confirm password are the same',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      resetBtn.current.removeAttribute('disabled');
      setResetBtnText('Change Password');
      return;
    }
    const data = JSON.stringify({
      query: `mutation ForgotPassword($uniqueCode: String!, $password: String!) {
        forgotPassword(uniqueCode: $uniqueCode, password: $password) {
          message
        }
      }`,
      variables: {
        uniqueCode: searchParams.get('token'),
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
            title: 'Failed!',
            description: errors[0].message,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          resetBtn.current.removeAttribute('disabled');
          setResetBtnText('Change Password');
          return;
        }
        toast({
          variant: 'default',
          title: 'Success!',
          description: 'Password reset successful',
        });
        setTimeout(() => {
          router.push('/auth?tab=login');
        }, 2000);
      })
      .catch((err) => {
        toast({
          variant: 'destructive',
          title: 'Failed',
          description: 'Failed to reset password',
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        resetBtn.current.removeAttribute('disabled');
        setResetBtnText('Change Password');
      });
  };

  const handleValueChange = (e: any) => {
    setFormState((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    return;
  };
  return (
    <div className="flex h-screen">
      <div className="m-auto flex items-center space-x-2">
        <Card className="m-auto w-fit lg:w-[500px] xl:w-[500px]">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              <span className="text-sm">Fill details below to reset your password</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="registrationForm" className="p-4" onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="framework">New Password</Label>
                  <Input id="password" type="password" placeholder="" onChange={handleValueChange} />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="framework">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="" onChange={handleValueChange} />
                </div>
                <div className="flex flex-col space-y-2">
                  <Button className="w-full space-x-2" ref={resetBtn} type="submit">
                    {resetBtnText}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
