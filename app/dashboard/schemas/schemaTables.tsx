'use client';

import * as React from 'react';
import { CaretSortIcon, ChevronDownIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Actions } from './actions';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AddSchema } from './addSchema';
import data from './data/data.json';

export type SchemaDisplay = {
  id: string;
  schemaName: string;
  active: true | false;
  databaseName: string;
  databaseType: string;
  createdAt: string;
};

const accessorKeyMap: any = {
  id: 'id',
  schemaName: 'Name',
  active: 'Status',
  databaseName: 'DB Name',
  databaseType: 'DB Type',
  createdAt: 'Created',
};

export const columns: ColumnDef<SchemaDisplay>[] = [
  {
    accessorKey: 'id',
    header: '',
  },
  {
    accessorKey: 'schemaName',
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="inline-flex items-center cursor-pointer"
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue('schemaName')}</div>,
  },
  {
    accessorKey: 'active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('active');
      return (
        <div>
          <Badge className={isActive ? 'bg-green-500' : 'bg-rose-500'}>{isActive ? 'Active' : 'Inactive'}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'databaseName',
    header: () => <div>DB Name</div>,
    cell: ({ row }) => <div>{row.getValue('databaseName')}</div>,
  },
  {
    accessorKey: 'databaseType',
    header: () => <div>DB Type</div>,
    cell: ({ row }) => <div>{row.getValue('databaseType')}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="inline-flex items-center cursor-pointer"
        >
          Created On
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => <div>{new Date(row.getValue('createdAt')).toDateString()}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      return <Actions />;
    },
  },
];

export function SchemaTable({ data }: { data: SchemaDisplay[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [filterBy, setFilterBy] = React.useState('schemaName');
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Schemas..."
          value={(table.getColumn(filterBy)?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn(filterBy)?.setFilterValue(event.target.value)}
          className="w-[250px] mr-2"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filter by <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup value={filterBy} onValueChange={setFilterBy}>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuRadioItem value={column.id} key={column.id}>
                      {accessorKeyMap[column.id]}
                    </DropdownMenuRadioItem>
                  );
                })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mx-2">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllFlatColumns().map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {accessorKeyMap[column.id] || column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <AddSchema buttonClassName="mr-0 ml-auto" buttonVariant="outline">
          <PlusCircledIcon className="mr-2" />
          Add Schema
        </AddSchema>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
