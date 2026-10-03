// src/components/DataStatusBadge.tsx — Data Honesty & Provenance Indicator
import React from 'react';

interface DataStatusBadgeProps {
  status?: 'DEMO DATA' | 'LIVE' | 'ESTIMATED';
  timestamp?: string;
  className?: string;
}

export const DataStatusBadge: React.FC<DataStatusBadgeProps> = ({
  status = 'DEMO DATA',
  timestamp,
  className = ''
}) => {
  return (
    <div className={`inline-flex items-center gap-2 text-[10px] font-mono-editorial uppercase tracking-wider ${className}`}>
      <span
        className={`px-2 py-0.5 rounded-sm font-bold border ${
          status === 'LIVE'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : status === 'ESTIMATED'
            ? 'bg-amber-50 text-amber-800 border-amber-300'
            : 'bg-[#edeae1] text-[#5a5852] border-[#ded9cb]'
        }`}
      >
        {status}
      </span>
      {timestamp && (
        <span className="text-[#a8a69f] hidden sm:inline">
          {timestamp}
        </span>
      )}
    </div>
  );
};
