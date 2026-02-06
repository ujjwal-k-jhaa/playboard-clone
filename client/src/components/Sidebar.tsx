import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Trophy, 
  Tv2, 
  LineChart, 
  Globe2, 
  Menu,
  X,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Super Chat Ranking", icon: DollarSign, href: "/rankings/super-chat" },
  { label: "Channel Ranking", icon: Trophy, href: "/rankings/channels" },
  { label: "Live Streams", icon: Tv2, href: "/videos/live" },
  { label: "Trends", icon: TrendingUp, href: "/trends" },
  { label: "Global", icon: Globe2, href: "/global" },
];

export function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={toggle}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-border/50">
            <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
              <LineChart className="w-6 h-6 text-accent" />
              <span>Playboard</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/");
              return (
                <Link key={item.href} href={item.href} className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer/User Area could go here */}
          <div className="p-4 border-t border-border/50 text-xs text-muted-foreground">
            <p>© 2024 Playboard Clone</p>
            <p className="mt-1">Data updated daily</p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
