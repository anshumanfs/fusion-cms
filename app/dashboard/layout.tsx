'use client';
import React from 'react';
import { SideBar } from './sideBar';
import { ModeToggle } from '@/components/themeToggle';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="w-64 flex-shrink-0 border-r">
        <SideBar className="h-full" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col h-full">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
            <div className="flex-1" />
            <ModeToggle />
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
