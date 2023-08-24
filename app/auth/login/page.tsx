'use client';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  return (
    <div className="flex h-screen">
      <Card className="w-[480px] m-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-lg">Login</CardTitle>
          <CardDescription>Login to your fusion cms account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="framework">Email</Label>
                <Input id="email" placeholder="admin@fusion-cms.io" />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="framework">Password</Label>
                <Input id="password" type="password" placeholder="" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="w-full">LogIn</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
