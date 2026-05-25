import { Search, Mail, Phone, Calendar, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { useCollection } from '../../lib/useCollection';
import { updateDocument, deleteDocument } from '../../lib/crud';
import { useToast } from '../../lib/ToastContext';

export default function AdminLeads() {
  const { data: leads, loading } = useCollection<any>('leads');
  const { addToast } = useToast();

  const handleMarkContacted = async (id: string) => {
    try {
      await updateDocument('leads', id, { status: 'contacted' });
      addToast('Lead marked as contacted', 'success');
    } catch (error) {
      console.error(error);
      addToast('Failed to update status', 'error');
    }
  };

  const handleArchive = async (id: string) => {
    if (confirm('Are you sure you want to archive/delete this lead?')) {
      try {
        await deleteDocument('leads', id);
        addToast('Lead archived', 'success');
      } catch (error) {
        console.error(error);
        addToast('Failed to delete lead', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Leads & Inquiries</h1>
          <p className="text-zinc-500 font-medium">Manage contact form submissions and project requests.</p>
        </div>
      </div>

      <Card className="border-zinc-200">
        <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl w-full sm:w-80">
            <Search size={16} className="text-zinc-400" />
            <input type="text" placeholder="Search leads by name or email..." className="bg-transparent text-sm w-full focus:outline-none" />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <Button variant="outline" size="sm" className="rounded-xl border-zinc-200">All</Button>
            <Button variant="outline" size="sm" className="rounded-xl border-zinc-200">New</Button>
            <Button variant="outline" size="sm" className="rounded-xl border-zinc-200">Contacted</Button>
            <Button variant="outline" size="sm" className="rounded-xl border-zinc-200">Closed</Button>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-100 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Contact Details</th>
                  <th className="px-6 py-4">Inquiry Type</th>
                  <th className="px-6 py-4">Message Snapshot</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-black text-base">{lead.name}</p>
                      <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1 font-medium">
                        <Mail size={12} /> {lead.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-zinc-800">{lead.service}</p>
                      <div className="flex items-center gap-1 text-zinc-400 text-xs mt-1">
                        <Calendar size={12} /> {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 max-w-[250px] truncate">
                      {lead.message}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={
                        (lead.status === 'New' || lead.status === 'new') ? "bg-red-500 text-white px-2 py-0.5 border-none" 
                        : (lead.status === 'Contacted' || lead.status === 'contacted') ? "bg-blue-100 text-blue-700 px-2 py-0.5"
                        : "bg-zinc-100 text-zinc-600 px-2 py-0.5"
                      }>
                        {lead.status || 'New'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(lead.status === 'New' || lead.status === 'new') && (
                          <Button onClick={() => handleMarkContacted(lead.id)} variant="outline" size="icon" className="w-8 h-8 rounded-lg border-zinc-200 text-brand-blue" title="Mark as Contacted">
                            <CheckCircle2 size={16} />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center p-0 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-zinc-200">
                            <DropdownMenuItem className="cursor-pointer font-medium">View Full Details</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer font-medium"><a href={`mailto:${lead.email}`}>Reply via Email</a></DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleArchive(lead.id)} className="text-red-600 focus:bg-red-50 focus:text-red-700 font-bold cursor-pointer">Archive</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && !loading && (
                    <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 font-medium">
                            No leads found.
                        </td>
                    </tr>
                )}
                {loading && (
                    <tr>
                        <td colSpan={5} className="px-6 py-8 text-center font-medium">
                            Loading...
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
