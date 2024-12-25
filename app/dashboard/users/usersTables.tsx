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
import { AppContext } from '@/app/AppContextProvider';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Actions } from './actions';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchUsersCount, fetchUsersData } from './services';

export type UsersDisplay = {
  id: string;
  name: string;
  email: string;
  apiKey: string;
  role: string;
  isVerified: true | false;
  isBlocked: true | false;
  createdAt: string;
};

const accessorKeyMap: any = {
  id: 'id',
  name: 'Name',
  email: 'Email',
  apiKey: 'API Key',
  role: 'Role',
  isVerified: 'Verified',
  isBlocked: 'Blocked',
  active: 'Status',
  createdAt: 'Created',
};

export const columns: ColumnDef<UsersDisplay>[] = [
  {
    accessorKey: 'id',
    header: '',
  },
  {
    accessorKey: 'name',
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
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'isVerified',
    header: 'Verified',
    cell: ({ row }) => {
      const isVerified = row.getValue('isVerified');
      console.log('isVerified', isVerified);
      return (
        <div>
          <Badge className={isVerified ? 'bg-green-500' : 'bg-rose-500'}>
            {isVerified ? 'Verified' : 'Not-Verified'}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: () => <div>Email</div>,
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="inline-flex items-center cursor-pointer"
        >
          Role <CaretSortIcon className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue('role')}</div>,
  },
  {
    accessorKey: 'isBlocked',
    header: 'Blocked',
    cell: ({ row }) => {
      const isBlocked = row.getValue('isBlocked');
      return (
        <div>
          <Badge className={isBlocked ? 'bg-red-500' : 'bg-green-500'}>{isBlocked ? 'Blocked' : 'Active'}</Badge>
        </div>
      );
    },
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

export function UsersTable() {
  const [appContext, setAppContext] = React.useContext(AppContext);
  const [usersState, setUsersState] = React.useState({
    users: [] as UsersDisplay[],
    count: 0,
  });
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [filterBy, setFilterBy] = React.useState('name');
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    setAppContext({
      ...appContext,
      loaderStates: true,
    });
    if (pagination.pageIndex === 0) {
      fetchUsersCount()
        .then((count) => {
          setUsersState((state) => ({ ...state, count }));
        })
        .finally(() => {
          setAppContext({
            ...appContext,
            loaderStates: false,
          });
        });
    }
    fetchUsersData(pagination.pageIndex)
      .then((users) => {
        setUsersState((state) => ({ ...state, users }));
      })
      .finally(() => {
        setAppContext({
          ...appContext,
          loaderStates: false,
        });
      });
  }, [pagination.pageIndex]);

  const table = useReactTable({
    data: usersState.users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    //getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    rowCount: usersState.count,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const nextPage = () => {
    setPagination((state) => ({ ...state, pageIndex: state.pageIndex + 1 }));
  };

  const previousPage = () => {
    setPagination((state) => ({ ...state, pageIndex: state.pageIndex - 1 }));
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Users..."
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
        <Button variant="outline" className="mr-0 ml-auto">
          <PlusCircledIcon className="mr-2" />
          Add User
        </Button>
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
          <Button variant="outline" size="sm" onClick={() => previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
