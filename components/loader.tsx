'use client';
import * as React from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/loader-dialog";

export function Loader({ children, ...props }: any) {
  return (
    <>
      {children}
      <Dialog open={props.loaderDisplay}>
        <DialogContent className="flex items-center justify-center space-x-1">
          <Loader2 className="animate-spin h-6 w-6 text-primary-500" />
          <span>Loading</span>
        </DialogContent>
      </Dialog>
    </>
  );
}