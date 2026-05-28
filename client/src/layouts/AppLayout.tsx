import { Outlet, Link, useLocation } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { Menu, LayoutDashboard, Warehouse, Package, Box, Users, Truck, LogOut, Radio, Brain } from 'lucide-react';
import { cn } from '../lib/utils';

const NAVIGATION = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Intelligence', href: '/intelligence', icon: Brain },
  { name: 'Warehouses', href: '/warehouses', icon: Warehouse },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Inventory', href: '/inventory', icon: Box },
  { name: 'Drivers', href: '/drivers', icon: Users },
  { name: 'Shipments', href: '/shipments', icon: Truck },
];

export function AppLayout() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#0d0d0d] border-r border-white/[0.06] transition-all duration-300 flex flex-col relative overflow-hidden",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        {/* Subtle animated scan line */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-[scan_4s_ease-in-out_infinite]" 
               style={{ animation: 'scan 4s ease-in-out infinite' }} />
        </div>

        {/* Top: Logo area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.06] relative">
          {isSidebarOpen && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/30">
                <Truck size={16} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-white">FlowGrid</span>
                <span className="text-[10px] text-red-400/60 font-medium tracking-widest uppercase">Logistics OS</span>
              </div>
            </div>
          )}
          <button 
            onClick={toggleSidebar} 
            className={cn(
              "p-2 rounded-md hover:bg-white/[0.06] text-white/40 hover:text-white transition-all duration-200",
              !isSidebarOpen && "mx-auto"
            )}
          >
            <Menu size={18} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {isSidebarOpen && (
            <div className="px-3 mb-3">
              <span className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.2em]">Operations</span>
            </div>
          )}
          {NAVIGATION.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive 
                    ? "bg-red-600/10 text-red-400" 
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]",
                  !isSidebarOpen && "justify-center"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-red-500 rounded-r-full shadow-lg shadow-red-500/50" />
                )}
                <item.icon 
                  size={18} 
                  className={cn(
                    "shrink-0 transition-all duration-200", 
                    isActive ? "text-red-400" : "text-white/30 group-hover:text-white/70"
                  )} 
                />
                {isSidebarOpen && (
                  <span className={cn(
                    "ml-3 text-sm font-medium transition-all duration-200",
                    isActive ? "text-red-400" : ""
                  )}>
                    {item.name}
                  </span>
                )}
                {/* Hover glow on active */}
                {isActive && isSidebarOpen && (
                  <div className="ml-auto">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>



        {/* User + Logout */}
        <div className="p-3 border-t border-white/[0.06]">
          {isSidebarOpen && user && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-white/80 truncate">{user.fullName || 'Operator'}</span>
                <span className="text-[10px] text-white/30 truncate">{user.email}</span>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className={cn(
              "flex items-center w-full px-3 py-2.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 group",
              !isSidebarOpen && "justify-center"
            )}
          >
            <LogOut size={18} className="shrink-0 group-hover:text-red-400 transition-colors" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-sm font-semibold tracking-wide text-white/70 uppercase">
              {NAVIGATION.find(n => n.href === location.pathname)?.name || 'Operations'}
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span className="hidden sm:block">FlowGrid</span>

          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto p-6 bg-[#080808]">
          <Outlet />
        </main>
      </div>

      {/* Global scan line animation */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
