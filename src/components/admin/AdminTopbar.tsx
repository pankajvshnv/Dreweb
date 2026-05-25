import { Menu, Search, Bell, ExternalLink, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface AdminTopbarProps {
  onMenuClick: () => void;
}

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/admin/login');
  };

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : 'AD';

  return (
    <header className="sticky top-0 right-0 left-0 h-16 bg-white/80 backdrop-blur-xl border-b border-zinc-200 z-10 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-black rounded-lg hover:bg-zinc-100 transition-colors" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        
        <div className="hidden sm:flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full w-64 focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all">
          <Search size={16} className="text-zinc-400" />
          <input type="text" placeholder="Quick search..." className="bg-transparent text-sm font-medium w-full focus:outline-none placeholder:text-zinc-400" />
          <div className="hidden sm:flex items-center justify-center bg-white border border-zinc-200 rounded text-[10px] font-bold px-1.5 text-zinc-500">⌘K</div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <Link to="/" target="_blank" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-black transition-colors">
          <ExternalLink size={16} />
          View Live Site
        </Link>
        <div className="w-px h-6 bg-zinc-200 hidden sm:block"></div>
        <button className="relative p-2 text-zinc-500 hover:text-black transition-colors rounded-lg hover:bg-zinc-100">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-brand-lime font-bold text-xs cursor-pointer hover:ring-2 hover:ring-zinc-300 transition-all">
              {userInitials}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 w-56">
            <div className="px-3 py-2 border-b border-zinc-100">
              <p className="text-sm font-bold text-black">{user?.email || 'Admin'}</p>
              <p className="text-xs text-zinc-500">Super Admin</p>
            </div>
            <DropdownMenuItem className="cursor-pointer font-medium">
              <Link to="/admin/settings" className="w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-700 font-bold cursor-pointer">
              <LogOut size={14} className="mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
