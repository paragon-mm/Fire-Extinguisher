import React from 'react';
import { FireExtinguisher } from 'lucide-react';

interface Props {
  onNewRequest?: () => void;
  activeFilter?: string;
  onFilterChange?: (dept: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<Props> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Brand & Document Code */}
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-xl shadow-md border border-slate-700 shrink-0">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl9kdS0IYKjYC-iIzRU0efSyXgWKzoV9oXH29cAcpQww&s" 
                alt="GCM PTA Logo" 
                className="h-10 w-auto object-contain rounded" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-red-400 tracking-wider text-xs">
                  GCM PTA
                </span>
                <span className="text-[10px] text-slate-300 bg-red-950 px-2 py-0.5 rounded font-mono border border-red-800 font-bold">
                  MM-F-0055-01
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5 mt-0.5">
                <FireExtinguisher className="w-4 h-4 text-orange-400 shrink-0" />
                <span>แบบฟอร์มตรวจสภาพถังดับเพลิง (Fire Extinguisher Inspection)</span>
              </h1>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px] sm:min-w-[280px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ค้นหา Running No., ชื่อบริษัท, หมายเลขถัง..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

        </div>
      </div>
    </header>
  );
};

