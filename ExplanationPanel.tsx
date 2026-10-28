
import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';

interface ExplanationPanelProps {
  logs: LogEntry[];
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogStyle = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-emerald-500 text-emerald-400';
      case 'warning': return 'border-l-amber-500 text-amber-400';
      case 'error': return 'border-l-rose-500 text-rose-400';
      default: return 'border-l-blue-500 text-blue-400';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl h-full flex flex-col shadow-lg">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur rounded-t-xl">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          Step-by-Step Logic
        </h3>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth scroll-hide"
      >
        {logs.length === 0 && (
          <div className="text-center py-10 text-slate-600 text-xs italic">
            No events logged yet. Start the simulation.
          </div>
        )}
        {logs.map((log) => (
          <div 
            key={log.id} 
            className={`pl-3 border-l-2 bg-slate-800/30 p-2 rounded-r-md transition-all animate-in slide-in-from-left-2 duration-300 ${getLogStyle(log.type)}`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] opacity-60 font-mono">{log.timestamp}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-medium">{log.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplanationPanel;
