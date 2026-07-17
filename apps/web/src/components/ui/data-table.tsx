'use client';

import { useState, useMemo, ReactNode } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (item: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  className?: string;
  onRowClick?: (item: T) => void;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  pageSize: initialPageSize = 10,
  className,
  onRowClick,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [data, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/40 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-slate-900/60">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400',
                      column.sortable && 'cursor-pointer select-none hover:text-slate-200 transition-colors',
                      column.className
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      {column.header}
                      {column.sortable && sortKey === column.key && (
                        <span className="text-indigo-400">
                          {sortDirection === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className={cn(
                    'transition-colors hover:bg-white/[0.02]',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-3.5 text-sm text-slate-300',
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(item, (currentPage - 1) * pageSize + index)
                        : (item[column.key] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-sm text-slate-500"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-white/10 bg-slate-900/60 px-2 py-1 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">
            {sortedData.length === 0
              ? '0 of 0'
              : `${(currentPage - 1) * pageSize + 1}-${Math.min(
                  currentPage * pageSize,
                  sortedData.length
                )} of ${sortedData.length}`}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
