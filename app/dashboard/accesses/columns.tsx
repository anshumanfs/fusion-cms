'use client';

import { ColumnDef } from '@tanstack/react-table';
import { AccessActions } from './actions'; // We will assume actions will pass an onSuccess callback or similar if needed for refetch logic controlled by parent or context,
// for now, actions in this file will be simple display components, we'll need to instantiate AccessActions with a refresh callback in the cell render.
// But to keep it simple, we might pass a "refetch" function down via row context if needed, or rely on page reload;
// actually data-table usually handles state.
// A better pattern for table updates in this setup (client-side fetch) is to pass a refresh trigger or use a query library.
// For now, let's keep it simple: The actions component will handle the API call.
// The page might need to periodically re-fetch or use a global state.
// We'll trust the user to refresh or we can lift the state up later.
// Actually, to make 'onSuccess' work in the cell, we need to pass it from the render function context or similar.
// For this iteration, let's render the component.

// Better approach: The data table in this project seems to fetch data in the page component.
// We might not be able to easily trigger a refetch from the cell without a context or prop drilling.
// For now we will implement the Actions component in the cell.

export type AccessSchema = {
  email: string;
  appName: string;
  endPointName: string;
  isAllowed: string;
  allowedInChain: boolean;
};

// We need a way to trigger refresh from the cell.
// One common way is to accept a prop in columns function if we were generating columns dynamically,
// OR we can make the cell component interactive and use a custom hook/context.
// Let's stick to the pattern used in 'databases/columns.tsx' if possible.
// Checked 'databases/columns.tsx': it imports Actions from './actions'.
// Let's assume we can follow that.

export const columns: ColumnDef<AccessSchema>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'appName',
    header: 'App Name',
  },
  {
    accessorKey: 'endPointName',
    header: 'Endpoint',
  },
  {
    accessorKey: 'isAllowed',
    header: 'Allowed',
    cell: ({ row }) => {
      const val = row.getValue('isAllowed');
      return val === 'true' ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>;
    },
  },
  {
    accessorKey: 'allowedInChain',
    header: 'Chain Allowed',
    cell: ({ row }) => {
      const val = row.getValue('allowedInChain');
      return val ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const access = row.original;
      // We'll leave the onSuccess empty for now, relying on user refresh or we can implement a context later if strictly required.
      // However, usually it's good UX to refresh.
      // We can use a custom event or context.
      // Let's leave it as is for mvp parity with existing code.
      return <AccessActions email={access.email} appName={access.appName} endPointName={access.endPointName} />;
    },
  },
];
