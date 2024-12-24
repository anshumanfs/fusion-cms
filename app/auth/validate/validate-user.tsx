'use client';
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import axios from '@/lib/axios';

const DefaultProgessBar = () => {
  return (
    <div className="flex h-screen">
      <div className="m-auto flex items-center space-x-2">
        <Loader2 size="30" className="animate-spin" />
        <span className="text-xl mx-auto">Validating user</span>
      </div>
    </div>
  );
};

const Success = (redirectCounter: number = 3) => {
  return (
    <>
      <div className="flex h-screen items-center justify-center flex-col space-y-4">
        <Image src="/gifs/success-animated.gif" width={100} height={100} alt="success-animated" />
        <div className="flex items-center space-x-2">
          <span className="text-2xl">User validated successfully</span>
        </div>
        <div className="absolute bottom-3 w-full text-center">
          <span className="text-sm">
            Redirecting to login page in {redirectCounter}.... Click{' '}
            <Link href="/auth?tab=login" className="underline cursor-pointer">
              Here
            </Link>{' '}
            if not automatically redirected
          </span>
        </div>
      </div>
    </>
  );
};

const Failed = () => {
  return (
    <div className="flex h-screen items-center justify-center flex-col space-y-4">
      <Image src="/gifs/failed-animated.gif" width={100} height={100} alt="failed-animated" />
      <div className="flex items-center space-x-2">
        <span className="text-2xl">Failed to validate user</span>
      </div>
    </div>
  );
};

export function ValidateUser() {
  const [redirectCounter, setRedirectCounter] = React.useState(3);
  const [page, setPage] = React.useState(<DefaultProgessBar />);
  const router = useRouter();
  const searchParams = useSearchParams();
  React.useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      router.push('/404');
      return;
    }
    // Validate user
    const data = JSON.stringify({
      query: `mutation ActivateAccount($uniqueCode: String!) {
          activateAccount(uniqueCode: $uniqueCode) {
          message
        }
      }`,
      variables: {
        uniqueCode: token,
      },
    });
    axios
      .post('/appManager', data)
      .then((res) => {
        const { data, errors } = res.data;
        if (errors) {
          setPage(() => Failed());
          return;
        }
        setPage(() => Success(redirectCounter));
        const interval = setInterval(() => {
          setRedirectCounter((prev) => {
            if (prev === 1) {
              clearInterval(interval);
              router.push('/auth?tab=login');
              return prev;
            }
            return prev - 1;
          });
        }, 1000);
      })
      .catch(() => {
        setPage(() => Failed());
      });
  }, [searchParams, router]);

  return <>{page}</>;
}
