import { Payment, columns } from './columns';
import { DataTable } from './data-table';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AddDatabase } from '../forms/addDatabase';

function getData(): Payment[] {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      dbType: 'PostgreSQL',
      name: 'MongoDB',
      schemaCount: 5,
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    // ...
  ];
}

export default async function DemoPage() {
  const data = getData();
  return (
    <>
      <div className="container mx-auto">
        <Label className="semi-bold text-xl">Databases</Label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 right-0">
            <AddDatabase buttonVariant="outline" buttonClassName="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mr-2 w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Add Database
            </AddDatabase>
          </div>
        </div>
        <br /> <br />
        <div className="pt-4">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
