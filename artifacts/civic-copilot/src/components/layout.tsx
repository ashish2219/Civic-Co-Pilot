import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "./shared";
import { 
  LayoutDashboard, 
  FileText, 
  Send, 
  Briefcase, 
  ShieldAlert,
  LogOut,
  Menu,
  X,
  User as UserIcon
} from "lucide-react";
import { UserRole } from "@workspace/api-client-react";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return <>{children}</>;

  const isAdmin = user.role === UserRole.ADMIN;

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, show: !isAdmin },
    { label: "Submit Complaint", href: "/complaints/new", icon: <Send className="w-5 h-5" />, show: !isAdmin },
    { label: "My Complaints", href: "/complaints", icon: <FileText className="w-5 h-5" />, show: !isAdmin },
    { label: "Schemes", href: "/schemes", icon: <Briefcase className="w-5 h-5" />, show: !isAdmin },
    
    // Admin routes
    { label: "Admin Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, show: isAdmin },
    { label: "All Complaints", href: "/admin/complaints", icon: <ShieldAlert className="w-5 h-5" />, show: isAdmin },
  ].filter(item => item.show);

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
        <div className="p-6 flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-8 h-8 rounded-md bg-white p-1" />
          <span className="font-display font-bold text-xl tracking-tight text-white">Civic Co-Pilot</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-sidebar-primary text-white" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center text-primary-foreground border border-sidebar-border">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:text-red-400 hover:bg-sidebar-accent rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar text-white z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-8 h-8 rounded-md bg-white p-1" />
          <span className="font-display font-bold text-lg">Civic Co-Pilot</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-sidebar z-40 flex flex-col">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium",
                  location === item.href 
                    ? "bg-sidebar-primary text-white" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-red-400 hover:bg-sidebar-accent rounded-xl"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0 md:pt-0 pt-16 h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
