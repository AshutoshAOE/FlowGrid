import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  description?: string;
}

export function Modal({ isOpen, onClose, title, children, description }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#0d0d0d] w-full max-w-lg overflow-hidden flex flex-col rounded-xl shadow-2xl shadow-red-950/10 border border-white/[0.08] animate-slide-up">
        <div className="flex justify-between items-center p-5 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-semibold text-white/90">{title}</h3>
            {description && <p className="text-xs text-white/40 mt-1">{description}</p>}
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors p-1 rounded hover:bg-white/[0.05]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
