'use client';
import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AvatarIcon, LockClosedIcon } from '@radix-ui/react-icons';
import Logo from '@/components/ui/logo';
import { AddDatabase } from './forms/addDatabase';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const elementStatesInitial: any = {
  databases: {
    variant: 'secondary',
    route: '/databases',
  },
  schemas: {
    variant: 'ghost',
    route: '/schemas',
  },
  users: {
    variant: 'ghost',
    route: '/users',
  },
  accesses: {
    variant: 'ghost',
    route: '/users',
  },
};

export function SideBar({ className }: SidebarProps) {
  const [elementStates, setElementStates] = useState(elementStatesInitial);
  const router = useRouter();
  const pathname = usePathname();

  const detectRoute = () => {
    const elementStatesCopy = _.cloneDeep(elementStates);
    const url = window.location.href;
    Object.keys(elementStatesCopy).forEach((key) => {
      elementStatesCopy[key].variant = 'ghost';
      if (url.includes(elementStatesCopy[key].route)) {
        elementStatesCopy[key].variant = 'secondary';
      }
    });
    setElementStates(elementStatesCopy);
  }

  const switchHandler = (component: any) => {
    const elementStatesCopy = _.cloneDeep(elementStates);
    Object.keys(elementStatesCopy).forEach((key) => {
      elementStatesCopy[key].variant = 'ghost';
    });
    elementStatesCopy[component.target.value].variant = 'secondary';
    setElementStates(elementStatesCopy);
    router.push(`/dashboard/${component.target.value}`);
  };
  useEffect(() => {
    detectRoute();
  }, [pathname]);

  return (
    <div className={cn('pb-12', className)}>
      <div className="space-y-4 py-4">
        <Button variant="link" className="justify-start">
          <Logo width={45} height={45} />
          <Label className="text-lg font-semibold">Fusion CMS</Label>
        </Button>
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button
              variant={elementStates.databases.variant}
              className="w-full justify-start"
              value="databases"
              onClick={switchHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mr-2 h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                />
              </svg>
              Databases
            </Button>
            <Button
              variant={elementStates.schemas.variant}
              className="w-full justify-start"
              value="schemas"
              onClick={switchHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mr-2 h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              Schemas
            </Button>
            <Button
              variant={elementStates.users.variant}
              className="w-full justify-start"
              value="users"
              onClick={switchHandler}
            >
              <AvatarIcon className="mr-2 h-4 w-4" />
              Users
            </Button>
            <Button
              variant={elementStates.accesses.variant}
              className="w-full justify-start"
              value="accesses"
              onClick={switchHandler}
            >
              <LockClosedIcon className="mr-2 h-4 w-4" />
              Accesses
            </Button>
          </div>
        </div>
      </div>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Settings</h2>
        <div className="space-y-1">
          <AddDatabase buttonVariant="ghost" buttonClassName="w-full justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Add Database
          </AddDatabase>
          <Button variant="ghost" className="w-full justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
              />
            </svg>
            Update Database
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Remove Database
          </Button>
        </div>
      </div>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Schemas</h2>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Add Schema
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Update Schema
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Remove Schema
          </Button>
        </div>
      </div>
    </div>
  );
}
