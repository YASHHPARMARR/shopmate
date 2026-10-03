// src/components/ChapterHeader.tsx — Editorial Rubric & Oversized Typography Header
import React from 'react';

interface ChapterHeaderProps {
  number?: string;        // e.g. "01"
  total?: string;         // e.g. "06"
  rubric?: string;        // e.g. "THE PROBLEM" or "THE SHIFT"
  title: string | React.ReactNode;
  subtitle?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const ChapterHeader: React.FC<ChapterHeaderProps> = ({
  number,
  total = '06',
  rubric,
  title,
  subtitle,
  description,
  align = 'left',
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${align === 'center' ? 'text-center mx-auto' : ''} ${className}`}>
      {/* Chapter Rubric */}
      <div className={`flex items-center gap-3 text-xs font-mono-editorial uppercase tracking-widest text-[#78766f] ${align === 'center' ? 'justify-center' : ''}`}>
        {number ? (
          <span className="font-bold text-[#581c87]">CHPT. {number} — {total}</span>
        ) : (
          <span className="font-bold text-[#581c87]">{rubric || 'SHOPMATE'}</span>
        )}
        {number && rubric && (
          <>
            <span className="text-[#ded9cb]">/</span>
            <span>{rubric}</span>
          </>
        )}
      </div>

      {/* Main Oversized Title */}
      <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-[#121212] leading-[0.95]">
        {title}
      </h2>

      {subtitle && (
        <div className="text-xl sm:text-2xl font-display font-medium text-[#4a4944] tracking-tight">
          {subtitle}
        </div>
      )}

      {description && (
        <p className="max-w-2xl text-base sm:text-lg text-[#5a5852] font-normal leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
