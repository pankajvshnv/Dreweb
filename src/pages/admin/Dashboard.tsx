import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { ArrowUpRight, FolderKanban, Briefcase, Mail, HardDrive, PenTool, MessageSquare, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useCollection } from '../../lib/useCollection';

const chartData = [
  { name: 'Jan', visitors: 4000, leads: 240 },
  { name: 'Feb', visitors: 3000, leads: 139 },
  { name: 'Mar', visitors: 2000, leads: 980 },
  { name: 'Apr', visitors: 2780, leads: 390 },
  { name: 'May', visitors: 1890, leads: 480 },
  { name: 'Jun', visitors: 2390, leads: 380 },
  { name: 'Jul', visitors: 3490, leads: 430 },
];

export default function AdminDashboard() {
  const { data: leads } = useCollection<any>('leads');
  const { data: projects } = useCollection<any>('projects');
  const { data: services } = useCollection<any>('services');
  const { data: media } = useCollection<any>('media');
  const { data: blog } = useCollection<any>('blog');
  const { data: testimonials } = useCollection<any>('testimonials');
  const { data: pricing } = useCollection<any>('pricing');

  const stats = [
    { title: "Projects", value: projects.length.toString(), icon: FolderKanban, color: "bg-brand-lime text-black" },
    { title: "Services", value: services.length.toString(), icon: Briefcase, color: "bg-blue-100 text-blue-700" },
    { title: "New Leads", value: leads.length.toString(), icon: Mail, color: "bg-red-100 text-red-700" },
    { title: "Blog Posts", value: blog.length.toString(), icon: PenTool, color: "bg-purple-100 text-purple-700" },
    { title: "Media Files", value: media.length.toString(), icon: HardDrive, color: "bg-amber-100 text-amber-700" },
    { title: "Testimonials", value: testimonials.length.toString(), icon: MessageSquare, color: "bg-emerald-100 text-emerald-700" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Overview</h1>
          <p className="text-zinc-500 font-medium">Here's what's happening with your website today.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-zinc-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs font-semibold text-zinc-500 mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <Card className="lg:col-span-4 border-zinc-200">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Visitors and leads over the past 7 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A' }} />
                  <Tooltip cursor={{ fill: '#F4F4F5' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '13px' }} />
                  <Bar dataKey="visitors" fill="#000000" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="leads" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-zinc-200">
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>Latest inquiries from your contact form.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {leads.length > 0 ? leads.slice(0, 5).map((lead: any, i: number) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-sm text-zinc-600 shrink-0">
                    {lead.name ? lead.name.split(' ').map((n: string) => n[0]).join('').substring(0,2) : '?'}
                  </div>
                  <div className="space-y-1 overflow-hidden flex-1">
                    <p className="text-sm font-semibold">{lead.name || 'Unknown'}</p>
                    <p className="text-sm text-zinc-600 truncate">{lead.message || lead.email}</p>
                    <p className="text-xs text-zinc-400 font-medium">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Just now'}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                    <Mail size={20} className="text-zinc-300" />
                  </div>
                  <p className="text-sm text-zinc-500 font-medium">No leads yet.</p>
                  <p className="text-xs text-zinc-400">Leads from your contact form will appear here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
