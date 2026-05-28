import React from 'react';
import { cn } from './StatusBadge';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, description, className, style }) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl p-5 flex flex-col",
        "bg-[#0d0d0d] border border-white/[0.06]",
        "animate-slide-up",
        "hover:border-white/[0.12] transition-all duration-300",
        "hover:shadow-lg hover:shadow-red-950/20",
        "group",
        className
      )}
      style={style}
    >
      {/* Subtle corner glow on hover */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-radial from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-4 relative">
        <h4 className="text-[11px] font-semibold text-white/35 uppercase tracking-wider group-hover:text-white/50 transition-colors">{title}</h4>
        {icon && (
          <div className="text-white/15 group-hover:text-red-500/50 transition-colors duration-300">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2 relative">
        <span className="text-3xl font-bold tracking-tight text-white/90">{value}</span>
        {trend && (
          <span className={cn(
            "text-xs font-semibold px-1.5 py-0.5 rounded",
            trend.isPositive 
              ? "text-emerald-400 bg-emerald-500/10" 
              : "text-red-400 bg-red-500/10"
          )}>
            {trend.isPositive ? '↑' : '↓'}{trend.value}
          </span>
        )}
      </div>
      
      {description && (
        <p className="text-[11px] text-white/25 mt-2.5 leading-relaxed">{description}</p>
      )}
    </div>
  );
};
