import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, LayoutTemplate, X as XIcon, Edit2, UploadCloud } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { createDocument, updateDocument, uploadFile, getDocument } from '../../lib/crud';
import { useToast } from '../../lib/ToastContext';

export default function AdminProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { addToast } = useToast();
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    client: '',
    industry: '',
    year: '',
    duration: '',
    shortDescription: '',
    challenge: '',
    solution: '',
    technologies: [],
    link: '',
    github: '',
    isFeatured: false,
    isPublic: true,
    heroImage: '',
    gallery: [],
    metaTitle: '',
    metaDesc: '',
    keywords: ''
  });

  useEffect(() => {
    if (!isNew) {
      // Fetch existing project
      const fetchProject = async () => {
        const data = await getDocument('projects', id as string);
        if (data) {
          setFormData({ ...data, id: data.id });
        }
      };
      fetchProject();
    }
  }, [id, isNew]);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const generateSlug = () => {
    const newSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData((prev: any) => ({ ...prev, slug: newSlug }));
  };

  const handleToggle = (id: string, checked: boolean) => {
    setFormData((prev: any) => ({ ...prev, [id]: checked }));
  };

  const addTech = () => {
    if (techInput.trim()) {
      setFormData((prev: any) => ({ ...prev, technologies: [...(prev.technologies || []), techInput.trim()] }));
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData((prev: any) => ({ ...prev, technologies: prev.technologies.filter((t: string) => t !== tech) }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const path = `projects/${Date.now()}_${file.name}`;
      const url = await uploadFile(path, file);
      setFormData((prev: any) => ({ ...prev, heroImage: url }));
    } catch (error) {
      addToast('Failed to upload image. Please try again.', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setIsPublishing(true);
    try {
      if (isNew) {
        await createDocument('projects', formData);
        addToast('Project created successfully', 'success');
      } else {
         const dataToSave = { ...formData };
         delete dataToSave.id;
        await updateDocument('projects', id as string, dataToSave);
        addToast('Project updated successfully', 'success');
      }
      navigate('/admin/projects');
    } catch (error) {
      console.error(error);
      addToast('Failed to save project', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/projects">
            <Button variant="outline" size="icon" className="rounded-full border-zinc-200">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-display font-extrabold tracking-tight">
              {isNew ? 'Create New Project' : `Edit Project: ${formData.title}`}
            </h1>
            <p className="text-zinc-500 text-sm font-medium">Manage project details, content, and SEO.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} className="rounded-full font-bold bg-black text-white hover:bg-zinc-800 gap-2">
            <Save size={16} />
            {isPublishing ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 sm:w-[400px] bg-zinc-100 p-1 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg text-xs font-bold uppercase tracking-wider">General</TabsTrigger>
          <TabsTrigger value="content" className="rounded-lg text-xs font-bold uppercase tracking-wider">Content</TabsTrigger>
          <TabsTrigger value="media" className="rounded-lg text-xs font-bold uppercase tracking-wider">Media</TabsTrigger>
          <TabsTrigger value="seo" className="rounded-lg text-xs font-bold uppercase tracking-wider">SEO</TabsTrigger>
        </TabsList>
        
        {/* General Tab */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card className="border-zinc-200 rounded-2xl">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Core details about the project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-bold">Project Title</Label>
                  <Input id="title" value={formData.title} onChange={handleChange} placeholder="e.g. Modern E-commerce Platform" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="slug" className="font-bold">URL Slug</Label>
                    <button type="button" onClick={generateSlug} className="text-xs font-medium text-brand-blue flex items-center hover:underline">
                      <Edit2 size={10} className="mr-1" /> Auto-generate
                    </button>
                  </div>
                  <Input id="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. modern-ecommerce-platform" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client" className="font-bold">Client Name</Label>
                  <Input id="client" value={formData.client} onChange={handleChange} placeholder="e.g. Acme Corp" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry" className="font-bold">Industry</Label>
                  <Input id="industry" value={formData.industry} onChange={handleChange} placeholder="e.g. Healthcare" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year" className="font-bold">Year</Label>
                  <Input id="year" value={formData.year} onChange={handleChange} placeholder="e.g. 2024" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="font-bold">Project Duration</Label>
                  <Input id="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 6 Months" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label htmlFor="shortDescription" className="font-bold">Short Description</Label>
                <Textarea id="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Brief summary of the project for cards and lists..." className="min-h-[100px] border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 rounded-2xl">
            <CardHeader>
              <CardTitle>Links & Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="link" className="font-bold">Live Website URL</Label>
                  <Input id="link" value={formData.link} onChange={handleChange} placeholder="https://" className="border-zinc-200 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github" className="font-bold">GitHub Repository</Label>
                  <Input id="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." className="border-zinc-200 rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 rounded-2xl">
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">Featured Project</Label>
                  <p className="text-sm text-zinc-500">Show this project on the homepage.</p>
                </div>
                <Switch checked={formData.isFeatured} onCheckedChange={(checked) => handleToggle('isFeatured', checked)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">Public Status</Label>
                  <p className="text-sm text-zinc-500">Allow users to view this project URL.</p>
                </div>
                <Switch checked={formData.isPublic} onCheckedChange={(checked) => handleToggle('isPublic', checked)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6 mt-6">
          <Card className="border-zinc-200 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>The Challenge</CardTitle>
                <CardDescription>What problems did the client face?</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea id="challenge" value={formData.challenge} onChange={handleChange} placeholder="Describe the initial challenges..." className="min-h-[150px] border-zinc-200 rounded-xl" />
            </CardContent>
          </Card>
          
          <Card className="border-zinc-200 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>The Solution</CardTitle>
                <CardDescription>How did you solve them?</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea id="solution" value={formData.solution} onChange={handleChange} placeholder="Describe your approach and solution..." className="min-h-[150px] border-zinc-200 rounded-xl" />
            </CardContent>
          </Card>

          <Card className="border-zinc-200 rounded-2xl">
            <CardHeader>
              <CardTitle>Technologies Used</CardTitle>
              <CardDescription>Add the tech stack used in this project.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {(formData.technologies || []).map((tech: string) => (
                  <Badge key={tech} className="bg-zinc-100 text-zinc-800 hover:bg-zinc-200 px-3 py-1 text-sm font-semibold flex items-center gap-2">
                    {tech} <XIcon className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => removeTech(tech)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Add technology (e.g. Postgres)" className="max-w-xs border-zinc-200 rounded-xl" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())} />
                <Button variant="outline" onClick={addTech} className="rounded-xl border-zinc-200">Add</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6 mt-6">
          <Card className="border-zinc-200 rounded-2xl">
            <CardHeader>
              <CardTitle>Featured Image / Hero</CardTitle>
              <CardDescription>Main image displayed in portfolio grids.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <Input id="heroImage" value={formData.heroImage} onChange={handleChange} placeholder="Image URL e.g. https://images.unsplash.com/..." className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      ref={fileInputRef} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      disabled={isUploading}
                    />
                    <Button type="button" variant="outline" className="border-zinc-200" disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4 mr-2" />
                          Upload Image
                        </>
                      )}
                    </Button>
                  </div>
                  <span className="text-sm text-zinc-500">or paste a URL above</span>
                </div>
              </div>

              {formData.heroImage && (
                  <div className="mt-4 border border-zinc-200 rounded-lg overflow-hidden max-w-md">
                     <img src={formData.heroImage} alt="Hero preview" className="w-full h-auto object-cover" />
                  </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6 mt-6">
          <Card className="border-zinc-200 rounded-2xl">
            <CardHeader>
              <CardTitle>Search Engine Optimization</CardTitle>
              <CardDescription>Optimize this project for search engines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle" className="font-bold">Meta Title</Label>
                <Input id="metaTitle" value={formData.metaTitle} onChange={handleChange} placeholder="e.g. FinTech UI/UX Case Study" className="border-zinc-200 rounded-xl" />
                <p className="text-xs text-zinc-500 text-right">{(formData.metaTitle || '').length} / 60 characters</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDesc" className="font-bold">Meta Description</Label>
                <Textarea id="metaDesc" value={formData.metaDesc} onChange={handleChange} placeholder="Brief description for search engine results..." className="min-h-[100px] border-zinc-200 rounded-xl" />
                <p className="text-xs text-zinc-500 text-right">{(formData.metaDesc || '').length} / 160 characters</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords" className="font-bold">Keywords</Label>
                <Input id="keywords" value={formData.keywords} onChange={handleChange} placeholder="e.g. web design, fintech, case study (comma separated)" className="border-zinc-200 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
