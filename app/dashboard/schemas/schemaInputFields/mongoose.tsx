'use client';
import React, { useContext } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { AppContext } from '@/app/AppContextProvider';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TrashIcon } from 'lucide-react';

function OptionDialog({ id }: { id: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Options</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Options</DialogTitle>
          <DialogDescription>Please add other options for the field.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`isArray_${id}`}>Array</Label>
            <Checkbox id={`isArray_${id}`} />
            <Label htmlFor={`isNullable_${id}`}>Nullable</Label>
            <Checkbox id={`isNullable_${id}`} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`isIndex_${id}`}>Index</Label>
            <Checkbox id={`isIndex_${id}`} />
            <Label htmlFor={`isUnique_${id}`}>Unique</Label>
            <Checkbox id={`isUnique_${id}`} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`isSparse_${id}`}>Sparse</Label>
            <Checkbox id={`isSparse_${id}`} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`foreignField_${id}`}>Foreign Field</Label>
            <Input id={`foreignField_${id}`} className="col-span-2" placeholder="Foreign field ..." />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function MongoSchemaFields({ id }: { id: string }) {
  const [appContext, setAppContext] = useContext(AppContext);

  const deleteField = (component: any) => {
    const id = parseInt(component.target.id.split('_')[1]);
    const fields: any[] = appContext.schemaFields;
    const newFields = fields.filter((field, index) => index !== id);
    setAppContext({ ...appContext, schemaFields: newFields });
  };

  return (
    <div className="w-full" id={id}>
      <div className="grid grid-cols-6 gap-2 py-2 px-2">
        <Input type="text" placeholder="Name" id={`name_${id}`} required />
        <Select required>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent id={`type_${id}`}>
            <SelectItem value="number">
              <Badge className="mr-2 bg-red-500">[123]</Badge> Number
            </SelectItem>
            <SelectItem value="string">
              <Badge className="mr-2">&quot; &quot;</Badge>String
            </SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <Input type="text" placeholder="Default" id={`default_${id}`} />
        <Input type="text" placeholder="Enums" id={`enums_${id}`} />
        <OptionDialog id={id} />
        <Button variant="ghost" size="icon" id={`delete_${id}`} onClick={deleteField}>
          <TrashIcon className="w-4 h-4" id={`delete_${id}`} />
        </Button>
      </div>
    </div>
  );
}
