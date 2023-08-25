import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

import databases from './databases.json';

export function AddDatabase(props: {
  buttonVariant: 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive' | 'default';
  buttonClassName: string | '';
  children: any;
}) {
  const mongoObj = databases.find((database) => database.value === 'mongo');
  const [options, setOptions]: [any, any] = React.useState(mongoObj?.inputs);
  const [advancedOptionToggle, setAdvancedOptionToggle]: [boolean, any] = React.useState(false);

  const handleDbTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDb = event.target.value;
    const selectedDbObj = databases.find((database) => database.value === selectedDb);
    setOptions(selectedDbObj?.inputs);
  };

  const handleAdvancedOptionToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdvancedOptionToggle(event.target.checked);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={props.buttonVariant || 'outline'} className={props.buttonClassName}>
          {props.children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-half">
        <DialogHeader>
          <DialogTitle>Add Database</DialogTitle>
          <DialogDescription>Please add the details below to onboard a new database.</DialogDescription>
        </DialogHeader>
        <div>
          <RadioGroup defaultValue="mongo" className="grid grid-cols-3 gap-4">
            {databases.map((database, index) => {
              return (
                <div key={`${index}_available_db`}>
                  <RadioGroupItem
                    value={database.value}
                    id={`${database.name.toLowerCase()}_id`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`${database.name.toLowerCase()}_id`}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Image src={database.image} width={35} height={35} alt={`${database.name}_logo`} />
                    {database.name}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="airplane-mode">More Options</Label>
          <Switch id="airplane-mode" onChange={setAdvancedOptionToggle} />
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" placeholder="Mongo" className="col-span-3" />
          </div>
          {Object.keys(options?.basicOptions).map((option, index) => {
            return (
              <div key={`${index}_basic_options`} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={option} className="text-right">
                  {options.basicOptions[option].label}
                </Label>
                <Input
                  id={option}
                  type={options.basicOptions[option].type}
                  placeholder={options?.basicOptions[option].placeholder}
                  className="col-span-3"
                />
              </div>
            );
          })}
          {advancedOptionToggle ? (
            Object.keys(options?.advancedOptions).map((option, index) => {
              return (
                <div key={`${index}_basic_options`} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={option} className="text-right">
                    {options.advancedOptions[option].label}
                  </Label>
                  <Input
                    id={option}
                    type={options.advancedOptions[option].type}
                    placeholder={options?.advancedOptions[option].placeholder}
                    className="col-span-3"
                  />
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline">
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
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            Test Connection
          </Button>
          <Button type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
