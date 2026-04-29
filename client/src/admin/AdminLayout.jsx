import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, LayoutDashboard, CalendarDays, Scissors, Package, Users, Star, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/bookings', icon: CalendarDays, label: 'Bookings' },
  { to: '/admin/services', icon: Scissors, label: 'Services' },
  { to: '/admin/packages', icon: Package, label: 'Packages' },
  { to: '/admin/stylists', icon: Users, label: 'Stylists' },
  { to: '/admin/testimonials', icon: Star, label: 'Testimonials' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-soft-black text-white">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-champagne" />
          <div>
            <div className="font-playfair font-bold text-white">Glamour Admin</div>
            <div className="text-white/40 text-xs">{user?.email}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-rose-gold text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all w-full">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-60 shrink-0 border-r border-gray-200">
        <div className="fixed w-60 h-full"><Sidebar /></div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-60 h-full"><Sidebar /></div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-playfair font-semibold text-soft-black hidden md:block">Admin Panel</h1>
          <div className="flex items-center gap-2 text-sm text-warm-gray">
            <div className="w-8 h-8 rounded-full bg-rose-gold flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.[0] || 'A'}
            </div>
            <span className="hidden sm:block">{user?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
