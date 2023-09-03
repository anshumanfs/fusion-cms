import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DownloadIcon } from '@radix-ui/react-icons';
import MongoSchemaFields from './schemaInputFields/mongoose';
import { PlusCircleIcon } from 'lucide-react';

const schemaFieldsMap = {
  mongo: <MongoSchemaFields />,
};

export function AddSchema(props: {
  buttonVariant: 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive' | 'default';
  buttonClassName: string | '';
  children: any;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={props.buttonVariant || 'outline'} className={props.buttonClassName}>
          {props.children}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[99%] h-[98%] gap-1">
        <DialogHeader>
          <DialogTitle>Add Schema</DialogTitle>
          <DialogDescription>Please add the details below to onboard a new schema.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-rows-4">
          <div className="w-full">
            <div className="float-right mb-2">
              <Button variant="outline" className="ml-2">
                <DownloadIcon className="w-4 h-4 mr-2" />
                Import Schema from JSON
              </Button>
            </div>
          </div>
          <div className="w-full">
            <div className="w-full grid grid-cols-4 gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Database" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>

              <Input type="text" placeholder="Schema Name (e.g UserSchema)" />

              <Input type="text" placeholder="Singular Name (e.g User)" />

              <Input type="text" placeholder="Plural Name (e.g Users)" />
            </div>
          </div>
          <div className="w-full">
            <Button variant="outline" className="float-right mt-2">
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </div>
          <div className="w-full">{schemaFieldsMap['mongo']}</div>
        </div>
        <DialogFooter>
          <div className="mt-auto mb-2">
            <Button variant="outline" className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mr-2 w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                />
              </svg>
              Check Schema
            </Button>
            <Button type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Proceed
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
