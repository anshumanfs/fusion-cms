'use client';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AppContext, defaultContextValues } from './AppContextProvider';
import { useState } from 'react';
import { Loader } from '@/components/loader';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [appContext, setAppContext] = useState(defaultContextValues);
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppContext.Provider value={[appContext, setAppContext]}>
          <Loader loaderDisplay={appContext.loaderStates}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              {children}
            </ThemeProvider>
          </Loader>
        </AppContext.Provider>
        <Toaster />
      </body>
    </html>
  );
}
