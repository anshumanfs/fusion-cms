'use client';
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";
import Image from 'next/image';

const DefaultProgessBar = () => {
    return (
        <div className="flex h-screen">
            <div className="m-auto flex items-center space-x-2">
                <Loader2 size="30" className='animate-spin' />
                <span className="text-xl mx-auto">Validating user</span>
            </div>
        </div>
    );
};

const Success = () => {
    return (
        <>
            <div className="flex h-screen items-center justify-center flex-col space-y-4">
                <Image src="/gifs/success-animated.gif" width={100} height={100} alt="success-animated" />
                <div className="flex items-center space-x-2">
                    <span className="text-2xl">User validated successfully</span>
                </div>
                <div className="absolute bottom-3 w-full text-center">
                    <span className="text-sm">Redirecting to login page...</span>
                </div>
            </div>

        </>
    );
};

export function ValidateUser() {
    const [page, setPage] = React.useState(Success);
    const router = useRouter();
    const searchParams = useSearchParams();
    React.useEffect(() => {
        // const token = searchParams.get('token');
        // if (!token) {
        //     router.push('/404');
        //     return;
        // }

    }, [searchParams, router]);

    return (
        <>
            {page}
        </>
    )
}