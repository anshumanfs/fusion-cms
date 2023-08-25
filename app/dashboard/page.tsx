'use client';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sidebar } from './sidenav';
import { playlists } from './playlist';
import { ModeToggle } from '@/components/themeToggle';
import DemoPage from './databases/page';
export default function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-3">
          <Sidebar playlists={playlists} />
        </div>
        <div className="col-span-9 mt-[10%]">
          <DemoPage />
        </div>
      </div>
    </>
  );
}
