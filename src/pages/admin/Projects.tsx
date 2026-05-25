import { Link, useNavigate } from 'react-router-dom';
import { Plus, MoreHorizontal, Search, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { useCollection } from '../../lib/useCollection';
import { deleteDocument, updateDocumentsBatch } from '../../lib/crud';
import { useToast } from '../../lib/ToastContext';
import { useState } from 'react';

export default function AdminProjects() {
  const navigate = useNavigate();
  const { data: projects, loading } = useCollection<any>('projects');
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteDocument('projects', id);
      addToast('Project deleted successfully', 'success');
    }
  };

  const filteredProjects = projects.filter((p: any) =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const moveProject = async (index: number, direction: 'up' | 'down') => {
    const sorted = [...filteredProjects];
    let needsInitialOrder = sorted.some(p => typeof p.order !== 'number');
    
    let updates: any[] = [];
    if (needsInitialOrder) {
      sorted.forEach((p, i) => {
        p.order = i;
        updates.push({ id: p.id, data: { order: i } });
      });
    }

    if (direction === 'up' && index > 0) {
      const current = sorted[index];
      const prev = sorted[index - 1];
      const tempOrder = current.order !== undefined ? current.order : index;
      current.order = prev.order !== undefined ? prev.order : index - 1;
      prev.order = tempOrder;
      
      updates.push({ id: current.id, data: { order: current.order } });
      updates.push({ id: prev.id, data: { order: prev.order } });
    } else if (direction === 'down' && index < sorted.length - 1) {
      const current = sorted[index];
      const next = sorted[index + 1];
      const tempOrder = current.order !== undefined ? current.order : index;
      current.order = next.order !== undefined ? next.order : index + 1;
      next.order = tempOrder;
      
      updates.push({ id: current.id, data: { order: current.order } });
      updates.push({ id: next.id, data: { order: next.order } });
    }

    if (updates.length > 0) {
      await updateDocumentsBatch('projects', updates);
      addToast('Project order updated', 'success');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Projects</h1>
          <p className="text-zinc-500 font-medium">Manage your portfolio projects and case studies.</p>
        </div>
        <Link to="/admin/projects/new">
          <Button className="w-full sm:w-auto gap-2 bg-black text-white hover:bg-zinc-800 rounded-full font-bold">
            <Plus size={16} />
            Add New Project
          </Button>
        </Link>
      </div>

      <Card className="border-zinc-200">
        <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl w-full sm:w-80">
            <Search size={16} className="text-zinc-400" />
            <input type="text" placeholder="Search projects..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent text-sm w-full focus:outline-none" />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-100 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Project Info</th>
                  <th className="px-6 py-4">Industry</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredProjects.map((project: any, idx: number) => (
                  <tr key={project.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center font-display font-bold text-zinc-400 text-xs shrink-0 overflow-hidden">
                          {project.heroImage ? (
                            <img src={project.heroImage} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-200 rounded-lg">
                              IMG
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-black">{project.title}</p>
                          <p className="text-zinc-500 text-xs">/{project.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 font-medium">
                      {project.industry || project.client}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={project.isPublic ? "bg-brand-lime text-black px-2 py-0.5" : "bg-zinc-100 text-zinc-600 px-2 py-0.5"}>
                        {project.isPublic ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {!searchQuery && (
                          <div className="flex flex-col gap-1 mr-2">
                            <button disabled={idx === 0} onClick={() => moveProject(idx, 'up')} className="text-zinc-400 hover:text-black disabled:opacity-30 cursor-pointer"><ChevronUp size={16}/></button>
                            <button disabled={idx === filteredProjects.length - 1} onClick={() => moveProject(idx, 'down')} className="text-zinc-400 hover:text-black disabled:opacity-30 cursor-pointer"><ChevronDown size={16}/></button>
                          </div>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center p-0 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-zinc-200">
                            <div className="px-2 py-1.5 text-sm font-semibold text-zinc-500">Actions</div>
                            <DropdownMenuItem>
                              <Link to={`/admin/projects/${project.id}`} className="w-full text-left">Edit Project</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link to={`/work/${project.slug}`} className="flex w-full items-center justify-between cursor-pointer">
                                View Live <ExternalLink size={14} />
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(project.id)} className="text-red-600 focus:bg-red-50 focus:text-red-700 font-semibold cursor-pointer">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProjects.length === 0 && !loading && (
                    <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
                              <Search size={24} className="text-zinc-300" />
                            </div>
                            <p className="text-zinc-500 font-medium">No projects found.</p>
                            <p className="text-zinc-400 text-sm">Create one to get started.</p>
                          </div>
                        </td>
                    </tr>
                )}
                {loading && (
                    <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-zinc-300 border-t-black rounded-full animate-spin"></div>
                            <span className="text-zinc-500 font-medium">Loading projects...</span>
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
