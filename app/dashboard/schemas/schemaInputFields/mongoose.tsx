'use client';
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function MongoSchemaFields() {
  return (
    <div className="w-full">
      <ScrollArea>
        <div className="grid grid-cols-12 gap-1">
          <Input type="text" placeholder="Name" required />
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Input type="text" placeholder="Default" />
          <Input type="text" placeholder="Enums" />
          <Input type="text" placeholder="Foreign Field" />
          <div className="flex items-center space-x-2">
            <Checkbox id="isRequired" />
            <Label htmlFor="airplane-mode">Required</Label>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
