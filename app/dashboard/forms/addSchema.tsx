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

export function AddSchema(props: {
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
            <DialogContent className="max-w-[60%]">
                <DialogHeader>
                    <DialogTitle>Add Schema</DialogTitle>
                    <DialogDescription>Please add the details below to onboard a new schema.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
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
