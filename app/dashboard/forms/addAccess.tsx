'use client';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

interface AddAccessProps {
  children: React.ReactNode;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  buttonClassName?: string;
  onSuccess?: () => void;
}

interface AppData {
  appName: string;
  schemas: {
    singularCollectionName: string;
    pluralCollectionName: string;
  }[];
}

export function AddAccess({ children, buttonVariant, buttonClassName, onSuccess }: AddAccessProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingApps, setFetchingApps] = useState(false);
  const [apps, setApps] = useState<AppData[]>([]);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    appName: '',
    endPointName: '',
    isAllowed: false,
    allowedInChain: false,
  });

  const fetchApps = async () => {
    setFetchingApps(true);
    const payload = JSON.stringify({
      query: `query GetAppsData {
        getAppsData {
          appName
          schemas {
            singularCollectionName
            pluralCollectionName
          }
        }
      }`,
    });

    try {
      const res = await axios.post('/appManager', payload);
      const { data, errors } = res.data;
      if (errors) {
        console.error('Failed to fetch apps', errors);
      } else {
        setApps(data.getAppsData);
      }
    } catch (error) {
      console.error('Failed to fetch apps', error);
    } finally {
      setFetchingApps(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchApps();
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [id]: checked }));
  };

  const handleAppChange = (value: string) => {
    setFormData((prev) => ({ ...prev, appName: value, endPointName: '' }));
  };

  const handleEndpointChange = (value: string) => {
    setFormData((prev) => ({ ...prev, endPointName: value }));
  };

  const resetForm = () => {
    setFormData({
      email: '',
      appName: '',
      endPointName: '',
      isAllowed: false,
      allowedInChain: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = JSON.stringify({
      query: `mutation CreateAccessSchema($email: String!, $appName: String!, $endPointName: String!, $isAllowed: String!, $allowedInChain: Boolean!) {
        createAccessSchema(email: $email, appName: $appName, endPointName: $endPointName, isAllowed: $isAllowed, allowedInChain: $allowedInChain) {
          _id
          appName
          endPointName
        }
      }`,
      variables: {
        email: formData.email,
        appName: formData.appName,
        endPointName: formData.endPointName,
        isAllowed: String(formData.isAllowed),
        allowedInChain: formData.allowedInChain,
      },
    });

    try {
      const res = await axios.post('/appManager', payload);
      const { errors } = res.data;

      if (errors) {
        throw new Error(errors[0].message);
      }

      toast({
        title: 'Success',
        description: 'Access schema created successfully',
      });
      setOpen(false);
      resetForm();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create access schema',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedAppSchemas = apps.find((a) => a.appName === formData.appName)?.schemas || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className={buttonClassName}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Access</DialogTitle>
            <DialogDescription>Create a new access schema for a user.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appName" className="text-right">
                App Name
              </Label>
              <Select onValueChange={handleAppChange} value={formData.appName} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select App" />
                </SelectTrigger>
                <SelectContent>
                  {apps.map((app) => (
                    <SelectItem key={app.appName} value={app.appName}>
                      {app.appName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endPointName" className="text-right">
                Endpoint
              </Label>
              <Select
                onValueChange={handleEndpointChange}
                value={formData.endPointName}
                required
                disabled={!formData.appName}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Endpoint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="*">All Endpoints (*)</SelectItem>
                  {selectedAppSchemas.map((schema) => (
                    <SelectItem key={schema.singularCollectionName} value={schema.singularCollectionName}>
                      {schema.singularCollectionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isAllowed" className="text-right">
                Is Allowed
              </Label>
              <Checkbox
                id="isAllowed"
                checked={formData.isAllowed}
                onCheckedChange={(checked) => handleCheckboxChange('isAllowed', checked as boolean)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="allowedInChain" className="text-right">
                Chain Allowed
              </Label>
              <Checkbox
                id="allowedInChain"
                checked={formData.allowedInChain}
                onCheckedChange={(checked) => handleCheckboxChange('allowedInChain', checked as boolean)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create access'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
