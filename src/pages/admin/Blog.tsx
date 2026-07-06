import React, { useState } from 'react';
import { Plus, MoreHorizontal, Search, ArrowLeft, Save, Edit2, X as XIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
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

export default function AdminBlog() {
  const { data: posts, loading } = useCollection<any>('blog');
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    author: '',
    category: 'Engineering',
    content: '',
    excerpt: '',
    tags: [] as string[],
    coverImage: '',
    status: 'Draft',
    metaTitle: '',
    metaDesc: '',
  });

  const handleCreate = () => {
    setCurrentPost(null);
    setFormData({
      title: '', slug: '', author: '', category: 'Engineering', content: '',
      excerpt: '', tags: [], coverImage: '', status: 'Draft', metaTitle: '', metaDesc: '',
    });
    setIsEditing(true);
  };

  const handleEdit = (post: any) => {
    setCurrentPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      author: post.author || '',
      category: post.category || 'Engineering',
      content: post.content || '',
      excerpt: post.excerpt || '',
      tags: post.tags || [],
      coverImage: post.coverImage || '',
      status: post.status || 'Draft',
      metaTitle: post.metaTitle || '',
      metaDesc: post.metaDesc || '',
    });
    setIsEditing(true);
  };

  const generateSlug = () => {
    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData((prev: any) => ({ ...prev, slug }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev: any) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev: any) => ({ ...prev, tags: prev.tags.filter((t: string) => t !== tag) }));
  };

  const handleSave = async (publishNow = false) => {
    if (!formData.title.trim()) {
      addToast('Post title is required', 'error');
      return;
    }
    if (!formData.slug.trim()) {
      addToast('URL slug is required. Click auto-generate.', 'error');
      return;
    }

    setIsSaving(true);
    const dataToSave = { ...formData };
    if (publishNow) dataToSave.status = 'Published';

    try {
      if (currentPost?.id) {
        await updateDocument('blog', currentPost.id, dataToSave);
        addToast('Post updated successfully', 'success');
      } else {
        await createDocument('blog', dataToSave);
        addToast('Post created successfully', 'success');
      }
      setIsEditing(false);
    } catch (error) {
      addToast('Failed to save post', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deleteDocument('blog', id);
      addToast('Post deleted', 'success');
    }
  };

  const filteredPosts = posts.filter((p: any) => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (isEditing) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-24">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full border-zinc-200" onClick={() => setIsEditing(false)}>
              <ArrowLeft size={16} />
            </Button>
            <div>
              <h1 className="text-2xl font-display font-extrabold tracking-tight">
                {currentPost ? `Edit: ${currentPost.title}` : 'Create New Post'}
              </h1>
              <p className="text-zinc-500 text-sm font-medium">Write and manage your blog content.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => handleSave(false)} disabled={isSaving} variant="outline" className="rounded-full font-bold border-zinc-200 gap-2">
              <Save size={16} />
              Save Draft
            </Button>
            <Button onClick={() => handleSave(true)} disabled={isSaving} className="rounded-full font-bold bg-black text-white hover:bg-zinc-800 gap-2">
              {isSaving ? 'Saving...' : 'Publish'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:w-[350px] bg-zinc-100 p-1 rounded-xl">
            <TabsTrigger value="content" className="rounded-lg text-xs font-bold uppercase tracking-wider">Content</TabsTrigger>
            <TabsTrigger value="details" className="rounded-lg text-xs font-bold uppercase tracking-wider">Details</TabsTrigger>
            <TabsTrigger value="seo" className="rounded-lg text-xs font-bold uppercase tracking-wider">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6 mt-6">
            <Card className="border-zinc-200 rounded-2xl">
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-bold">Title</Label>
                  <Input id="title" value={formData.title} onChange={handleChange} placeholder="e.g. 10 Web Design Trends for 2024" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors text-lg font-semibold h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt" className="font-bold">Excerpt</Label>
                  <Textarea id="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="A brief summary that appears in post previews..." className="min-h-[80px] border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="font-bold">Content</Label>
                  <Textarea id="content" value={formData.content} onChange={handleChange} placeholder="Write your full blog post here... (Markdown supported)" className="min-h-[350px] border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors font-mono text-sm leading-relaxed" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-6">
            <Card className="border-zinc-200 rounded-2xl">
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="slug" className="font-bold">URL Slug</Label>
                      <button type="button" onClick={generateSlug} className="text-xs font-medium text-brand-blue flex items-center hover:underline">
                        <Edit2 size={10} className="mr-1" /> Auto-generate
                      </button>
                    </div>
                    <Input id="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. web-design-trends-2024" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author" className="font-bold">Author</Label>
                    <Input id="author" value={formData.author} onChange={handleChange} placeholder="e.g. John Doe" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="font-bold">Category</Label>
                    <select id="category" value={formData.category} onChange={handleChange} className="w-full h-9 px-3 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black transition-colors">
                      <option value="Design">Design</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Business">Business</option>
                      <option value="Case Study">Case Study</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coverImage" className="font-bold">Cover Image URL</Label>
                    <Input id="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://..." className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <Label className="font-bold">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.tags || []).map((tag: string) => (
                      <Badge key={tag} className="bg-zinc-100 text-zinc-800 hover:bg-zinc-200 px-3 py-1 text-sm font-semibold flex items-center gap-2">
                        {tag} <XIcon className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add a tag..." className="max-w-xs border-zinc-200 rounded-xl" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                    <Button variant="outline" onClick={addTag} className="rounded-xl border-zinc-200">Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6 mt-6">
            <Card className="border-zinc-200 rounded-2xl">
              <CardHeader>
                <CardTitle>Search Engine Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle" className="font-bold">Meta Title</Label>
                  <Input id="metaTitle" value={formData.metaTitle} onChange={handleChange} placeholder="SEO title for search results..." className="border-zinc-200 rounded-xl" />
                  <p className="text-xs text-zinc-500 text-right">{(formData.metaTitle || '').length} / 60 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDesc" className="font-bold">Meta Description</Label>
                  <Textarea id="metaDesc" value={formData.metaDesc} onChange={handleChange} placeholder="Brief description for search engines..." className="min-h-[100px] border-zinc-200 rounded-xl" />
                  <p className="text-xs text-zinc-500 text-right">{(formData.metaDesc || '').length} / 160 characters</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Blog Posts</h1>
          <p className="text-zinc-500 font-medium">Write and publish articles for your audience.</p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto gap-2 bg-black text-white hover:bg-zinc-800 rounded-full font-bold">
          <Plus size={16} />
          Create Post
        </Button>
      </div>

      <Card className="border-zinc-200">
        <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl w-full sm:w-80">
            <Search size={16} className="text-zinc-400" />
            <input type="text" placeholder="Search posts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent text-sm w-full focus:outline-none" />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <Button variant={statusFilter === 'all' ? 'default' : 'outline'} size="sm" className="rounded-xl border-zinc-200" onClick={() => setStatusFilter('all')}>All</Button>
            <Button variant={statusFilter === 'published' ? 'default' : 'outline'} size="sm" className="rounded-xl border-zinc-200" onClick={() => setStatusFilter('published')}>Published</Button>
            <Button variant={statusFilter === 'draft' ? 'default' : 'outline'} size="sm" className="rounded-xl border-zinc-200" onClick={() => setStatusFilter('draft')}>Drafts</Button>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-100 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Author & Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredPosts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-black text-base max-w-[300px] truncate">
                      {post.title}
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-600">
                      {post.category}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-black">{post.author || 'Unknown'}</p>
                      <p className="text-zinc-500 text-xs">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={post.status === 'Published' ? "bg-brand-lime text-black px-2 py-0.5" : "bg-zinc-100 text-zinc-600 px-2 py-0.5"}>
                        {post.status || 'Draft'}
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
                          <DropdownMenuItem onClick={() => handleEdit(post)} className="cursor-pointer font-medium">Edit Post</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleDelete(post.id); }} className="text-red-600 focus:bg-red-50 focus:text-red-700 font-bold cursor-pointer">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredPosts.length === 0 && !loading && (
                    <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
                              <Search size={24} className="text-zinc-300" />
                            </div>
                            <p className="text-zinc-500 font-medium">No blog posts found.</p>
                            <p className="text-zinc-400 text-sm">Create your first post to get started.</p>
                          </div>
                        </td>
                    </tr>
                )}
                {loading && (
                    <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-zinc-300 border-t-black rounded-full animate-spin"></div>
                            <span className="text-zinc-500 font-medium">Loading posts...</span>
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
