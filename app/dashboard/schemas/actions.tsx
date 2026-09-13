import * as React from 'react';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Edit3, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ConfirmDeleteSchema = (props: { children: any; appName: string; schemaName: string }) => {
  const { toast } = useToast();

  const deleteSchema = async (appName: string, schemaName: string) => {
    const payload = JSON.stringify({
      query: `mutation RemoveAppSchema($appName: String!, $originalCollectionName: String!) {
        removeAppSchema(appName: $appName, originalCollectionName: $originalCollectionName) {
          message
          deletedData
        }
      }`,
      variables: {
        appName,
        originalCollectionName: schemaName,
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
            description: `Schema "${schemaName}" deleted successfully from database "${appName}".`,
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
    <AlertDialog>
      <AlertDialogTrigger className="w-full">{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this schema?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the schema "{props.schemaName}" from database "{props.appName}".
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteSchema(props.appName, props.schemaName)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete Schema
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ConfirmUpdateSchema = (props: { children: any; appName: string; schemaName: string }) => {
  const { toast } = useToast();

  const updateSchema = async (appName: string, schemaName: string) => {
    // TODO: Implement schema update mutation
    // For now, we'll show a message that update functionality is coming soon
    toast({
      variant: 'default',
      title: 'Update Coming Soon',
      description: `The update functionality for schema "${schemaName}" will be available in the next release.`,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full">{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Schema</AlertDialogTitle>
          <AlertDialogDescription>
            This will update the schema "{props.schemaName}" in database "{props.appName}". Please ensure all field definitions are correct before updating.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => updateSchema(props.appName, props.schemaName)}>Update Schema</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export function Actions({ appName }: { appName: string }) {
  const { toast } = useToast();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ConfirmUpdateSchema appName={appName} schemaName={appName}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Edit3 className="w-5 h-5 mr-2" />
              Edit Schema
            </DropdownMenuItem>
          </ConfirmUpdateSchema>

          <DropdownMenuItem>
            <Eye className="w-5 h-5 mr-2" />
            View
          </DropdownMenuItem>

          <ConfirmDeleteSchema appName={appName} schemaName={appName}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Schema
            </DropdownMenuItem>
          </ConfirmDeleteSchema>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
