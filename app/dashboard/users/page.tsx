'use client';
import { Label } from '@/components/ui/label';
import React from 'react';
import { UsersTable } from './usersTables';
import axios from '@/lib/axios';

export default function UsersPage() {
  return (
    <>
      <div className="container">
        <Label className="semi-bold text-xl">Users</Label>
        <div>
          <UsersTable />
        </div>
      </div>
    </>
  );
}
