'use client';
import * as React from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/ui/logo';
export default function Login() {
  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <Logo width={120} height={120} />
        <span className="text-3xl mx-auto">Fusion CMS</span>
        <br />
        <span>The Most Advanced and Generic Headless-CMS</span>
      </div>
      <Card className="w-[480px] m-auto ">
        <CardHeader>
          <CardTitle>Register Admin</CardTitle>
          <CardDescription>Start by creating the admin user for your project</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="framework">Name</Label>
              <div className="flex w-full items-center space-x-2">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="framework">Email</Label>
                <Input id="email" placeholder="admin@fusion-cms.io" />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="framework">Password</Label>
                <Input id="password" type="password" placeholder="" />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="framework">Confirm Password</Label>
                <Input id="password" type="password" placeholder="" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Agree to the terms and conditions
                </label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="w-full">Let&apos;s Get Started</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
