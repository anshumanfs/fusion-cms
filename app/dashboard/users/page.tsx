'use client';
import { Label } from '@/components/ui/label';
import React from 'react';
import { UsersTable } from './usersTables';
import axios from '@/lib/axios';

export default function UsersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
          <p className="text-sm text-muted-foreground">Manage user access and roles.</p>
        </div>
      </div>
      <UsersTable />
    </div>
  );
}
