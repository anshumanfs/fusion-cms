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
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { ConfirmDelete } from '../forms/confirmDelete';
import { Trash2Icon, PlayCircleIcon, PauseCircleIcon, EyeIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ConfirmEndpointAction = (props: { children: any; appName: string, action: string }) => {
  const { toast } = useToast();

  const startEndpoint = (appName: string, action: string) => {
    const payload = JSON.stringify({
      query: `mutation RunApp($appName: String!) {
        runApp(appName: $appName) {
          message
        }
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
            description: `App ${action === 'start' ? 'started' : 'stopped'} successfully. Please restart the application to see it in action.`,
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
          <AlertDialogTitle>Are you sure to {props.action} this endpoint ?</AlertDialogTitle>
          <AlertDialogDescription>
            You need to restart the application to {props.action === 'start' ? 'make' : 'disable'} the endpoint {props.action === 'start' ? 'visible' : ''}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => startEndpoint(props.appName, props.action)}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export function Actions(props: { appName: string; running: boolean }) {
  const handleRouting = (path: string) => {
    // open in new tab
    window.open(`${path}`, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <DotsVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleRouting(`/graphql/${props.appName}`)} disabled={!props.running}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="mr-2 w-5 h-5" viewBox="0 0 48 48">
              <path
                fill="#ff4081"
                d="M24.5,45.161L7,34.82V14.18L24.5,3.839L42,14.18V34.82L24.5,45.161z M9,33.68l15.5,9.159L40,33.68 V15.32L24.5,6.161L9,15.32V33.68z"
              ></path>
              <circle cx="24.5" cy="5.5" r="3.5" fill="#ff4081"></circle>
              <circle cx="24.5" cy="43.5" r="3.5" fill="#ff4081"></circle>
              <circle cx="8.5" cy="33.5" r="3.5" fill="#ff4081"></circle>
              <circle cx="40.5" cy="33.5" r="3.5" fill="#ff4081"></circle>
              <circle cx="8.5" cy="15.5" r="3.5" fill="#ff4081"></circle>
              <circle cx="40.5" cy="15.5" r="3.5" fill="#ff4081"></circle>
              <path fill="#ff4081" d="M42.72,35H6.28L24.5,2.978L42.72,35z M9.72,33H39.28L24.5,7.022L9.72,33z"></path>
            </svg>
            GraphQL Playground
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRouting(`/rest/${props.appName}/docs`)} disabled={!props.running}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="mr-2 w-5 h-5" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="#ffca28"></circle>
              <polygon
                fill="#fff"
                points="30.4,32.7 28.6,30.3 32,27.75 32,20.25 28.6,17.7 30.4,15.3 35,18.75 35,29.25"
              ></polygon>
              <polygon
                fill="#fff"
                points="17.6,32.7 13,29.25 13,18.75 17.6,15.3 19.4,17.7 16,20.25 16,27.75 19.4,30.3"
              ></polygon>
              <circle cx="19.5" cy="23.5" r="1.5" fill="#fff"></circle>
              <circle cx="24" cy="23.5" r="1.5" fill="#fff"></circle>
              <circle cx="28.5" cy="23.5" r="1.5" fill="#fff"></circle>
            </svg>
            Swagger Docs
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EyeIcon className="w-5 h-5 mr-2" />
            View
          </DropdownMenuItem>

          {props.running ? (
            <ConfirmEndpointAction appName={props.appName} action="pause">
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <PauseCircleIcon className="w-5 h-5 mr-2" />
                Pause
              </DropdownMenuItem>
            </ConfirmEndpointAction>
          ) : (
            <ConfirmEndpointAction appName={props.appName} action="start">
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <PlayCircleIcon className="w-5 h-5 mr-2" />
                Start
              </DropdownMenuItem>
            </ConfirmEndpointAction>
          )}

          <ConfirmDelete appName={props.appName}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash2Icon className="w-5 h-5 mr-2" />
              Delete
            </DropdownMenuItem>
          </ConfirmDelete>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
