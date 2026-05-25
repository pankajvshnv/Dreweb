import React, { useState } from 'react';
import { Plus, MoreHorizontal, Search, ArrowLeft, Save, Edit2, X as XIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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

export default function AdminPricing() {
  const { data: plans, loading } = useCollection<any>('pricing');
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [featureInput, setFeatureInput] = useState('');

  const [formData, setFormData] = useState<any>({
    name: '',
    price: '',
    billingType: 'One-time',
    description: '',
    features: [] as string[],
    nots: [] as string[],
    isFeatured: false,
    isActive: true,
    cta: 'Get Started',
  });

  const handleCreate = () => {
    setCurrentPlan(null);
    setFormData({
      name: '',
      price: '',
      billingType: 'One-time',
      description: '',
      features: [],
      nots: [],
      isFeatured: false,
      isActive: true,
      cta: 'Get Started',
    });
    setIsEditing(true);
  };

  const handleEdit = (plan: any) => {
    setCurrentPlan(plan);
    setFormData({
      name: plan.name || '',
      price: plan.price || '',
      billingType: plan.billingType || 'One-time',
      description: plan.description || '',
      features: plan.features || [],
      nots: plan.nots || [],
      isFeatured: plan.isFeatured || false,
      isActive: plan.isActive !== false,
      cta: plan.cta || 'Get Started',
    });
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev: any) => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
      setFeatureInput('');
    }
  };

  const removeFeature = (idx: number) => {
    setFormData((prev: any) => ({ ...prev, features: prev.features.filter((_: string, i: number) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      addToast('Plan name is required', 'error');
      return;
    }
    if (!formData.price.trim()) {
      addToast('Price is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (currentPlan?.id) {
        const dataToSave = { ...formData };
        await updateDocument('pricing', currentPlan.id, dataToSave);
        addToast('Pricing plan updated successfully', 'success');
      } else {
        await createDocument('pricing', formData);
        addToast('Pricing plan created successfully', 'success');
      }
      setIsEditing(false);
    } catch (error) {
      addToast('Failed to save plan', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      await deleteDocument('pricing', id);
      addToast('Pricing plan deleted', 'success');
    }
  };

  const handleMakeFeatured = async (id: string) => {
    // Unfeatured all plans first, then feature the selected
    for (const plan of plans) {
      if (plan.isFeatured) {
        await updateDocument('pricing', plan.id, { isFeatured: false });
      }
    }
    await updateDocument('pricing', id, { isFeatured: true });
    addToast('Plan marked as featured', 'success');
  };

  const filteredPlans = plans.filter((p: any) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
                {currentPlan ? `Edit: ${currentPlan.name}` : 'Create Pricing Plan'}
              </h1>
              <p className="text-zinc-500 text-sm font-medium">Configure plan details, pricing, and features.</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="rounded-full font-bold bg-black text-white hover:bg-zinc-800 gap-2">
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Plan'}
          </Button>
        </div>

        <Card className="border-zinc-200 rounded-2xl">
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
            <CardDescription>Basic information about this pricing tier.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold">Plan Name</Label>
                <Input id="name" value={formData.name} onChange={handleChange} placeholder="e.g. Professional" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="font-bold">Price</Label>
                <Input id="price" value={formData.price} onChange={handleChange} placeholder="e.g. $2,499 or Custom" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingType" className="font-bold">Billing Type</Label>
                <select id="billingType" value={formData.billingType} onChange={handleChange} className="w-full h-9 px-3 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black transition-colors">
                  <option value="One-time">One-time</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta" className="font-bold">CTA Button Text</Label>
                <Input id="cta" value={formData.cta} onChange={handleChange} placeholder="e.g. Get Started" className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="description" className="font-bold">Description</Label>
              <Input id="description" value={formData.description} onChange={handleChange} placeholder="Brief description of this plan..." className="border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white transition-colors" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 rounded-2xl">
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>List of features included in this plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {(formData.features || []).map((f: string, i: number) => (
                <Badge key={i} className="bg-zinc-100 text-zinc-800 hover:bg-zinc-200 px-3 py-1 text-sm font-semibold flex items-center gap-2">
                  {f} <XIcon className="w-3 h-3 hover:text-red-500 cursor-pointer" onClick={() => removeFeature(i)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={featureInput} onChange={e => setFeatureInput(e.target.value)} placeholder="Add a feature (e.g. Unlimited Pages)" className="max-w-sm border-zinc-200 rounded-xl" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
              <Button variant="outline" onClick={addFeature} className="rounded-xl border-zinc-200">Add</Button>
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
                <Label className="text-base font-bold">Featured Plan</Label>
                <p className="text-sm text-zinc-500">Highlight this plan as recommended.</p>
              </div>
              <Switch checked={formData.isFeatured} onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, isFeatured: checked }))} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label className="text-base font-bold">Active</Label>
                <p className="text-sm text-zinc-500">Show this plan on the frontend.</p>
              </div>
              <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, isActive: checked }))} />
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
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Pricing Plans</h1>
          <p className="text-zinc-500 font-medium">Manage pricing tiers and featured plans.</p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto gap-2 bg-black text-white hover:bg-zinc-800 rounded-full font-bold">
          <Plus size={16} />
          Add Pricing Plan
        </Button>
      </div>

      <Card className="border-zinc-200">
        <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl w-full sm:w-80">
            <Search size={16} className="text-zinc-400" />
            <input type="text" placeholder="Search plans..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent text-sm w-full focus:outline-none" />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-100 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Plan Details</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredPlans.map((plan: any) => (
                  <tr key={plan.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-black text-base">{plan.name}</p>
                          {plan.isFeatured && (
                            <Badge variant="outline" className="text-[10px] uppercase font-bold text-brand-blue border-brand-blue/30 bg-brand-blue/5">Featured</Badge>
                          )}
                        </div>
                        <p className="text-zinc-500 text-xs mt-0.5">{plan.billingType || 'One-time'} Billing</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-lg">{plan.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={plan.isActive !== false ? "bg-brand-lime text-black px-2 py-0.5" : "bg-zinc-100 text-zinc-600 px-2 py-0.5 whitespace-nowrap"}>
                        {plan.isActive !== false ? 'Active' : 'Draft'}
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
                          <DropdownMenuItem onClick={() => handleEdit(plan)} className="cursor-pointer font-medium">Edit Plan</DropdownMenuItem>
                          {!plan.isFeatured && (
                            <DropdownMenuItem onClick={() => handleMakeFeatured(plan.id)} className="cursor-pointer font-medium text-brand-blue">Make Featured</DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(plan.id)} className="text-red-600 focus:bg-red-50 focus:text-red-700 font-bold cursor-pointer">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredPlans.length === 0 && !loading && (
                    <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
                              <Search size={24} className="text-zinc-300" />
                            </div>
                            <p className="text-zinc-500 font-medium">No pricing plans found.</p>
                            <p className="text-zinc-400 text-sm">Create your first plan to get started.</p>
                          </div>
                        </td>
                    </tr>
                )}
                {loading && (
                    <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-zinc-300 border-t-black rounded-full animate-spin"></div>
                            <span className="text-zinc-500 font-medium">Loading plans...</span>
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
