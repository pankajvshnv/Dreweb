import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MoreHorizontal, Search, ExternalLink, ArrowLeft, Save, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { useCollection } from '../../lib/useCollection';
import { createDocument, updateDocument, deleteDocument } from '../../lib/crud';
import { useToast } from '../../lib/ToastContext';

export default function AdminServices() {
  const { data: services, loading } = useCollection<any>('services');
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Development',
    shortDescription: '',
    description: '',
    image: '',
    isPublished: true,
  });

  const handleCreate = () => {
    setCurrentService(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Development',
      shortDescription: '',
      description: '',
      image: '',
      isPublished: true,
    });
    setIsEditing(true);
  };

  const handleEdit = (service: any) => {
    setCurrentService(service);
    setFormData({
      title: service.title || '',
      slug: service.slug || '',
      category: service.category || 'Development',
      shortDescription: service.shortDescription || '',
      description: service.description || '',
      image: service.image || '',
      isPublished: service.isPublished !== false,
    });
    setIsEditing(true);
  };

  const generateSlug = () => {
    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      addToast('Service title is required', 'error');
      return;
    }
    if (!formData.slug.trim()) {
      addToast('URL slug is required. Click auto-generate.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (currentService?.id) {
        await updateDocument('services', currentService.id, formData);
        addToast('Service updated successfully', 'success');
      } else {
        await createDocument('services', formData);
        addToast('Service created successfully', 'success');
      }
      setIsEditing(false);
    } catch (error) {
      addToast('Failed to save service', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await deleteDocument('services', id);
      addToast('Service deleted', 'success');
    }
  };

  const filteredServices = services.filter((s: any) =>
    s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isEditing) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full border-zinc-200" onClick={() => setIsEditing(false)}>
              <ArrowLeft size={16} />
            </Button>
            <div>
              <h1 className="text-2xl font-display font-extrabold tracking-tight">
                {currentService ? `Edit: ${currentService.title}` : 'Create New Service'}
              </h1>
              <p className="text-zinc-500 text-sm font-medium">Configure service details and visibility.</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="rounded-full font-bold bg-black text-white hover:bg-zinc-800 gap-2">
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Service'}
          </Button>
        </div>

        <Card className="border-zinc-200 rounded-2xl">
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
            <CardDescription>Core details about the service.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-bold">Service Title</Label>
                <Input id="title" value={formData.title} onChange={handleChange} placeholder="e.g. Website Design & Development" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="slug" className="font-bold">URL Slug</Label>
                  <button type="button" onClick={generateSlug} className="text-xs font-medium text-brand-blue flex items-center hover:underline">
                    <Edit2 size={10} className="mr-1" /> Auto-generate
                  </button>
                </div>
                <Input id="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. website-design" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="font-bold">Category</Label>
                <select id="category" value={formData.category} onChange={handleChange} className="w-full h-9 px-3 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black transition-colors">
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Creative">Creative</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="font-bold">Service Image URL</Label>
                <Input id="image" value={formData.image} onChange={handleChange} placeholder="https://..." className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="shortDescription" className="font-bold">Short Description</Label>
              <Textarea id="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Brief summary shown in cards..." className="min-h-[80px] border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold">Full Description</Label>
              <Textarea id="description" value={formData.description} onChange={handleChange} placeholder="Detailed service description..." className="min-h-[150px] border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
            </div>
            <div className="flex items-center justify-between py-2 border-t border-zinc-100 mt-4">
              <div className="space-y-0.5">
                <Label className="text-base font-bold">Published</Label>
                <p className="text-sm text-zinc-500">Show this service on the frontend.</p>
              </div>
              <Switch checked={formData.isPublished} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Services</h1>
          <p className="text-zinc-500 font-medium">Manage the services your agency offers.</p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto gap-2 bg-black text-white hover:bg-zinc-800 rounded-full font-bold">
          <Plus size={16} />
          Add New Service
        </Button>
      </div>

      <Card className="border-zinc-200">
        <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl w-full sm:w-80">
            <Search size={16} className="text-zinc-400" />
            <input type="text" placeholder="Search services..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent text-sm w-full focus:outline-none" />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-100 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredServices.map((service: any) => (
                  <tr key={service.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex gap-4 items-center">
                        <div>
                          <p className="font-bold text-black text-base">{service.title}</p>
                          <p className="text-zinc-500 text-xs mt-0.5">/{service.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 font-medium max-w-[300px] truncate">
                      {service.category}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={service.isPublished !== false ? "bg-brand-lime text-black px-2 py-0.5" : "bg-zinc-100 text-zinc-600 px-2 py-0.5"}>
                        {service.isPublished !== false ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center p-0 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-zinc-200">
                          <div className="px-2 py-1.5 text-sm font-semibold text-zinc-500">Actions</div>
                          <DropdownMenuItem onClick={() => handleEdit(service)} className="cursor-pointer font-medium">Edit Service</DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center justify-between cursor-pointer font-medium">
                            <Link to={`/services/${service.slug}`} className="flex w-full items-center justify-between">
                                View Live <ExternalLink size={14} />
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setTimeout(() => handleDelete(service.id), 50); }} className="text-red-600 focus:bg-red-50 focus:text-red-700 font-bold cursor-pointer">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredServices.length === 0 && !loading && (
                    <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
                              <Search size={24} className="text-zinc-300" />
                            </div>
                            <p className="text-zinc-500 font-medium">No services found.</p>
                            <p className="text-zinc-400 text-sm">Create your first service to get started.</p>
                          </div>
                        </td>
                    </tr>
                )}
                {loading && (
                    <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-zinc-300 border-t-black rounded-full animate-spin"></div>
                            <span className="text-zinc-500 font-medium">Loading services...</span>
                          </div>
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
