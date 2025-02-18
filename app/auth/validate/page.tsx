'use client';
import * as React from 'react';
import { Suspense } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ValidateUser } from './validate-user';
import { ValidateReset } from './validate-reset';

const DefaultProgressBar = () => {
  return (
    <div className="flex h-screen">
      <div className="m-auto flex items-center space-x-2">
        <Loader2 size="30" className="animate-spin" />
        <span className="text-xl">Please wait</span>
      </div>
    </div>
  );
};

function ValidateContent() {
  const [page, setPage] = React.useState<React.ReactNode>(<DefaultProgressBar />);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const entity = searchParams.get('entity');

    if (entity === 'user') {
      setPage(() => <ValidateUser />);
      return;
    }
    if (entity === 'reset') {
      setPage(() => <ValidateReset />);
      return;
    }

    router.push('/404');
  }, [pathName, searchParams, router]);

  return <>{page}</>;
}

export default function Validate() {
  return (
    <Suspense fallback={<DefaultProgressBar />}>
      <ValidateContent />
    </Suspense>
  );
}
