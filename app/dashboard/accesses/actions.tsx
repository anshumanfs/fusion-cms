'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';
import axios from '@/lib/axios';

interface AccessActionsProps {
  email: string;
  appName: string;
  endPointName: string;
  onSuccess?: () => void;
}

export function AccessActions({ email, appName, endPointName, onSuccess }: AccessActionsProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this access schema?')) return;

    const payload = JSON.stringify({
      query: `mutation RemoveAccessSchema($email: String!, $appName: String!, $endPointName: String!) {
        removeAccessSchema(email: $email, appName: $appName, endPointName: $endPointName) {
          _id
        }
      }`,
      variables: {
        email,
        appName,
        endPointName,
      },
    });

    try {
      const res = await axios.post('/appManager', payload);
      const { errors } = res.data;
      if (errors) {
        throw new Error(errors[0].message);
      }
      toast({
        title: 'Deleted',
        description: 'Access schema removed successfully',
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to remove access schema',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(email)}>Copy Email</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
          Delete Access
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
