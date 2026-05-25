import { Upload, Search, Filter, Image as ImageIcon, Video, File, Trash2, MoreHorizontal, Copy } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { useCollection } from '../../lib/useCollection';
import { createDocument, deleteDocument, uploadFile } from '../../lib/crud';
import { useToast } from '../../lib/ToastContext';
import React, { useRef, useState } from 'react';

export default function AdminMedia() {
  const { data: media, loading } = useCollection<any>('media');
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const topFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(`media/${file.name}`, file);
        
        const fileType = file.type.startsWith('image/') ? 'image' 
                     : file.type.startsWith('video/') ? 'video' 
                     : 'document';
        
        await createDocument('media', {
          name: file.name,
          type: fileType,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          url: url
        });
      }
      addToast(`${files.length} file(s) uploaded successfully`, 'success');
    } catch (error) {
      addToast('Failed to upload file. Please try again.', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (topFileInputRef.current) topFileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this media?')) {
        await deleteDocument('media', id);
        addToast('Media file deleted', 'success');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast('URL copied to clipboard', 'info');
  };

  const filteredMedia = media.filter((item: any) =>
    filterType === 'all' || item.type === filterType
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Media Library</h1>
          <p className="text-zinc-500 font-medium">Manage your images, videos, and documents.</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <input 
            type="file" 
            multiple
            onChange={handleFileUpload} 
            ref={topFileInputRef} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            disabled={isUploading}
          />
          <Button className="w-full sm:w-auto gap-2 bg-brand-blue text-white hover:bg-blue-700 rounded-full font-bold shadow-lg shadow-blue-500/20 pointer-events-none">
            <Upload size={16} />
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </div>
      </div>

      <Card className="border-zinc-200">
        <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50/50 rounded-t-xl">
          <div className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-2 rounded-xl w-full md:w-96 shadow-sm">
            <Search size={16} className="text-zinc-400" />
            <input type="text" placeholder="Search media by name..." className="bg-transparent text-sm w-full focus:outline-none" />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Button variant={filterType === 'all' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilterType('all')} className="rounded-full font-bold bg-white border border-zinc-200"><Filter size={14} className="mr-2" /> All Media</Button>
            <Button variant={filterType === 'image' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilterType('image')} className="rounded-full font-medium text-zinc-500 hover:text-black hover:bg-zinc-100">Images</Button>
            <Button variant={filterType === 'video' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilterType('video')} className="rounded-full font-medium text-zinc-500 hover:text-black hover:bg-zinc-100">Videos</Button>
            <Button variant={filterType === 'document' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilterType('document')} className="rounded-full font-medium text-zinc-500 hover:text-black hover:bg-zinc-100">Documents</Button>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {/* Upload Box */}
            <div className="aspect-square border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer group relative overflow-hidden">
              <input 
                  type="file" 
                  multiple
                  onChange={handleFileUpload} 
                  ref={fileInputRef} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                  disabled={isUploading}
                />
              <div className="w-12 h-12 bg-white shadow-sm border border-zinc-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                 {isUploading ? (
                     <div className="w-5 h-5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Upload size={20} className="text-zinc-400" />
                  )}
              </div>
              <span className="font-bold text-sm text-zinc-600">{isUploading ? 'Uploading...' : 'Upload Media'}</span>
            </div>

            {/* Media Items */}
            {filteredMedia.map((item: any) => (
              <div key={item.id} className="group relative">
                <div className="aspect-square bg-zinc-100 rounded-2xl border border-zinc-200 flex items-center justify-center overflow-hidden mb-2 relative">
                  {item.type === 'image' && item.url ? (
                      <img src={item.url} className="w-full h-full object-cover" alt={item.name} />
                  ) : item.type === 'image' ? (
                      <ImageIcon size={32} className="text-zinc-300" />
                  ) : item.type === 'video' ? (
                      <Video size={32} className="text-zinc-300" />
                  ) : (
                      <File size={32} className="text-zinc-300" />
                  )}
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button variant="secondary" size="icon" onClick={() => handleCopyUrl(item.url)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-black border-none backdrop-blur-sm"><Copy size={14} /></Button>
                    <Button variant="destructive" onClick={() => handleDelete(item.id)} size="icon" className="w-8 h-8 rounded-full z-20"><Trash2 size={14} /></Button>
                  </div>
                </div>
                
                <div className="flex items-start justify-between">
                  <div className="overflow-hidden flex-1">
                    <p className="text-sm font-bold text-black truncate">{item.name}</p>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">{item.size} •  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-zinc-400 hover:text-black mt-0.5 outline-none">
                      <span className="sr-only">Options</span>
                      <MoreHorizontal size={14} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem className="font-medium cursor-pointer" onClick={() => handleCopyUrl(item.url)}>Copy URL</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 font-bold focus:bg-red-50 focus:text-red-700 cursor-pointer" onClick={() => handleDelete(item.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredMedia.length === 0 && !loading && !isUploading && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
                  <ImageIcon size={24} className="text-zinc-300" />
                </div>
                <p className="text-zinc-500 font-medium">No media files found.</p>
                <p className="text-zinc-400 text-sm">Upload your first file to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
