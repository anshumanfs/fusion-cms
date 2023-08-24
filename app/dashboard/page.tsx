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

export default function Dashboard() {
  return (
    <>
      <Sidebar playlists={playlists} className="w-[20%]" />
    </>
  );
}
