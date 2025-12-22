import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Database,
  Lightbulb,
  LayoutDashboard,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AppLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Database, label: "Databases", path: "/databases" },
  { icon: Lightbulb, label: "Insights", path: "/insights" },
  { icon: LayoutDashboard, label: "Dashboards", path: "/dashboards" },
  { icon: Sparkles, label: "AI Agent", path: "/ai-agent" },
];

const bottomNavItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/home") return location.pathname === "/home";
    return location.pathname.startsWith(path);
  };

  const NavItem = ({
    item,
    collapsed,
  }: {
    item: (typeof navItems)[0];
    collapsed: boolean;
  }) => {
    const active = isActive(item.path);

    const content = (
      <NavLink
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
          active
            ? "bg-accent text-accent-foreground font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        <item.icon
          className={cn(
            "w-5 h-5 shrink-0 transition-colors",
            active && "text-primary"
          )}
        />
        {!collapsed && (
          <span className="truncate text-sm">{item.label}</span>
        )}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex w-full">
      {/* Left Sidebar Navigation */}
      <aside
        className={cn(
          "bg-card border-r border-border/60 flex flex-col transition-all duration-300 shrink-0",
          collapsed ? "w-[72px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "h-16 border-b border-border/60 flex items-center px-4",
            collapsed ? "justify-center" : "gap-3"
          )}
        >
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow-primary shrink-0">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-semibold text-foreground truncate">
                DataPulse
              </h1>
              <p className="text-xs text-muted-foreground">Analytics</p>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-border/60 space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem key={item.path} item={item} collapsed={collapsed} />
          ))}

          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full justify-center text-muted-foreground hover:text-foreground",
              !collapsed && "justify-start px-3"
            )}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
};
