'use client';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AppContext, defaultContextValues } from './AppContextProvider';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fusion CMS',
  description: 'Created with Node.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [appContext, setAppContext] = useState(defaultContextValues);
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppContext.Provider value={[appContext, setAppContext]}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </AppContext.Provider>
      </body>
    </html>
  );
}
