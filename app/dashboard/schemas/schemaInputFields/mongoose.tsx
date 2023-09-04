'use client';
import React, { useContext } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AppContext } from '@/app/AppContextProvider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { TrashIcon } from 'lucide-react';

function OptionsPopup({ id }: { id: string }) {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Options</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" id={id} key={id}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Options</h4>
              <p className="text-sm text-muted-foreground">Set the additional options for the field.</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor={`isArray_${id}`}>Array</Label>
                <Checkbox id={`isArray_${id}`} />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor={`isNullable_${id}`}>Nullable</Label>
                <Checkbox id={`isNullable_${id}`} />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor={`isIndex_${id}`}>Index</Label>
                <Checkbox id={`isIndex_${id}`} />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor={`isUnique_${id}`}>Unique</Label>
                <Checkbox id={`isUnique_${id}`} />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor={`isSparse_${id}`}>Sparse</Label>
                <Checkbox id={`isSparse_${id}`} />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor={`foreignField_${id}`}>Foreign Field</Label>
                <Input id={`foreignField_${id}`} defaultValue="" className="col-span-2 h-8" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default function MongoSchemaFields({ id }: { id: string }) {
  const [appContext, setAppContext] = useContext(AppContext);

  const deleteField = (component: any) => {
    console.log(component.target);
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
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <Input type="text" placeholder="Default" id={`default_${id}`} />
        <Input type="text" placeholder="Enums" id={`enums_${id}`} />
        <OptionsPopup id={id} />
        <Button variant="ghost" size="icon" id={`delete_${id}`} onClick={deleteField}>
          <TrashIcon className="w-4 h-4" id={`delete_${id}`} />
        </Button>
      </div>
    </div>
  );
}
