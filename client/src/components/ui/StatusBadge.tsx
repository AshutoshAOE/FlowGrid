import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for clean tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type StatusType = 'shipment' | 'driver' | 'inventory';

interface StatusBadgeProps {
  type: StatusType;
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, status, className }) => {
  let badgeClass = 'bg-gray-100 text-gray-800 border-gray-200';
  const normalizedStatus = status?.toLowerCase() || '';

  if (type === 'shipment') {
    if (normalizedStatus === 'created') badgeClass = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (normalizedStatus === 'optimized') badgeClass = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    if (normalizedStatus === 'driver_assigned') badgeClass = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    if (normalizedStatus === 'in_transit') badgeClass = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    if (normalizedStatus === 'delivered') badgeClass = 'bg-green-500/10 text-green-400 border-green-500/20';
    if (normalizedStatus === 'cancelled') badgeClass = 'bg-red-500/10 text-red-400 border-red-500/20';
  } else if (type === 'driver') {
    if (normalizedStatus === 'available') badgeClass = 'bg-green-500/10 text-green-400 border-green-500/20';
    if (normalizedStatus === 'assigned') badgeClass = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    if (normalizedStatus === 'in_transit') badgeClass = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    if (normalizedStatus === 'offline') badgeClass = 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  } else if (type === 'inventory') {
    if (normalizedStatus === 'critical') badgeClass = 'bg-red-500/10 text-red-400 border-red-500/20';
    if (normalizedStatus === 'warning') badgeClass = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    if (normalizedStatus === 'healthy') badgeClass = 'bg-green-500/10 text-green-400 border-green-500/20';
  }

  const displayText = status ? status.replace(/_/g, ' ').toUpperCase() : 'UNKNOWN';

  return (
    <span className={cn('px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded border', badgeClass, className)}>
      {displayText}
    </span>
  );
};
