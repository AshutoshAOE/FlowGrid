import React from 'react';
import { AlertCircle, Info, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface InsightCardProps {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  category: string;
  recommendedAction?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function InsightCard({ title, description, severity, category, recommendedAction, className, style }: InsightCardProps) {
  const severityConfig = {
    info: {
      icon: Info,
      color: 'text-blue-500',
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/20',
      glow: 'shadow-blue-500/10'
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/20'
    },
    critical: {
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/5',
      border: 'border-red-500/30',
      glow: 'shadow-red-500/20'
    }
  };

  const config = severityConfig[severity] || severityConfig.info;
  const Icon = config.icon;

  return (
    <div 
      style={style}
      className={cn(
        "rounded-xl border bg-[#0d0d0d] p-5 animate-fade-in transition-all hover:bg-white/[0.02]",
        config.border,
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-2 rounded-lg shrink-0", config.bg, config.color)}>
          <Icon size={20} className={severity === 'critical' ? 'animate-pulse' : ''} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-semibold text-white/90 truncate">{title}</h4>
            <span className="text-[10px] font-medium tracking-wider uppercase text-white/30 bg-white/5 px-2 py-0.5 rounded-full shrink-0">
              {category}
            </span>
          </div>
          
          <p className="text-sm text-white/60 leading-relaxed mb-3">
            {description}
          </p>
          
          {recommendedAction && (
            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-white/[0.06]">
              <Zap size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400/80 block mb-0.5">Recommendation</span>
                <span className="text-xs text-white/50">{recommendedAction}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
