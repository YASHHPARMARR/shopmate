// src/components/ChapterIndicator.tsx — Floating Desktop Editorial Chapter Progress Indicator
import React, { useEffect, useState } from 'react';

interface Chapter {
  id: string;
  num: string;
  label: string;
}

const CHAPTERS: Chapter[] = [
  { id: 'ch-hero',    num: '00', label: 'PRELUDE' },
  { id: 'ch-problem', num: '01', label: 'THE PROBLEM' },
  { id: 'ch-shift',   num: '02', label: 'THE SHIFT' },
  { id: 'ch-engine',  num: '03', label: 'THE ENGINE' },
  { id: 'ch-decision',num: '04', label: 'THE DECISION' },
  { id: 'ch-split',   num: '05', label: 'SMART SPLIT' },
  { id: 'ch-learn',   num: '06', label: 'LEARNING' }
];

export const ChapterIndicator: React.FC = () => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.35;
      
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        const el = document.getElementById(CHAPTERS[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollY >= top) {
            setActiveChapterIndex(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const active = CHAPTERS[activeChapterIndex] || CHAPTERS[0];

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-3 pointer-events-auto select-none"
      aria-label="Editorial chapter navigation"
    >
      <div className="bg-[#faf8f5]/85 backdrop-blur-md p-3.5 rounded-2xl border border-[#e5e2da] shadow-xs flex flex-col gap-2.5">
        {CHAPTERS.map((ch, idx) => {
          const isActive = idx === activeChapterIndex;
          return (
            <button
              key={ch.id}
              onClick={() => scrollToChapter(ch.id)}
              className="group flex items-center gap-2.5 text-left text-decoration-none focus:outline-hidden"
              title={`${ch.num} / ${ch.label}`}
            >
              <span
                className={`text-[10px] font-mono-editorial font-bold transition-all ${
                  isActive ? 'text-purple-950 scale-110' : 'text-[#a8a69f] group-hover:text-[#4a4944]'
                }`}
              >
                {ch.num}
              </span>

              {/* Progress Line */}
              <span
                className={`h-[1.5px] rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-7 bg-purple-950'
                    : 'w-2 bg-[#ded9cb] group-hover:w-4 group-hover:bg-[#a8a69f]'
                }`}
              />

              <span
                className={`text-[9px] font-mono-editorial tracking-wider uppercase transition-all duration-300 ${
                  isActive
                    ? 'opacity-100 font-bold text-[#121212] max-w-[120px]'
                    : 'opacity-0 max-w-0 overflow-hidden group-hover:opacity-70 group-hover:max-w-[100px] text-[#78766f]'
                }`}
              >
                {ch.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Floating active label pill */}
      <div className="text-[10px] font-mono-editorial font-bold uppercase tracking-widest text-[#78766f] bg-[#edeae1] px-2.5 py-1 rounded-full">
        {active.num} ━━━ {active.label}
      </div>
    </aside>
  );
};
