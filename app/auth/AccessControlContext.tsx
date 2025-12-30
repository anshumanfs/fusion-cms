'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '@/lib/axios';

interface AccessSchema {
  appName: string;
  endPointName: string;
  isAllowed: string;
  allowedInChain: boolean;
}

interface AccessControlContextType {
  canAccess: (appName: string, endPointName: string) => boolean;
  isLoading: boolean;
}

const AccessControlContext = createContext<AccessControlContextType>({
  canAccess: () => false,
  isLoading: true,
});

export const useAccessControl = () => useContext(AccessControlContext);

export const AccessControlProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessSchemas, setAccessSchemas] = useState<AccessSchema[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccessSchemas = async () => {
      try {
        // 1. Get user details to get email
        const userRes = await axios.post('/appManager', {
          query: `query {
            getOwnDetails {
              email
            }
          }`,
        });

        const email = userRes.data.data?.getOwnDetails?.email;

        if (!email) {
          console.warn('Could not fetch user email for access control');
          setIsLoading(false);
          return;
        }

        // 2. Get access schemas for this user
        const schemasRes = await axios.post('/appManager', {
          query: `query GetAccessSchemas($filter: JSON) {
                getAccessSchemas(filter: $filter) {
                    appName
                    endPointName
                    isAllowed
                    allowedInChain
                }
            }`,
          variables: {
            filter: { email },
          },
        });

        if (schemasRes.data.data?.getAccessSchemas) {
          setAccessSchemas(schemasRes.data.data.getAccessSchemas);
        }
      } catch (error) {
        console.error('Failed to fetch access schemas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccessSchemas();
  }, []);

  const canAccess = (appName: string, endPointName: string): boolean => {
    // Default to strict secure: if loading or no schemas, deny?
    // Or maybe optimistic?
    // Strategy:
    // 1. Find exact match
    // 2. If no match found -> what is default? Usually deny.
    // However, for existing apps without comprehensive schemas, this might break things.
    // Existing backend logic throws error if no schema found or isAllowed is false.
    // So frontend should probably mirror this: return false if not explicitly allowed.

    // BUT, existing `accessManager.ts` (backend) says:
    // "if isAllowed is false then access will be denied"
    // "if !accessSchema ... throw Errors.UNAUTHORIZED"
    // So backend denies by default. Frontend should too.

    const schema = accessSchemas.find((s) => s.appName === appName && s.endPointName === endPointName);

    if (!schema) return false;

    if (schema.isAllowed === 'false') return false;
    if (schema.isAllowed === 'true') return true;

    // For function strings, we default to showing existing UI (optimistic)
    // as we can't safely eval functions on client easily/securely without sandboxing
    // and they are meant for backend context usually.
    return true;
  };

  return <AccessControlContext.Provider value={{ canAccess, isLoading }}>{children}</AccessControlContext.Provider>;
};
