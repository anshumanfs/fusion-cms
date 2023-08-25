import { Payment, columns } from './columns';
import { DataTable } from './data-table';

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
        <span className="semi-bold text-xl">Databases</span>
        <div className="py-5">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
