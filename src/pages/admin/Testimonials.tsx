import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Plus, MoreHorizontal, MessageSquare, Edit2, Trash2, ArrowLeft, Save } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { useCollection } from '../../lib/useCollection';
import { createDocument, deleteDocument, updateDocument } from '../../lib/crud';
import { useToast } from '../../lib/ToastContext';

export default function AdminTestimonials() {
  const { data: testimonials, loading } = useCollection<any>('testimonials');
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    author: '',
    role: '',
    quote: '',
    authorImage: '',
    companyLogo: '',
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      await deleteDocument('testimonials', id);
      addToast('Testimonial deleted', 'success');
    }
  };

  const handleCreate = () => {
    setCurrentTestimonial(null);
    setFormData({ author: '', role: '', quote: '', authorImage: '', companyLogo: '' });
    setIsEditing(true);
  };

  const handleEdit = (item: any) => {
    setCurrentTestimonial(item);
    setFormData({
      author: item.author || '',
      role: item.role || '',
      quote: item.quote || '',
      authorImage: item.authorImage || '',
      companyLogo: item.companyLogo || '',
    });
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!formData.author.trim()) {
      addToast('Author name is required', 'error');
      return;
    }
    if (!formData.quote.trim()) {
      addToast('Quote is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (currentTestimonial?.id) {
        await updateDocument('testimonials', currentTestimonial.id, formData);
        addToast('Testimonial updated successfully', 'success');
      } else {
        await createDocument('testimonials', formData);
        addToast('Testimonial created successfully', 'success');
      }
      setIsEditing(false);
    } catch (error) {
      addToast('Failed to save testimonial', 'error');
    } finally {
      setIsSaving(false);
    }
  };

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
                {currentTestimonial ? 'Edit Testimonial' : 'New Testimonial'}
              </h1>
              <p className="text-zinc-500 text-sm font-medium">Add a client review to showcase on your site.</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="rounded-full font-bold bg-black text-white hover:bg-zinc-800 gap-2">
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>

        <Card className="border-zinc-200 rounded-2xl">
          <CardHeader>
            <CardTitle>Testimonial Details</CardTitle>
            <CardDescription>Information about the client and their review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="author" className="font-bold">Author Name</Label>
                <Input id="author" value={formData.author} onChange={handleChange} placeholder="e.g. Marcus Cheng" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="font-bold">Role / Company</Label>
                <Input id="role" value={formData.role} onChange={handleChange} placeholder="e.g. CTO, Acme Corp" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote" className="font-bold">Quote</Label>
              <Textarea id="quote" value={formData.quote} onChange={handleChange} placeholder="What did the client say about working with you?" className="min-h-[120px] border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="authorImage" className="font-bold">Author Image URL</Label>
                <Input id="authorImage" value={formData.authorImage} onChange={handleChange} placeholder="https://..." className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyLogo" className="font-bold">Company Logo URL</Label>
                <Input id="companyLogo" value={formData.companyLogo} onChange={handleChange} placeholder="https://..." className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
              </div>
            </div>
            {formData.authorImage && (
              <div className="flex items-center gap-4 mt-2">
                <img src={formData.authorImage} alt="Author" className="w-12 h-12 rounded-full object-cover border-2 border-zinc-200" />
                <span className="text-sm text-zinc-500">Preview</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Testimonials</h1>
          <p className="text-zinc-500 font-medium">Manage client reviews and feedback.</p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto gap-2 bg-black text-white hover:bg-zinc-800 rounded-full font-bold">
          <Plus size={18} />
          Add Testimonial
        </Button>
      </div>

      <Card className="border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Quote</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {testimonials.map((item: any) => (
                <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                        <MessageSquare size={18} className="text-zinc-400" />
                      </div>
                      <span className="font-semibold text-black max-w-xs truncate block" title={item.quote}>{item.quote}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-black">{item.author}</p>
                      <p className="text-xs text-zinc-500">{item.role}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-black transition-colors outline-none inline-flex">
                        <MoreHorizontal size={18} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => handleEdit(item)} className="font-medium cursor-pointer"><Edit2 className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setTimeout(() => handleDelete(item.id), 50); }} className="text-red-600 font-bold focus:bg-red-50 focus:text-red-700 cursor-pointer"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && !loading && (
                <tr>
                   <td colSpan={3} className="px-6 py-16 text-center">
                     <div className="flex flex-col items-center gap-3">
                       <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
                         <MessageSquare size={24} className="text-zinc-300" />
                       </div>
                       <p className="text-zinc-500 font-medium">No testimonials yet.</p>
                       <p className="text-zinc-400 text-sm">Add your first client review.</p>
                     </div>
                   </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-zinc-300 border-t-black rounded-full animate-spin"></div>
                      <span className="text-zinc-500 font-medium">Loading...</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
