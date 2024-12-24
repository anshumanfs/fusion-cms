'use client';
import * as React from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ValidateUser } from './validate-user';
import { ValidateReset } from './validate-reset';

const DefaultProgessBar = () => {
  return (
    <div className="flex h-screen">
      <div className="m-auto flex items-center space-x-2">
        <Loader2 size="30" className="animate-spin" />
        <span className="text-xl">Please wait</span>
      </div>
    </div>
  );
};

export default function Validate() {
  const [page, setPage] = React.useState(DefaultProgessBar);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [] = React.useState(DefaultProgessBar);
  React.useEffect(() => {
    const entity = searchParams.get('entity');
    if (entity === 'user') {
      setPage(<ValidateUser />);
      return;
    }
    if (entity === 'reset') {
      setPage(<ValidateReset />);
      return;
    }
    router.push('/404');
  }, [pathName, searchParams, router]);
  return <>{page}</>;
}
