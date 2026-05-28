
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function PageHeader({ title, description, actionLabel, onAction }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white/90">{title}</h1>
        {description && <p className="text-sm text-white/30 mt-1">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/20 hover:shadow-red-900/40 hover:scale-[1.02] active:scale-[0.98] h-9 px-4 py-2"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
