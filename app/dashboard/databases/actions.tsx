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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { ConfirmDelete } from '../forms/confirmDelete';

export function Actions() {
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
          <DropdownMenuItem>
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
          <DropdownMenuItem>
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
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            View
          </DropdownMenuItem>
          <DropdownMenuItem>
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
                d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Pause
          </DropdownMenuItem>
          <ConfirmDelete>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              Delete
            </DropdownMenuItem>
          </ConfirmDelete>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
