import React, { useState } from 'react';
import { Plus, MoreHorizontal, Save, Edit2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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

export default function AdminShowcaseCards() {
  const { data: cards, loading } = useCollection<any>('showcase_hero_cards');
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentCard, setCurrentCard] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const defaultFormData = {
    type: 'website-preview',
    title: '',
    subtitle: '',
    imageUrl: '',
    width: 320,
    height: 240,
    initialX: 0,
    initialY: 0,
    rotation: 0,
    floatSpeed: 4,
    scale: 1,
    zIndex: 10,
    stats_a: '',
    stats_b: '',
    stats_c: ''
  };

  const [formData, setFormData] = useState(defaultFormData);

  const handleCreate = () => {
    setCurrentCard(null);
    setFormData(defaultFormData);
    setIsEditing(true);
  };

  const handleEdit = (card: any) => {
    setCurrentCard(card);
    setFormData({
      type: card.type || 'website-preview',
      title: card.title || '',
      subtitle: card.subtitle || '',
      imageUrl: card.imageUrl || '',
      width: card.width || 320,
      height: card.height || 240,
      initialX: card.initialX || 0,
      initialY: card.initialY || 0,
      rotation: card.rotation || 0,
      floatSpeed: card.floatSpeed || 4,
      scale: card.scale || 1,
      zIndex: card.zIndex || 10,
      stats_a: card.stats?.a || '',
      stats_b: card.stats?.b || '',
      stats_c: card.stats?.c || ''
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      await deleteDocument('showcase_hero_cards', id);
      addToast('Card deleted successfully', 'success');
    } catch (err) {
      addToast('Failed to delete card', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const cardData = {
        type: formData.type,
        title: formData.title,
        subtitle: formData.subtitle,
        imageUrl: formData.imageUrl,
        width: Number(formData.width),
        height: Number(formData.height),
        initialX: Number(formData.initialX),
        initialY: Number(formData.initialY),
        rotation: Number(formData.rotation),
        floatSpeed: Number(formData.floatSpeed),
        scale: Number(formData.scale),
        zIndex: Number(formData.zIndex),
        stats: {
          a: formData.stats_a,
          b: formData.stats_b,
          c: formData.stats_c
        }
      };

      if (currentCard?.id) {
        await updateDocument('showcase_hero_cards', currentCard.id, cardData);
        addToast('Card updated successfully', 'success');
      } else {
        await createDocument('showcase_hero_cards', cardData);
        addToast('Card created successfully', 'success');
      }
      setIsEditing(false);
    } catch (err) {
      addToast('Failed to save card', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setIsEditing(false)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {currentCard ? 'Edit Card' : 'New Card'}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Card Details</CardTitle>
              <CardDescription>Configure the showcase card layout and content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Card Type</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="website-preview">Website Preview</option>
                    <option value="text-editorial">Text Editorial</option>
                    <option value="image-showcase">Image Showcase</option>
                    <option value="stats-card">Stats Card</option>
                    <option value="story-card">Story Card</option>
                    <option value="pricing-card">Pricing Card</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input 
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image URL (Optional)</Label>
                  <Input 
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  />
                </div>
              </div>

              {formData.type === 'stats-card' && (
                <div className="grid grid-cols-3 gap-4 border p-4 rounded-lg bg-zinc-50">
                  <div className="space-y-2">
                    <Label>Stat A</Label>
                    <Input value={formData.stats_a} onChange={(e) => setFormData({...formData, stats_a: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Stat B</Label>
                    <Input value={formData.stats_b} onChange={(e) => setFormData({...formData, stats_b: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Stat C</Label>
                    <Input value={formData.stats_c} onChange={(e) => setFormData({...formData, stats_c: e.target.value})} />
                  </div>
                </div>
              )}

              <h3 className="font-semibold text-lg mt-8 mb-4 border-b pb-2">Physics & Layout</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Width (px)</Label>
                  <Input type="number" value={formData.width} onChange={(e) => setFormData({...formData, width: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Height (px)</Label>
                  <Input type="number" value={formData.height} onChange={(e) => setFormData({...formData, height: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Initial X Offset (%)</Label>
                  <Input type="number" value={formData.initialX} onChange={(e) => setFormData({...formData, initialX: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Initial Y Offset (%)</Label>
                  <Input type="number" value={formData.initialY} onChange={(e) => setFormData({...formData, initialY: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Rotation (deg)</Label>
                  <Input type="number" value={formData.rotation} onChange={(e) => setFormData({...formData, rotation: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Float Speed (sec)</Label>
                  <Input type="number" step="0.1" value={formData.floatSpeed} onChange={(e) => setFormData({...formData, floatSpeed: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Scale (1 = 100%)</Label>
                  <Input type="number" step="0.1" value={formData.scale} onChange={(e) => setFormData({...formData, scale: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Z-Index (Depth)</Label>
                  <Input type="number" value={formData.zIndex} onChange={(e) => setFormData({...formData, zIndex: Number(e.target.value)})} />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Card'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hero Showcase Cards</h1>
          <p className="text-muted-foreground">Manage the floating cards on the homepage hero.</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Add Card
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : cards?.length === 0 ? (
          <p className="text-muted-foreground col-span-full py-8 text-center bg-zinc-50 rounded-xl border border-dashed">
            No cards added yet. Click "Add Card" or they will fallback to defaults.
          </p>
        ) : (
          cards?.map((card: any) => (
            <Card key={card.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <CardDescription className="uppercase tracking-widest text-[10px] mt-1">{card.type}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mr-2">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(card)}>
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(card.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              {card.imageUrl && (
                <div className="w-full h-32 bg-zinc-100 overflow-hidden">
                  <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="pt-4 text-xs text-zinc-500 space-y-1 border-t">
                <div className="flex justify-between"><span>Width:</span> <span className="font-mono text-black">{card.width}px</span></div>
                <div className="flex justify-between"><span>Offset:</span> <span className="font-mono text-black">X:{card.initialX} Y:{card.initialY}</span></div>
                <div className="flex justify-between"><span>Z-Index:</span> <span className="font-mono text-black">{card.zIndex}</span></div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
