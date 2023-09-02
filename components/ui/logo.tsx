'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

function Logo(props: { width: number; height: number }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Image
        src={`/logo/${resolvedTheme}/icons8-react-native-256.svg`}
        alt="fusion"
        width={`${props.width}`}
        height={`${props.height}`}
      />
    </>
  );
}

export default Logo;
