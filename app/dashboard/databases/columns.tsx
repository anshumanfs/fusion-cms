import { ColumnDef } from '@tanstack/react-table';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Apps = {
  id: string;
  name: string;
  dbType: string;
  schemas: any;
  isAppCompleted: boolean;
  running: boolean;
  endpoint: string;
};

export const columns: ColumnDef<Apps>[] = [
  {
    id: 'appName',
    accessorKey: 'appName',
    header: 'Name',
  },
  {
    id: 'dbType',
    accessorKey: 'dbType',
    header: 'Database Type',
  },
  {
    id: 'schemas',
    accessorFn: (row) => row.schemas.length.toString(),
    header: 'Schema Count',
  },
  {
    id: 'status',
    accessorFn: (row) => (row.isAppCompleted ? 'Completed' : 'Incomplete'),
    header: 'Status',
  },
  {
    id: 'running',
    accessorKey: 'running',
    header: 'Running',
  },
];
