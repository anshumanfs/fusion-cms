'use Client';
import React, { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { AppContext } from '@/app/AppContextProvider';
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
import MongoSchemaFields from './schemaInputFields/mongoose';
import { DownloadIcon, RadarIcon, PlusCircleIcon, CheckIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const schemaFieldsMap: any = {
  mongo: (id: string) => <MongoSchemaFields id={id} key={`${id}_mongo`} />,
};

export function AddSchema(props: {
  buttonVariant: 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive' | 'default';
  buttonClassName: string | '';
  children: any;
}) {
  const [dbType, setDbType] = useState('mongo');
  const [appContext, setAppContext] = useContext(AppContext);

  const addFields = () => {
    const fields = appContext.schemaFields;
    const component = schemaFieldsMap[dbType](fields.length.toString());
    setAppContext({ ...appContext, schemaFields: [...fields, component] });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={props.buttonVariant || 'outline'} className={props.buttonClassName}>
          {props.children}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[99%] h-[98%] gap-0">
        <div className="h-[50px]">
          Add Schema
          <br />
          Please add the details below to onboard a new schema.
        </div>
        <div className="w-full">
          <div className="float-right mb-2">
            <Button variant="outline">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Import Schema from JSON
            </Button>
            <Button variant="outline" className="ml-2">
              <RadarIcon className="w-4 h-4 mr-2" />
              Check Schema
            </Button>
            <Button type="submit" className="ml-2">
              <CheckIcon className="w-4 h-4 mr-2" />
              Proceed
            </Button>
          </div>
          <div className="w-full mt-2">
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
            <Button variant="outline" className="float-right mt-2" onClick={addFields}>
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </div>
        </div>
        <ScrollArea>
          <div className="grid grid-rows-4">
            <div className="w-full">
              {appContext.schemaFields.map((field: any, index: any) => {
                return field;
              })}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
