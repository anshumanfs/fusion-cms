'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Logo from '@/components/ui/logo';
import { AddDatabase } from './forms/addDatabase';
import {
  Database,
  FileCode,
  Users,
  Lock,
  Settings,
  FileText,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const mainNavItems: SidebarItem[] = [
  { icon: <Database className="mr-2 h-4 w-4" />, label: 'Databases', href: '/dashboard/databases' },
  { icon: <FileCode className="mr-2 h-4 w-4" />, label: 'Schemas', href: '/dashboard/schemas' },
  { icon: <Users className="mr-2 h-4 w-4" />, label: 'Users', href: '/dashboard/users' },
  { icon: <Lock className="mr-2 h-4 w-4" />, label: 'Accesses', href: '/dashboard/accesses' },
];

export function SideBar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn('pb-12 h-screen border-r bg-card', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Link href="/dashboard" className="flex items-center pl-2 mb-6">
            <Logo width={40} height={40} />
            <span className="ml-2 text-xl font-bold tracking-tight">Fusion CMS</span>
          </Link>
          
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
            Database Management
          </h2>
          <div className="space-y-1">
            <AddDatabase buttonVariant="ghost" buttonClassName="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add Database
            </AddDatabase>
            <Button variant="ghost" className="w-full justify-start">
              <RefreshCw className="mr-2 h-4 w-4" />
              Update Database
            </Button>
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Database
            </Button>
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
            Schema Management
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add Schema
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <RefreshCw className="mr-2 h-4 w-4" />
              Update Schema
            </Button>
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Schema
            </Button>
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
            Help & Support
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Documentation
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
