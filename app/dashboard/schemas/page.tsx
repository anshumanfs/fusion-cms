'use client';
import React, { useEffect, useState } from 'react';
import { Label } from '@radix-ui/react-dropdown-menu';
import { SchemaTable } from './schemaTables';
import axios from '@/lib/axios';

export default function Schemas() {
  const [appsData, setAppsData] = useState([]);
  const fetchAppsData = async () => {
    const payload = JSON.stringify({
      query: `query Query {
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
            createdAt
            updatedAt
          }
        }
      }`,
      variables: {},
    });
    axios.post('/appManager', payload).then((res) => {
      const { data, errors } = res.data;
      if (errors) {
        console.log(errors);
        return;
      }
      const allSchemas: any = [];
      data.getAppsData.forEach((app: any) => {
        const appSchema = app.schemas.map((schema: any) => {
          return {
            id: schema._id,
            schemaName: schema.pluralCollectionName,
            active: true, // schemas are always active
            databaseName: app.appName,
            databaseType: app.dbType,
            createdAt: schema.createdAt,
          };
        });
        allSchemas.push(...appSchema);
      });
      setAppsData(allSchemas);
    });
  };

  useEffect(() => {
    fetchAppsData();
  }, []);

  return (
    <>
      <div className="container">
        <Label className="semi-bold text-xl">Schemas</Label>
        <span className="text-small"></span>
        <div>
          <SchemaTable data={appsData} />
        </div>
      </div>
    </>
  );
}
