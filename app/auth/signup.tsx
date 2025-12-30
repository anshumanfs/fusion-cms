'use client';
import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, User, Ticket } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from '@/lib/axios';

export function Signup() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const signUpBtn = React.useRef(null as any);
  const [signUpBtnText, setSignUpBtnText] = React.useState('Create Account' as any);
  const [formState, setFormState] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
    inviteCode: '' as any,
  });
  const [registrationStatus, setRegistrationStatus] = React.useState({});

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setRegistrationStatus({
      status: 'loading',
      message: 'Creating your account...',
    });
    signUpBtn.current.setAttribute('disabled', 'true');
    setSignUpBtnText(
      <>
        <Loader2 className="h-5 animate-spin mr-2" /> Creating account...
      </>
    );
    if (formState.password !== formState.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Password not matching',
        description: 'Please make sure the password and confirm password are the same',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      signUpBtn.current.removeAttribute('disabled');
      setSignUpBtnText('Create Account');
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
      setSignUpBtnText('Create Account');
      return;
    }
    const data = JSON.stringify({
      query: `mutation RegisterUser($email: String!, $firstName: String!, $lastName: String!, $password: String! ${
        formState.inviteCode ? ', $inviteCode: String' : ''
      }) {
        registerUser(email: $email, firstName: $firstName, lastName: $lastName, password: $password ${
          formState.inviteCode ? ', inviteCode: $inviteCode' : ''
        }) {
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
        ...(formState.inviteCode ? { inviteCode: formState.inviteCode } : {}),
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
        setSignUpBtnText('Create Account');
        return;
      }
      setFormState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
        inviteCode: null,
      });
      signUpBtn.current.removeAttribute('disabled');
      setSignUpBtnText('Create Account');
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

  React.useEffect(() => {
    const inviteCode = searchParams.get('inviteCode');
    console.log('inviteCode', inviteCode);
    if (inviteCode) {
      setFormState({
        ...formState,
        inviteCode,
      });
    }
  }, []);

  return (
    <form id="registrationForm" className="p-1" onSubmit={handleSubmit}>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-2">
          <Label className="text-muted-foreground/80">Full Name</Label>
          <div className="flex w-full items-center space-x-2">
            <div className="relative w-full">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                type="text"
                placeholder="First Name"
                onChange={handleValueChange}
                className="pl-10 h-10 bg-muted/50 border-input/50"
              />
            </div>
            <div className="relative w-full">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="lastName"
                type="text"
                placeholder="Last Name"
                onChange={handleValueChange}
                className="pl-10 h-10 bg-muted/50 border-input/50"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="email" className="text-muted-foreground/80">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              onChange={handleValueChange}
              className="pl-10 h-10 bg-muted/50 border-input/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="password" className="text-muted-foreground/80">
              Password
            </Label>
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
          <div className="flex flex-col space-y-2">
            <Label htmlFor="confirmPassword" className="text-muted-foreground/80">
              Confirm
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                onChange={handleValueChange}
                className="pl-10 h-10 bg-muted/50 border-input/50"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="inviteCode" className="text-muted-foreground/80">
            Invite Code <span className="text-xs text-muted-foreground opacity-50">(Optional)</span>
          </Label>
          <div className="relative">
            <Ticket className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="inviteCode"
              type="text"
              placeholder="INVITE-CODE"
              value={formState.inviteCode}
              onChange={handleValueChange}
              maxLength={8}
              className="pl-10 h-10 bg-muted/50 border-input/50 font-mono tracking-wider"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-2">
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
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
          >
            I agree to the <span className="text-primary hover:underline cursor-pointer">Terms</span> and{' '}
            <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
          </label>
        </div>

        <div className="flex flex-col space-y-2 mt-2">
          <Button className="w-full h-11 text-base shadow-lg shadow-primary/20" ref={signUpBtn} type="submit">
            {signUpBtnText}
          </Button>
        </div>
      </div>
    </form>
  );
}
