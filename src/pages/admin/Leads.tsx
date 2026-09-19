import React, { useState } from 'react';
import { 
  Search, Mail, Phone, Calendar, MoreHorizontal, CheckCircle2, 
  Building, DollarSign, Clock, Eye, Trash2, X, MessageSquare, Send, Check
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useCollection } from '../../lib/useCollection';
import { updateDocument, deleteDocument } from '../../lib/crud';
import { useToast } from '../../lib/ToastContext';

export default function AdminLeads() {
  const { data: leads, loading } = useCollection<any>('leads');
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: 'new' | 'contacted' | 'closed') => {
    try {
      await updateDocument('leads', id, { status: newStatus });
      addToast(`Lead marked as ${newStatus}`, 'success');
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error(error);
      addToast('Failed to update status', 'error');
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      try {
        await deleteDocument('leads', id);
        addToast('Lead deleted successfully', 'success');
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(null);
        }
      } catch (error) {
        console.error(error);
        addToast('Failed to delete lead', 'error');
      }
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter((lead: any) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      (lead.name && lead.name.toLowerCase().includes(query)) ||
      (lead.email && lead.email.toLowerCase().includes(query)) ||
      (lead.mobile && lead.mobile.toLowerCase().includes(query)) ||
      (lead.company && lead.company.toLowerCase().includes(query)) ||
      (lead.service && lead.service.toLowerCase().includes(query)) ||
      (lead.message && lead.message.toLowerCase().includes(query));

    const currentStatus = (lead.status || 'new').toLowerCase();
    const matchesStatus = 
      statusFilter === 'all' || 
      currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const countNew = leads.filter((l: any) => (l.status || 'new').toLowerCase() === 'new').length;
  const countContacted = leads.filter((l: any) => (l.status || '').toLowerCase() === 'contacted').length;
  const countClosed = leads.filter((l: any) => (l.status || '').toLowerCase() === 'closed').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-zinc-900">Leads & Inquiries</h1>
          <p className="text-zinc-500 font-medium text-sm">Manage website contact form submissions and client project requests.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Inquiries</span>
          <div className="text-2xl font-bold text-zinc-900 mt-1">{leads.length}</div>
        </div>
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider">New / Unread</span>
          <div className="text-2xl font-bold text-rose-600 mt-1">{countNew}</div>
        </div>
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">In Contact</span>
          <div className="text-2xl font-bold text-blue-600 mt-1">{countContacted}</div>
        </div>
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Closed Deals</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{countClosed}</div>
        </div>
      </div>

      {/* Leads Table Container */}
      <Card className="border-zinc-200 shadow-sm overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-2.5 bg-white border border-zinc-200 px-3.5 py-2 rounded-xl w-full sm:w-96 shadow-sm focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
            <Search size={16} className="text-zinc-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search by name, email, phone, company, message..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full focus:outline-none placeholder:text-zinc-400" 
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-zinc-400 hover:text-zinc-600 text-xs">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'all' 
                  ? 'bg-zinc-900 text-white shadow-sm' 
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              All ({leads.length})
            </button>
            <button
              onClick={() => setStatusFilter('new')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'new' 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              New ({countNew})
            </button>
            <button
              onClick={() => setStatusFilter('contacted')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'contacted' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              Contacted ({countContacted})
            </button>
            <button
              onClick={() => setStatusFilter('closed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'closed' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              Closed ({countClosed})
            </button>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50/80 text-zinc-500 border-b border-zinc-100 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Client Details</th>
                  <th className="px-6 py-4">Service & Budget</th>
                  <th className="px-6 py-4">Project Inquiry</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredLeads.map((lead: any) => {
                  const currentStatus = (lead.status || 'new').toLowerCase();
                  return (
                    <tr 
                      key={lead.id} 
                      className="hover:bg-zinc-50/70 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      {/* Client Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-sm text-zinc-700 shrink-0 border border-zinc-200">
                            {lead.name ? lead.name.slice(0, 2).toUpperCase() : 'LE'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-zinc-900 text-sm">{lead.name || 'Anonymous'}</p>
                            <div className="flex items-center gap-2 text-zinc-500 text-xs mt-0.5 font-medium">
                              <span className="flex items-center gap-1 hover:text-black">
                                <Mail size={11} className="text-zinc-400" /> {lead.email}
                              </span>
                            </div>
                            {(lead.mobile || lead.company) && (
                              <div className="flex items-center gap-2 text-zinc-400 text-xs mt-0.5">
                                {lead.mobile && (
                                  <span className="flex items-center gap-1 text-zinc-500 font-mono">
                                    <Phone size={10} /> {lead.mobile}
                                  </span>
                                )}
                                {lead.company && (
                                  <span className="flex items-center gap-1 bg-zinc-100 text-zinc-600 px-1.5 py-0.2 rounded text-[11px] font-medium">
                                    <Building size={10} /> {lead.company}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Service & Budget */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-zinc-800 text-xs">
                          {lead.service || 'General Inquiry'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {lead.budget ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                              <DollarSign size={11} /> {lead.currency || '$'} {lead.budget}
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-400 italic">No budget set</span>
                          )}
                        </div>
                      </td>

                      {/* Message Snapshot */}
                      <td className="px-6 py-4 max-w-[260px]">
                        <p className="text-zinc-600 text-xs line-clamp-2 leading-relaxed">
                          {lead.message || 'No project description provided.'}
                        </p>
                        <div className="flex items-center gap-1 text-zinc-400 text-[11px] mt-1 font-medium">
                          <Calendar size={11} /> {lead.createdAt ? new Date(lead.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Unknown date'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center">
                          {currentStatus === 'new' && (
                            <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-2.5 py-0.5 border-none shadow-sm text-xs">
                              New
                            </Badge>
                          )}
                          {currentStatus === 'contacted' && (
                            <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-2.5 py-0.5 border border-blue-200 text-xs">
                              Contacted
                            </Badge>
                          )}
                          {currentStatus === 'closed' && (
                            <Badge className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold px-2.5 py-0.5 border border-zinc-200 text-xs">
                              Closed
                            </Badge>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <Button 
                            onClick={() => setSelectedLead(lead)} 
                            variant="outline" 
                            size="icon" 
                            className="w-8 h-8 rounded-lg border-zinc-200 hover:bg-zinc-100 text-zinc-700"
                            title="View Full Details"
                          >
                            <Eye size={15} />
                          </Button>
                          <a 
                            href={`mailto:${lead.email}?subject=Re: Your Inquiry on Dreweb&body=Hi ${encodeURIComponent(lead.name || '')},%0D%0A%0D%0AThank you for reaching out regarding ${encodeURIComponent(lead.service || 'your project')}!%0D%0A%0D%0A`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 transition-colors"
                            title="Reply via Email"
                          >
                            <Mail size={15} />
                          </a>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center p-0 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-700">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 w-48 shadow-lg">
                              <DropdownMenuItem onClick={() => setSelectedLead(lead)} className="cursor-pointer font-medium text-xs">
                                <Eye className="w-3.5 h-3.5 mr-2" /> View Full Details
                              </DropdownMenuItem>
                              {currentStatus !== 'contacted' && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(lead.id, 'contacted')} className="cursor-pointer font-medium text-xs text-blue-600">
                                  <Check className="w-3.5 h-3.5 mr-2" /> Mark as Contacted
                                </DropdownMenuItem>
                              )}
                              {currentStatus !== 'closed' && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(lead.id, 'closed')} className="cursor-pointer font-medium text-xs text-emerald-600">
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Mark as Closed
                                </DropdownMenuItem>
                              )}
                              {currentStatus !== 'new' && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(lead.id, 'new')} className="cursor-pointer font-medium text-xs text-zinc-600">
                                  <Clock className="w-3.5 h-3.5 mr-2" /> Reset to New
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleDeleteLead(lead.id)} className="text-red-600 focus:bg-red-50 focus:text-red-700 font-bold cursor-pointer text-xs">
                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Lead
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredLeads.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-medium">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <MessageSquare className="w-8 h-8 text-zinc-300" />
                        <p className="text-base font-semibold text-zinc-700">No leads found</p>
                        <p className="text-xs text-zinc-400">
                          {searchQuery ? 'Try adjusting your search criteria or filters.' : 'When users submit the contact form, submissions appear here instantly.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center font-medium text-zinc-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-400 border-t-transparent animate-spin"></div>
                        <span>Loading leads...</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FULL DETAILS MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-zinc-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                  {selectedLead.name ? selectedLead.name.slice(0, 2).toUpperCase() : 'LE'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 leading-snug">{selectedLead.name}</h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Received {selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleString() : 'Recently'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-500">Current Status:</span>
                  <Badge className={
                    (selectedLead.status || 'new').toLowerCase() === 'new' ? "bg-rose-500 text-white font-bold"
                    : (selectedLead.status || '').toLowerCase() === 'contacted' ? "bg-blue-600 text-white font-bold"
                    : "bg-emerald-600 text-white font-bold"
                  }>
                    {selectedLead.status ? selectedLead.status.toUpperCase() : 'NEW'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, 'new')}
                    className="px-2.5 py-1 text-xs rounded-lg border border-zinc-200 hover:bg-white text-zinc-700 font-medium transition-colors"
                  >
                    Set New
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, 'contacted')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-semibold hover:bg-blue-100 transition-colors"
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, 'closed')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    Mark Closed
                  </button>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-50/60 p-3.5 rounded-xl border border-zinc-100">
                  <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block mb-1">Email Address</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-zinc-900 font-semibold hover:underline flex items-center gap-1.5">
                    <Mail size={13} className="text-zinc-500" /> {selectedLead.email}
                  </a>
                </div>

                <div className="bg-zinc-50/60 p-3.5 rounded-xl border border-zinc-100">
                  <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block mb-1">Phone / WhatsApp</span>
                  {selectedLead.mobile ? (
                    <div className="flex items-center gap-2">
                      <a href={`tel:${selectedLead.mobile}`} className="text-zinc-900 font-semibold hover:underline flex items-center gap-1.5">
                        <Phone size={13} className="text-zinc-500" /> {selectedLead.mobile}
                      </a>
                      <a 
                        href={`https://wa.me/${selectedLead.mobile.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded hover:bg-emerald-100"
                      >
                        WhatsApp
                      </a>
                    </div>
                  ) : (
                    <span className="text-zinc-400 italic">Not provided</span>
                  )}
                </div>

                <div className="bg-zinc-50/60 p-3.5 rounded-xl border border-zinc-100">
                  <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block mb-1">Company / Organization</span>
                  <div className="text-zinc-900 font-semibold flex items-center gap-1.5">
                    <Building size={13} className="text-zinc-500" /> {selectedLead.company || 'Not provided'}
                  </div>
                </div>

                <div className="bg-zinc-50/60 p-3.5 rounded-xl border border-zinc-100">
                  <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block mb-1">Estimated Budget</span>
                  <div className="text-zinc-900 font-bold text-base flex items-center gap-1">
                    <DollarSign size={14} className="text-emerald-600" /> 
                    {selectedLead.budget ? `${selectedLead.currency || '$'} ${selectedLead.budget}` : 'Not specified'}
                  </div>
                </div>
              </div>

              {/* Service Requested */}
              <div className="bg-zinc-50/60 p-3.5 rounded-xl border border-zinc-100">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block mb-1">Service Requested</span>
                <span className="font-bold text-zinc-800 text-sm">
                  {selectedLead.service || 'General Consultation / Not specified'}
                </span>
              </div>

              {/* Full Message */}
              <div className="space-y-2">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Detailed Project Message</span>
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-zinc-800 leading-relaxed whitespace-pre-wrap font-normal text-sm max-h-60 overflow-y-auto">
                  {selectedLead.message || 'No message provided.'}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <button 
                onClick={() => handleDeleteLead(selectedLead.id)} 
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} /> Delete Lead
              </button>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setSelectedLead(null)} 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl border-zinc-200 text-xs font-semibold"
                >
                  Close
                </Button>
                <a 
                  href={`mailto:${selectedLead.email}?subject=Dreweb: Regarding your ${encodeURIComponent(selectedLead.service || 'project inquiry')}&body=Hi ${encodeURIComponent(selectedLead.name || '')},%0D%0A%0D%0AThank you for contacting Dreweb! We received your project details:%0D%0A%0D%0A"${encodeURIComponent(selectedLead.message || '')}"%0D%0A%0D%0A`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors shadow-sm"
                >
                  <Send size={13} /> Reply by Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

