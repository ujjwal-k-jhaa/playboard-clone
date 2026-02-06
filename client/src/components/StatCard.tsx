import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
  subtitle?: string;
}

export function StatCard({ title, value, trend, icon, className, subtitle }: StatCardProps) {
  return (
    <div className={cn("glass-card rounded-xl p-6 relative overflow-hidden group", className)}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold font-display tracking-tight text-foreground">{value}</span>
          
          {trend && (
            <span className={cn(
              "text-xs font-medium flex items-center gap-0.5 px-1.5 py-0.5 rounded-full",
              trend.isPositive 
                ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" 
                : "text-rose-600 bg-rose-50 dark:bg-rose-900/20"
            )}>
              {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
