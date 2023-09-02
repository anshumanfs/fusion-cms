import React from 'react';
import { Label } from '@radix-ui/react-dropdown-menu';
import { SchemaTable } from './schemaTables';

export default function Schemas() {
  return (
    <>
      <div className="container">
        <Label className="semi-bold text-xl">Schemas</Label>
        <div>
          <SchemaTable />
        </div>
      </div>
    </>
  );
}
