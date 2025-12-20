import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Smartphone,
  Plane,
  Bell,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/mobiles", label: "Mobiles", icon: Smartphone },
  { path: "/flights", label: "Flights", icon: Plane },
  { path: "/alerts", label: "Alerts", icon: Bell },
];

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const { logout } = useAuth();

  const allNavItems = user?.isAdmin
    ? [...navItems, { path: "/admin", label: "Admin", icon: Shield }]
    : navItems;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "h-screen sticky top-0 glass-strong border-r border-glass-border flex flex-col",
        className
      )}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
          <span className="text-lg">📊</span>
        </div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-semibold text-foreground"
          >
            PriceTracker
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {allNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                "hover:bg-accent",
                isActive && "bg-primary/10 text-primary"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Actions */}
      <div className="p-4 border-t border-glass-border space-y-3">
        {/* Theme toggle */}
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "justify-between px-2"
          )}
        >
          {!isCollapsed && (
            <span className="text-sm text-muted-foreground">Theme</span>
          )}
          <ThemeToggle />
        </div>

        {/* User info */}
        {user && !isCollapsed && (
          <div className="px-2 py-2 rounded-xl bg-muted/50">
            <p className="text-sm font-medium text-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
            {user.isAdmin && (
              <span className="inline-flex items-center gap-1 text-xs text-primary mt-1">
                <Shield className="w-3 h-3" /> Admin
              </span>
            )}
          </div>
        )}

        {/* Logout */}
        {user && (
          <button
            onClick={logout}
            className={cn(
              "w-full flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm">Logout</span>}
          </button>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl hover:bg-accent transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
