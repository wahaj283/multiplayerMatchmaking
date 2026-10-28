
import React from 'react';
import { Match } from '../types';

interface MatchArenaProps {
  currentMatch: Match | null;
  onMatchComplete: (match: Match) => void;
}

const MatchArena: React.FC<MatchArenaProps> = ({ currentMatch, onMatchComplete }) => {
  if (!currentMatch) {
    return (
      <div className="w-full h-48 bg-slate-900/50 border border-slate-700 border-dashed rounded-xl flex items-center justify-center text-slate-500 italic">
        Waiting for next match...
      </div>
    );
  }

  const { playerA, playerB, status } = currentMatch;

  return (
    <div className="w-full bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-200">Match Arena</h3>
        <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded uppercase tracking-wider">
          {status}
        </span>
      </div>

      <div className="flex items-center justify-around relative">
        {/* Player A */}
        <div className="flex flex-col items-center gap-2 group">
          <div className="w-20 h-20 rounded-full border-4 border-slate-700 overflow-hidden shadow-lg group-hover:border-blue-500 transition-colors">
            <img src={playerA.avatar} alt={playerA.name} className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-slate-100">{playerA.name}</span>
          <span className="text-xs text-blue-400 font-mono">MMR: {playerA.rating}</span>
        </div>

        {/* VS Indicator */}
        <div className="flex flex-col items-center">
          <div className="text-4xl font-black italic text-slate-700 select-none">VS</div>
          <div className="mt-2 flex gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-300"></div>
          </div>
        </div>

        {/* Player B */}
        <div className="flex flex-col items-center gap-2 group">
          <div className="w-20 h-20 rounded-full border-4 border-slate-700 overflow-hidden shadow-lg group-hover:border-indigo-500 transition-colors">
            <img src={playerB.avatar} alt={playerB.name} className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-slate-100">{playerB.name}</span>
          <span className="text-xs text-indigo-400 font-mono">MMR: {playerB.rating}</span>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default MatchArena;
