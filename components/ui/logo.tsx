'use client';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export default function Logo(props: { width: number; height: number }) {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <Image
        src={`/logo/${theme || 'light'}/icons8-react-native-256.svg`}
        alt="fusion"
        width={`${props.width}`}
        height={`${props.height}`}
      />
    </>
  );
}
