import React from 'react';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export function ConfirmDelete(props: { children: any; appName: string }) {
  const [removeInput, setRemoveInput] = React.useState('');
  const { toast } = useToast();

  const removeApp = (appName: string) => {
    const payload = JSON.stringify({
      query: `mutation Mutation($appName: String!) {
        removeApp(appName: $appName)
      }`,
      variables: {
        appName,
      },
    });
    axios
      .post('/appManager', payload)
      .then((response) => {
        if (response.data.errors) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: response.data.errors[0].message,
          });
        } else {
          toast({
            variant: 'default',
            title: 'Success',
            description: 'App deleted successfully.',
          });
        }
      })
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message,
        });
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription>Are you sure to delete this item?</DialogDescription>
        </DialogHeader>
        <div className="grid pt-4">
          <div className="grid grid-cols-4 items-center gap-3">
            <Label htmlFor="name" className="col-span-4 italic">
              Confirm by typing &apos;<span className="text-red-500">delete</span>&apos;
            </Label>
            <Input
              id="confirm_delete"
              placeholder="delete"
              className="col-span-4"
              onChange={(e) => setRemoveInput(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            variant="outline"
            className="w-full border-red-500 hover:bg-red-500"
            onClick={() => removeApp(props.appName)}
            disabled={removeInput !== 'delete'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
