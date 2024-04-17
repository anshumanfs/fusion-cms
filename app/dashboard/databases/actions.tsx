import * as React from 'react';

import { Button } from '@/components/ui/button';
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
import { Trash2Icon, PauseCircleIcon, EyeIcon } from 'lucide-react';

export function Actions(props: { appName: string }) {
  const handleRouting = (path: string) => {
    // open in new tab
    window.open(`/graphql/${path}`, '_blank');
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
          <DropdownMenuItem onClick={() => handleRouting(`/graphql/${props.appName}`)}>
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
          <DropdownMenuItem onClick={() => handleRouting(`/rest/${props.appName}/docs`)}>
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
          <DropdownMenuItem>
            <PauseCircleIcon className="w-5 h-5 mr-2" />
            Pause
          </DropdownMenuItem>
          <ConfirmDelete>
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
