import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Upload } from 'lucide-react';
import { getDocument, createDocument, updateDocument, uploadFile } from '../../lib/crud';

export default function AdminTemplateEdit() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    currency: 'USD',
    description: '',
    heroImage: '',
    paypalLink: '',
    upiQrCode: '',
    upiId: '',
    accessLink: '',
    isPublic: true
  });

  useEffect(() => {
    if (!isNew && id) {
      getDocument('templates', id).then(data => {
        if (data) {
          setFormData({
            title: data.title || '',
            category: data.category || '',
            price: data.price || '',
            currency: data.currency || 'USD',
            description: data.description || '',
            heroImage: data.heroImage || '',
            paypalLink: data.paypalLink || '',
            upiQrCode: data.upiQrCode || '',
            upiId: data.upiId || '',
            accessLink: data.accessLink || '',
            isPublic: data.isPublic !== false
          });
        }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'heroImage' | 'upiQrCode') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await uploadFile('media', file);
        setFormData(prev => ({ ...prev, [fieldName]: base64 }));
      } catch (err) {
        console.error('Upload failed', err);
        alert('Image upload failed');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await createDocument('templates', formData);
      } else {
        await updateDocument('templates', id!, formData);
      }
      navigate('/admin/templates');
    } catch (err) {
      console.error(err);
      alert('Failed to save template');
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link to="/admin/templates" className="inline-flex items-center text-zinc-500 hover:text-black transition-colors mb-6 font-medium">
        <ArrowLeft size={16} className="mr-2" /> Back to Templates
      </Link>
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-display">{isNew ? 'New Template' : 'Edit Template'}</h1>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-brand-lime text-black rounded-xl hover:bg-lime-400 font-bold transition-colors disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Template'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">Template Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required
                className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:outline-none transition-all"
                placeholder="e.g. Altitude — Cinematic Luxury Rooftop Cafe"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Category / Tech Stack</label>
                <input 
                  type="text" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:outline-none transition-all"
                  placeholder="e.g. HTML/CSS/JS"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Currency</label>
                  <select 
                    name="currency" 
                    value={formData.currency} 
                    onChange={handleChange as any} 
                    className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:outline-none transition-all"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Price Label</label>
                  <input 
                    type="text" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:outline-none transition-all"
                    placeholder="e.g. $10.00 or ₹800"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">Description / Features (One per line)</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={8}
                className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:outline-none transition-all font-mono text-sm"
                placeholder="Feature 1\nFeature 2\nFeature 3"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isPublic" 
                  checked={formData.isPublic} 
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-zinc-300 text-black focus:ring-brand-lime"
                />
                <span className="font-bold text-zinc-700">Published / Public</span>
              </label>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
              <h3 className="font-bold text-lg mb-4 flex items-center"><ImageIcon size={18} className="mr-2"/> Hero Image</h3>
              {formData.heroImage ? (
                <div className="mb-4 relative rounded-xl overflow-hidden group">
                  <img src={formData.heroImage} alt="Hero" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => setFormData(prev => ({...prev, heroImage: ''}))} className="text-white bg-red-500 px-3 py-1 rounded-lg text-sm font-bold hover:bg-red-600">Remove</button>
                  </div>
                </div>
              ) : null}
              <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-zinc-300 rounded-xl cursor-pointer hover:bg-zinc-50 hover:border-brand-lime transition-all text-sm font-bold text-zinc-500">
                <Upload size={18} className="mr-2" /> Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'heroImage')} />
              </label>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
              <h3 className="font-bold text-lg mb-4">Payment Options</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-zinc-700 mb-2">Template Access/Download Link</label>
                <input 
                  type="url" 
                  name="accessLink" 
                  value={formData.accessLink} 
                  onChange={handleChange} 
                  className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:outline-none transition-all text-sm"
                  placeholder="https://drive.google.com/... or /downloads/..."
                />
                <p className="text-xs text-zinc-500 mt-2">Users will be directed here after UPI payment to access the template.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-zinc-700 mb-2">PayPal Link</label>
                <input 
                  type="url" 
                  name="paypalLink" 
                  value={formData.paypalLink} 
                  onChange={handleChange} 
                  className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:outline-none transition-all text-sm"
                  placeholder="https://www.paypal.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">UPI ID String</label>
                <input 
                  type="text" 
                  name="upiId" 
                  value={formData.upiId} 
                  onChange={handleChange} 
                  className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:outline-none transition-all text-sm mb-6"
                  placeholder="e.g. dreweb@ybl"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">UPI QR Code Image</label>
                {formData.upiQrCode ? (
                  <div className="mb-4 relative rounded-xl overflow-hidden group bg-zinc-100 flex items-center justify-center p-2 h-40">
                    <img src={formData.upiQrCode} alt="UPI QR Code" className="h-full object-contain mix-blend-multiply" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => setFormData(prev => ({...prev, upiQrCode: ''}))} className="text-white bg-red-500 px-3 py-1 rounded-lg text-sm font-bold hover:bg-red-600">Remove</button>
                    </div>
                  </div>
                ) : null}
                <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-zinc-300 rounded-xl cursor-pointer hover:bg-zinc-50 hover:border-brand-lime transition-all text-sm font-bold text-zinc-500">
                  <Upload size={18} className="mr-2" /> Upload QR Code
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'upiQrCode')} />
                </label>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
