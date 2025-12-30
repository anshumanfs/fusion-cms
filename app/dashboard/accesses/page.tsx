'use client';
import { useState, useEffect } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

import axios from '@/lib/axios';

export default function AccessesPage() {
  const [data, setData] = useState([]);
  const { toast } = useToast();

  function fetchData() {
    const payload = JSON.stringify({
      query: `query GetAccessSchemas {
        getAccessSchemas {
          email
          appName
          endPointName
          isAllowed
          allowedInChain
        }
      }`,
      variables: {},
    });

    axios
      .post('/appManager', payload)
      .then((res) => {
        const { data, errors } = res.data;
        if (errors) {
          toast({
            variant: 'destructive',
            title: 'Failed to fetch data',
            description: errors[0].message,
            action: (
              <ToastAction altText="Try again" onClick={fetchData}>
                Try again
              </ToastAction>
            ),
          });
          return;
        }
        setData(data.getAccessSchemas);
      })
      .catch((err) => {
        toast({
          variant: 'destructive',
          title: 'Failed to fetch data',
          description: 'An error occurred while trying to fetch data',
          action: (
            <ToastAction altText="Try again" onClick={fetchData}>
              Try again
            </ToastAction>
          ),
        });
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Accesses</h2>
          <p className="text-sm text-muted-foreground">Manage user access permissions and schemas.</p>
        </div>
      </div>
      <DataTable columns={columns} data={data} onRefresh={fetchData} />
    </div>
  );
}
