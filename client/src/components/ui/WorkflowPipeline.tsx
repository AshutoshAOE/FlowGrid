import React from 'react';
import { cn } from './StatusBadge';
import { Check, Circle } from 'lucide-react';

interface WorkflowPipelineProps {
  currentStatus: string;
  className?: string;
}

const steps = [
  { id: 'created', label: 'Created' },
  { id: 'optimized', label: 'Optimized' },
  { id: 'driver_assigned', label: 'Assigned' },
  { id: 'in_transit', label: 'Transit' },
  { id: 'delivered', label: 'Delivered' }
];

export const WorkflowPipeline: React.FC<WorkflowPipelineProps> = ({ currentStatus, className }) => {
  const normalizedStatus = currentStatus?.toLowerCase() || '';
  
  if (normalizedStatus === 'cancelled') {
    return (
      <div className={cn("flex items-center text-red-400 text-xs font-medium gap-1.5", className)}>
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/30"></span>
        Cancelled
      </div>
    );
  }

  const currentIndex = steps.findIndex(s => s.id === normalizedStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className={cn("flex items-center w-full", className)}>
      {steps.map((step, idx) => {
        const isCompleted = idx < activeIndex;
        const isActive = idx === activeIndex;
        const isLast = idx === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center relative z-10">
              <div 
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300",
                  isCompleted 
                    ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20" 
                    : isActive 
                      ? "bg-transparent border-red-500/60 text-red-400" 
                      : "bg-transparent border-white/10 text-white/15"
                )}
              >
                {isCompleted ? (
                  <Check className="w-2.5 h-2.5" />
                ) : isActive ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                ) : (
                  <Circle className="w-1.5 h-1.5 fill-current" />
                )}
              </div>
              <span 
                className={cn(
                  "absolute top-7 text-[8px] font-medium whitespace-nowrap transition-colors duration-300",
                  isCompleted ? "text-red-400/60" : isActive ? "text-white/60" : "text-white/15"
                )}
              >
                {step.label}
              </span>
            </div>
            
            {!isLast && (
              <div className="flex-1 mx-1 h-[1px] bg-white/[0.06] relative overflow-hidden">
                <div 
                  className={cn(
                    "absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-500/50 transition-all duration-700",
                    isCompleted ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
