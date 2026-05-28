import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, isLoading, emptyMessage = 'No records found' }: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full rounded-xl border border-white/[0.06] bg-[#0d0d0d] overflow-hidden">
        <div className="h-48 flex flex-col items-center justify-center gap-3">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div 
                key={i} 
                className="w-2 h-2 rounded-full bg-red-500/40"
                style={{ animation: `pulse 1.2s ease-in-out ${i * 200}ms infinite` }}
              />
            ))}
          </div>
          <span className="text-white/25 text-sm">Loading data...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full rounded-xl border border-white/[0.06] bg-[#0d0d0d]">
        <div className="h-48 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-3">
            <svg className="w-4 h-4 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <span className="text-white/25 text-sm">{emptyMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#0d0d0d]">
      <table className="w-full text-sm text-left">
        <thead className="text-[10px] text-white/25 uppercase tracking-wider border-b border-white/[0.04]">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-5 py-3.5 font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors duration-150"
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-5 py-3.5 whitespace-nowrap text-white/70">
                  {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
