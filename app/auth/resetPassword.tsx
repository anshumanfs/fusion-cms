'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import axios from '@/lib/axios';

export function ResetPassword() {
    const { toast } = useToast();
    const [btnText, setBtnText] = React.useState('Send Reset Link' as any);
    const sendBtn = React.useRef(null as any);
    const [formState, setFormState] = React.useState({
        email: '',
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        sendBtn.current.setAttribute('disabled', 'true');
        setBtnText(<><Loader2 className="w-6 h-6 animate-spin mr-2" /> Sending Reset Link...</>);
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
                if (errors) {
                    toast({
                        variant: 'destructive',
                        title: 'Failed!',
                        description: errors[0].message,
                        action: <ToastAction altText="Try again">Try again</ToastAction>,
                    });
                    sendBtn.current.removeAttribute('disabled');
                    setBtnText('Send Reset Link');
                    return;
                }
                toast({
                    variant: 'default',
                    title: 'Sent!',
                    description: 'A password reset link has been sent to your email',
                });
                setTimeout(() => {
                    window.location.href = ('/auth?tab=login');
                }, 3000);
            })
            .catch((err) => {
                toast({
                    variant: 'destructive',
                    title: 'Login failed',
                    description: 'An error occurred while trying to login',
                    action: <ToastAction altText="Try again">Try again</ToastAction>,
                });
                sendBtn.current.removeAttribute('disabled');
                setBtnText('Send Reset Link');
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
                    <Button className="w-full" ref={sendBtn} type="submit">
                        {btnText}
                    </Button>
                </div>
            </div>
        </form>
    );
}
