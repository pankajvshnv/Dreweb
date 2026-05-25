import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FolderKanban, Briefcase, Tag, 
  MessageSquare, Layers,
  Settings, PenTool, 
  HardDrive, Mail, X, LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/AuthContext';

interface AdminSidebarProps {
  onClose?: () => void;
}

const SIDEBAR_SECTIONS = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Leads & Inquiries', path: '/admin/leads', icon: Mail },
    ]
  },
  {
    title: 'Content CMS',
    items: [
      { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
      { name: 'Services', path: '/admin/services', icon: Briefcase },
      { name: 'Pricing Plans', path: '/admin/pricing', icon: Tag },
      { name: 'Blog', path: '/admin/blog', icon: PenTool },
      { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    ]
  },
  {
    title: 'Site Management',
    items: [
      { name: 'Hero Showcase', path: '/admin/showcase-cards', icon: Layers },
      { name: 'Media Library', path: '/admin/media', icon: HardDrive },
      { name: 'Website Settings', path: '/admin/settings', icon: Settings },
    ]
  },
];

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate('/admin/login');
  };

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : 'AD';

  return (
    <div className="flex flex-col h-full bg-white text-zinc-600">
      <div className="p-6 flex items-center justify-between border-b border-zinc-100">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black text-brand-lime flex items-center justify-center font-display font-extrabold text-lg">d</div>
          <span className="font-display font-extrabold text-xl tracking-tight text-black">admin</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-zinc-400 hover:text-black transition-colors p-1 rounded-lg hover:bg-zinc-100">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-thin">
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.title}>
            <h4 className="px-3 text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">{section.title}</h4>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group",
                      isActive 
                        ? "bg-black text-white" 
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
                    )}
                  >
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={cn("shrink-0", isActive ? "text-brand-lime" : "text-zinc-400 group-hover:text-black")} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-zinc-100 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-brand-lime font-bold text-xs shrink-0">
            {userInitials}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold text-black truncate">{user?.email || 'Admin'}</p>
            <p className="text-xs text-zinc-500 truncate">Super Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all w-full"
        >
          <LogOut size={16} className="shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
