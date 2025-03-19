
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideHome, Users, LogOut, Menu, X, Pill } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCurrentUser } from "@/lib/mockData";
import { User } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    
    fetchUser();
  }, []);

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobile, isOpen]);

  const navItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: LucideHome
    },
    {
      label: "Patients",
      href: "/patients",
      icon: Users
    }
  ];

  // Only show medications & supplements section for admin
  if (currentUser?.role === 'admin') {
    navItems.push({
      label: "Medications & Supplements",
      href: "/medications",
      icon: Pill
    });
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Nav Toggle */}
      {isMobile && (
        <button 
          className="fixed z-50 top-4 right-4 p-2 rounded-full bg-primary text-white shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and app name */}
          <div className="flex items-center h-16 px-6 border-b border-border">
            <img src="/assets/DNA Logo - Grey.svg" alt="DNA Health" className="h-10 mr-2" />
            <span className="text-lg font-semibold text-brand-text">DNA Health</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm rounded-lg transition-colors",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-brand-text hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon 
                  size={18} 
                  className={cn(
                    "mr-3",
                    location.pathname === item.href ? "text-primary" : "text-brand-text/70"
                  )} 
                />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                {currentUser?.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-brand-text">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{currentUser?.role}</p>
              </div>
            </div>
            <button className="flex items-center w-full px-4 py-2 text-sm text-left rounded-lg text-brand-text/70 hover:bg-accent hover:text-foreground transition-colors">
              <LogOut size={18} className="mr-3 text-brand-text/70" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main content */}
      <main 
        className={cn(
          "flex-1 overflow-auto transition-all duration-300 ease-in-out",
          !isMobile && "ml-64"
        )}
      >
        <div className="container py-6 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
