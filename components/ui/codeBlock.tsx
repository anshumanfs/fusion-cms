'use client';
import { CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const copyCommand = (command: string) => {
  navigator.clipboard.writeText(command);
};

const CodeBlock = (props: { command: string; children: any }) => {
  return (
    <>
      <code className="text-sm sm:text-base inline-flex text-left items-center space-x-4 dark:bg-gray-800 bg-slate-100 text-white rounded-lg p-1 pl-4 shadow-xl hover:shadow-violet-500/50">
        <span className="flex gap-4">
          <span className="shrink-0 text-green-600">$</span>
          {props.children}
        </span>
        <Button variant="outline" size="icon" onClick={() => copyCommand(props.command)}>
          <CopyIcon className="shrink-0 h-4 w-4 transition text-gray-500 group-hover:text-white" />
        </Button>
      </code>
    </>
  );
};

export { CodeBlock };
