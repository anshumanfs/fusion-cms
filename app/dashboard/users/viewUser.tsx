import * as React from 'react';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';

export function ViewUser({ children }: { children: any }) {
  const refs = {
    firstName: React.useRef(null as any),
    lastName: React.useRef(null as any),
    email: React.useRef(null as any),
    blocked: React.useRef(null as any),
    apiKey: React.useRef(null as any),
  };

  const enableEdit = () => {
    refs.firstName.current.disabled = false;
    refs.lastName.current.disabled = false;
    refs.email.current.disabled = false;
    refs.blocked.current.disabled = false;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to user profile here. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              First Name
            </Label>
            <Input id="firstName" ref={refs.firstName} className="col-span-3" disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Last Name
            </Label>
            <Input id="lastName" ref={refs.lastName} className="col-span-3" disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" ref={refs.email} className="col-span-3" disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Blocked
            </Label>
            <Select>
              <SelectTrigger className="w-[180px]" ref={refs.blocked} disabled>
                <SelectValue placeholder="Select a choice" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Blocked</SelectLabel>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              API Key
            </Label>
            <div className="relative col-span-3">
              <Input id="apiKey" ref={refs.apiKey} disabled />
              <Button
                className="absolute right-0 top-0"
                variant="secondary"
                onClick={() => {
                  refs.apiKey.current.select();
                  navigator.clipboard.writeText(refs.apiKey.current.value);
                }}
              >
                <Copy className="absolute cursor-pointer top-3 h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={enableEdit}>
            Edit
          </Button>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
