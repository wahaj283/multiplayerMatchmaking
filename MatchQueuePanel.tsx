
import React from 'react';
import { Match } from '../types';

interface MatchQueuePanelProps {
  queue: Match[];
}

const MatchQueuePanel: React.FC<MatchQueuePanelProps> = ({ queue }) => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl flex flex-col shadow-lg overflow-hidden h-full">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Match Queue
        </h3>
        <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-mono">
          {queue.length} Pending
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scroll-hide">
        {queue.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 text-[10px] italic text-center px-4">
            No queued matches. Use "Find Match" to match a new player with the closest opponent.
          </div>
        ) : (
          queue.map((match, idx) => (
            <div 
              key={match.id} 
              className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-lg flex items-center justify-between group hover:border-indigo-500/50 transition-colors animate-in slide-in-from-right-2"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img src={match.playerA.avatar} className="w-6 h-6 rounded-full border border-slate-700 shadow-sm" title={match.playerA.name} />
                  <img src={match.playerB.avatar} className="w-6 h-6 rounded-full border border-slate-700 shadow-sm" title={match.playerB.name} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-300">
                    #{idx + 1} - Matchup
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {match.playerA.id} vs {match.playerB.id}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-amber-500">Δ {match.skillDiff}</div>
                <div className="text-[8px] text-slate-600 uppercase font-bold">Skill Gap</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MatchQueuePanel;
