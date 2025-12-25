'use client';

import * as React from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const packages = [
  { label: 'npm', cmd: 'npm i fusion-cms' },
  { label: 'yarn', cmd: 'yarn add fusion-cms' },
  { label: 'pnpm', cmd: 'pnpm add fusion-cms' },
  { label: 'bun', cmd: 'bun add fusion-cms' },
];

export function CommandCopy() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(packages[activeTab].cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto overflow-hidden rounded-xl border border-white/10 bg-[#0f0f12] shadow-2xl ring-1 ring-white/10">
      {/* Header / Tabs */}
      <div className="flex items-center justify-between border-b border-white/5 bg-[#18181b]/50 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-4">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>

          <div className="flex bg-[#27272a] rounded-lg p-1">
            {packages.map((pkg, index) => (
              <button
                key={pkg.label}
                onClick={() => setActiveTab(index)}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium transition-all duration-200',
                  activeTab === index
                    ? 'bg-[#3f3f46] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#3f3f46]/50'
                )}
              >
                {pkg.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative group p-4 sm:p-6 font-mono text-sm">
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <span className="select-none text-green-500 font-bold">❯</span>
          <span className="text-zinc-100 type-writer">{packages[activeTab].cmd}</span>
          <span className="animate-pulse w-2 h-4 bg-zinc-500 block" />
        </div>
      </div>
    </div>
  );
}
