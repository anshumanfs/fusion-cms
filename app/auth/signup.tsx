'use client';
import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/axios';

export function Signup() {
  const { toast } = useToast();
  const signUpBtn = React.useRef(null as any);
  const [signUpBtnText, setSignUpBtnText] = React.useState('Let\'s Get Started' as any);
  const [formState, setFormState] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [registrationStatus, setRegistrationStatus] = React.useState({});

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setRegistrationStatus({
      status: 'loading',
      message: 'Creating your account...',
    });
    signUpBtn.current.setAttribute('disabled', 'true');
    setSignUpBtnText(<><Loader2 className="h-6 animate-spin mr-2" /> Creating your account...</>);
    if (formState.password !== formState.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Password not matching',
        description: 'Please make sure the password and confirm password are the same',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      signUpBtn.current.removeAttribute('disabled');
      setSignUpBtnText('Let\'s Get Started');
      return;
    }

    if (!formState.terms) {
      toast({
        variant: 'destructive',
        title: 'Terms not accepted',
        description: 'Please accept the terms and conditions',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      signUpBtn.current.removeAttribute('disabled');
      setSignUpBtnText('Let\'s Get Started');
      return;
    }
    const data = JSON.stringify({
      query: `mutation RegisterUser($email: String!, $firstName: String!, $lastName: String!, $password: String!) {
        registerUser(email: $email, firstName: $firstName, lastName: $lastName, password: $password) {
          email
          firstName
          lastName
          role
        }
      }`,
      variables: {
        email: formState.email,
        firstName: formState.firstName,
        lastName: formState.lastName,
        password: formState.password,
      },
    });
    axios.post('/appManager', data).then((res) => {
      const { data, errors } = res.data;
      if (errors) {
        toast({
          variant: 'destructive',
          title: 'Registration failed',
          description: errors[0].message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        signUpBtn.current.removeAttribute('disabled');
        setSignUpBtnText('Let\'s Get Started');
        return;
      }
      setFormState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
      });
      signUpBtn.current.removeAttribute('disabled');
      setSignUpBtnText('Let\'s Get Started');
      toast({
        variant: 'default',
        title: 'Registration Successful!',
        description: 'Please proceed to login to your account',
        action: (
          <Link href="/auth?tab=login">
            <ToastAction altText="Login">Login</ToastAction>
          </Link>
        ),
      });
      setTimeout(() => {
        window.location.href = '/auth?tab=login';
      }, 2000);
    });
  };

  const handleValueChange = (e: any) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    });
  };
  return (
    <form id="registrationForm" className="p-4" onSubmit={handleSubmit}>
      <div className="grid w-full items-center gap-4">
        <Label htmlFor="framework">Name</Label>
        <div className="flex w-full items-center space-x-2">
          <Input id="firstName" type="text" placeholder="First Name" onChange={handleValueChange} />
          <Input id="lastName" type="text" placeholder="Last Name" onChange={handleValueChange} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="framework">Email</Label>
          <Input id="email" type="email" placeholder="admin@fusion-cms.io" onChange={handleValueChange} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="framework">Password</Label>
          <Input id="password" type="password" placeholder="" onChange={handleValueChange} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="framework">Confirm Password</Label>
          <Input id="confirmPassword" type="password" placeholder="" onChange={handleValueChange} />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            onCheckedChange={() => {
              setFormState({
                ...formState,
                terms: !formState.terms,
              });
            }}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Agree to the terms and conditions
          </label>
        </div>
        <div className="flex flex-col space-y-2">
          <Button className="w-full space-x-2" ref={signUpBtn} type="submit">
            Let&apos;s Get Started
          </Button>
        </div>
      </div>
    </form>
  );
}
