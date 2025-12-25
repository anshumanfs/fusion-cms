'use client';
import React from 'react';
import { useAccessControl } from '@/app/auth/AccessControlContext';

interface AccessControlProps {
  appName: string;
  endPointName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AccessControl: React.FC<AccessControlProps> = ({ appName, endPointName, children, fallback = null }) => {
  const { canAccess, isLoading } = useAccessControl();

  // Optionally handle loading state if strictly needed
  // if (isLoading) return null; // or some skeleton

  if (canAccess(appName, endPointName)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
