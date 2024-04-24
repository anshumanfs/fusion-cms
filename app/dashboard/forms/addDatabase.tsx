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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';

import databases from './databases.json';
import { Link } from 'lucide-react';

export function AddDatabase(props: {
  buttonVariant: 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive' | 'default';
  buttonClassName: string | '';
  children: any;
}) {
  const mongoObj = databases.find((database) => database.value === 'mongo');
  const [options, setOptions]: [any, any] = React.useState(mongoObj?.inputs);

  const handleDbTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDb = event.target.value;
    const selectedDbObj = databases.find((database) => database.value === selectedDb);
    setOptions(selectedDbObj?.inputs);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={props.buttonVariant || 'outline'} className={props.buttonClassName}>
          {props.children}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[100%] h-[100%]">
        <DialogHeader>
          <DialogTitle>Add Database</DialogTitle>
          <DialogDescription>Please add the details below to onboard a new database.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-5">
          <div className="col-span-1">
            <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
              {databases.map((database, index) => {
                return (
                  <div key={`${index}_available_db`}>
                    <Label
                      htmlFor={`${database.name.toLowerCase()}_id`}
                      className="flex flex-row items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Image src={database.image} width={35} height={35} alt={`${database.name}_logo`} />
                      {database.name}
                    </Label>
                  </div>
                );
              })}

              <Button variant="ghost" className="hidden lg:block">
                Mongo
              </Button>
              <Button variant="ghost" className="hidden lg:block">
                MySQL
              </Button>
            </nav>
          </div>
          <div className="col-span-4 pl-4">
            <div className="grid pt-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="name">Endpoint Name</Label>
                <Input id="name" placeholder="MongoApplication" className="col-span-4" />
              </div>
            </div>
            <div>
              <Tabs defaultValue="basic" className="w-full mt-4">
                <TabsList className="float-right py-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <br />
                <br />
                <ScrollArea className="h-[200px]">
                  <TabsContent value="basic" className="ml-2 w-[98%]">
                    {Object.keys(options?.basicOptions).map((option, index) => {
                      return (
                        <div key={`${index}_basic_options`} className="grid grid-cols-4 gap-2">
                          <Label htmlFor={option}>{options.basicOptions[option].label}</Label>
                          <Input
                            id={option}
                            type={options.basicOptions[option].type}
                            placeholder={options?.basicOptions[option].placeholder}
                            className="col-span-4 "
                          />
                        </div>
                      );
                    })}
                  </TabsContent>
                  <TabsContent value="advanced" className="ml-2 w-[98%]">
                    <div className="grid grid-cols-4 gap-2">
                      {Object.keys(options?.advancedOptions).map((option, index) => {
                        return (
                          <div key={`${index}_basic_options`} className="grid gap-2">
                            <Label htmlFor={option}>{options.advancedOptions[option].label}</Label>
                            <Input
                              id={option}
                              type={options.advancedOptions[option].type}
                              placeholder={options?.advancedOptions[option].placeholder}
                              className="col-span-3"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </div>
          </div>
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
