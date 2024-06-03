'use client';
import { useState, useEffect, useContext } from 'react';
import { Apps, columns } from './columns';
import { DataTable } from './data-table';
import { Label } from '@/components/ui/label';
import { AddDatabase } from '../forms/addDatabase';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { Kafka } from 'kafkajs';

import axios from '@/lib/axios';

export default function DatabasePage() {
  const [data, setData] = useState([]);
  const { toast } = useToast();

  function fetchData() {
    // Fetch data from your API here.
    const payload = JSON.stringify({
      query: `query GetAppsData {
        getAppsData {
          _id
          appName
          dbType
          isAppCompleted
          port
          running
          schemas {
            _id
            appName
            singularCollectionName
            pluralCollectionName
            originalCollectionName
            schema
          }
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
        setData(data.getAppsData);
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
    <>
      <div className="container mx-auto">
        <Label className="semi-bold text-xl">Databases</Label>
        <br />
        <div className="pt-2">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
