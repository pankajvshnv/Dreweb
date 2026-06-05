import React, { useState, useRef, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { uploadFile, getSettings, saveSettings } from '../../lib/crud';
import { useToast } from '../../lib/ToastContext';
import localforage from 'localforage';

export default function AdminSettings() {
  const { addToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Branding state
  const [logoLight, setLogoLight] = useState('');
  const [logoDark, setLogoDark] = useState('');
  const [favicon, setFavicon] = useState('');

  // General state
  const [general, setGeneral] = useState({
    siteName: 'dreweb',
    tagline: 'Digital Creative Studio',
    description: 'We build digital experiences that convert & scale.',
  });

  // SEO state
  const [seo, setSeo] = useState({
    defaultMetaTitle: 'Dreweb | Digital Creative Studio',
    defaultMetaDesc: 'We build digital experiences that convert & scale.',
    googleAnalyticsId: '',
    metaPixelId: '',
  });

  // Contact & Social state
  const [contact, setContact] = useState({
    email: 'hello@dreweb.online',
    phone: '+91 123 456 7890',
    location: 'Indore, Madhya Pradesh, India',
    twitter: 'https://twitter.com/dreweb',
    linkedin: 'https://linkedin.com/company/dreweb',
    instagram: 'https://instagram.com/drewebofficial',
    behance: 'https://behance.net/dreweb',
  });

  // GitHub Integration state
  const [ghToken, setGhToken] = useState('');
  const [ghRepo, setGhRepo] = useState('pankajvshnv/dreweb');
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const lightInputRef = useRef<HTMLInputElement>(null);
  const darkInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadSettings() {
      const branding = await getSettings('branding');
      if (branding) {
        if (branding.logoLight) setLogoLight(branding.logoLight);
        if (branding.logoDark) setLogoDark(branding.logoDark);
        if (branding.favicon) setFavicon(branding.favicon);
      }
      const generalData = await getSettings('general');
      if (generalData && Object.keys(generalData).length > 0) {
        setGeneral(prev => ({ ...prev, ...generalData }));
      }
      const contactData = await getSettings('contact');
      if (contactData && Object.keys(contactData).length > 0) {
        setContact(prev => ({ ...prev, ...contactData }));
      }
      const seoData = await getSettings('seo');
      if (seoData && Object.keys(seoData).length > 0) {
        setSeo(prev => ({ ...prev, ...seoData }));
      }
      const savedToken = localStorage.getItem('github_token') || await localforage.getItem('github_token') || '';
      const savedRepo = localStorage.getItem('github_repo') || await localforage.getItem('github_repo') || 'pankajvshnv/dreweb';
      setGhToken(savedToken);
      setGhRepo(savedRepo);
    }
    loadSettings();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'light' | 'dark' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const path = `branding/${type}_${file.name}`;
      const url = await uploadFile(path, file);
      
      if (type === 'light') setLogoLight(url);
      if (type === 'dark') setLogoDark(url);
      if (type === 'favicon') setFavicon(url);

      const payload = { 
        [type === 'light' ? 'logoLight' : type === 'dark' ? 'logoDark' : 'favicon']: url 
      };
      await saveSettings('branding', payload);
      addToast(`${type === 'favicon' ? 'Favicon' : `${type} logo`} uploaded successfully`, 'success');
    } catch (error) {
      addToast('Failed to upload image. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await saveSettings('general', general);
      await saveSettings('contact', contact);
      await saveSettings('seo', seo);
      
      // Save GitHub credentials
      localStorage.setItem('github_token', ghToken);
      localStorage.setItem('github_repo', ghRepo);
      await localforage.setItem('github_token', ghToken);
      await localforage.setItem('github_repo', ghRepo);

      addToast('Settings saved successfully', 'success');
    } catch (error) {
      addToast('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!ghToken) {
      addToast('Please enter a GitHub Personal Access Token first.', 'error');
      return;
    }
    setIsTestingConnection(true);
    try {
      const url = `https://api.github.com/repos/${ghRepo}/contents/src/lib/db.json`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `token ${ghToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (res.ok) {
        addToast('Connection successful! Connected to GitHub Repository.', 'success');
      } else {
        throw new Error(res.statusText);
      }
    } catch (e) {
      addToast('Failed to connect to GitHub. Check repository path and token permissions.', 'error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneral(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSeo(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Website Settings</h1>
          <p className="text-zinc-500 font-medium">Manage your agency's branding, contact info, and integrations.</p>
        </div>
        <Button onClick={handleSaveAll} disabled={isSaving} className="w-full sm:w-auto rounded-full font-bold bg-black text-white hover:bg-zinc-800 gap-2">
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5 sm:w-[620px] bg-zinc-100 p-1 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg text-xs font-bold uppercase tracking-wider">General</TabsTrigger>

          <TabsTrigger value="contact" className="rounded-lg text-xs font-bold uppercase tracking-wider">Contact</TabsTrigger>
          <TabsTrigger value="seo" className="rounded-lg text-xs font-bold uppercase tracking-wider">SEO & Tracking</TabsTrigger>
          <TabsTrigger value="github" className="rounded-lg text-xs font-bold uppercase tracking-wider">GitHub Sync</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card className="border-zinc-200 rounded-2xl">
            <CardHeader>
              <CardTitle>Website Configuration</CardTitle>
              <CardDescription>Core details about your site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="font-bold">Site Name</Label>
                <Input id="siteName" value={general.siteName} onChange={handleGeneralChange} className="border-zinc-200 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline" className="font-bold">Tagline</Label>
                <Input id="tagline" value={general.tagline} onChange={handleGeneralChange} className="border-zinc-200 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Default SEO Description</Label>
                <Input id="description" value={general.description} onChange={handleGeneralChange} className="border-zinc-200 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>



        <TabsContent value="contact" className="space-y-6 mt-6">
          <Card className="border-zinc-200 rounded-2xl">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold">Contact Email</Label>
                  <Input id="email" value={contact.email} onChange={handleContactChange} className="border-zinc-200 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-bold">Phone Number</Label>
                  <Input id="phone" value={contact.phone} onChange={handleContactChange} className="border-zinc-200 rounded-xl" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location" className="font-bold">Office Address</Label>
                  <Input id="location" value={contact.location} onChange={handleContactChange} className="border-zinc-200 rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-zinc-200 rounded-2xl">
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="font-bold">Twitter</Label>
                  <Input id="twitter" value={contact.twitter} onChange={handleContactChange} className="border-zinc-200 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="font-bold">LinkedIn</Label>
                  <Input id="linkedin" value={contact.linkedin} onChange={handleContactChange} className="border-zinc-200 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="font-bold">Instagram</Label>
                  <Input id="instagram" value={contact.instagram} onChange={handleContactChange} className="border-zinc-200 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="behance" className="font-bold">Behance</Label>
                  <Input id="behance" value={contact.behance} onChange={handleContactChange} className="border-zinc-200 rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6 mt-6">
          <Card className="border-zinc-200 rounded-2xl">
            <CardHeader>
              <CardTitle>Global SEO Defaults</CardTitle>
              <CardDescription>These will be used if a specific page lacks SEO tags.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultMetaTitle" className="font-bold">Default Meta Title</Label>
                <Input id="defaultMetaTitle" value={seo.defaultMetaTitle} onChange={handleSeoChange} className="border-zinc-200 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultMetaDesc" className="font-bold">Default Meta Description</Label>
                <Input id="defaultMetaDesc" value={seo.defaultMetaDesc} onChange={handleSeoChange} className="border-zinc-200 rounded-xl" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-zinc-200 rounded-2xl">
            <CardHeader>
              <CardTitle>Tracking & Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId" className="font-bold">Google Analytics ID (e.g. G-XXXXXXX)</Label>
                <Input id="googleAnalyticsId" value={seo.googleAnalyticsId} onChange={handleSeoChange} className="border-zinc-200 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaPixelId" className="font-bold">Meta Pixel ID</Label>
                <Input id="metaPixelId" value={seo.metaPixelId} onChange={handleSeoChange} className="border-zinc-200 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="github" className="space-y-6 mt-6">
          <Card className="border-zinc-200 rounded-2xl">
            <CardHeader>
              <CardTitle>GitHub CMS Integration</CardTitle>
              <CardDescription>
                Configure direct online publishing. When set up, edits on your live website will commit directly to GitHub, triggering instant Vercel redeployment!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ghRepo" className="font-bold">GitHub Repository (username/repository)</Label>
                <Input 
                  id="ghRepo" 
                  value={ghRepo} 
                  onChange={(e) => setGhRepo(e.target.value)} 
                  placeholder="e.g. username/repo-name" 
                  className="border-zinc-200 rounded-xl font-mono" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ghToken" className="font-bold flex items-center justify-between">
                  <span>GitHub Personal Access Token (PAT)</span>
                  <a 
                    href="https://github.com/settings/personal-access-tokens/new" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-brand-lime hover:underline font-bold bg-black px-2 py-0.5 rounded"
                  >
                    Generate Token ↗
                  </a>
                </Label>
                <Input 
                  id="ghToken" 
                  type="password" 
                  value={ghToken} 
                  onChange={(e) => setGhToken(e.target.value)} 
                  placeholder="github_pat_..." 
                  className="border-zinc-200 rounded-xl font-mono" 
                />
                <p className="text-[11px] text-zinc-400 font-medium">
                  Ensure the token has **Read & Write** access to **Contents** on this repository. Saved securely inside your local browser.
                </p>
              </div>

              <div className="pt-4 flex gap-4">
                <Button 
                  type="button"
                  onClick={handleTestConnection} 
                  disabled={isTestingConnection}
                  variant="outline" 
                  className="rounded-xl border-zinc-200 font-bold"
                >
                  {isTestingConnection ? 'Testing...' : 'Test Connection'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
