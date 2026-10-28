
import React from 'react';

interface ControlPanelProps {
  onGeneratePlayers: (count: number) => void;
  onAddPlayer: () => void;
  onReset: () => void;
  onNextMatch: () => void;
  playerCount: number;
  currentMatch?: any;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onGeneratePlayers,
  onAddPlayer,
  onReset,
  onNextMatch,
  playerCount,
  currentMatch
}) => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-lg">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Simulation Controls</h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onGeneratePlayers(10)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-600 transition-all active:scale-95"
        >
          Generate +10 Players
        </button>
        <button
          onClick={onAddPlayer}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Player
        </button>
        <button
          onClick={onNextMatch}
          disabled={currentMatch !== null || playerCount === 0}
          className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-900/20"
          title={playerCount === 0 ? "Add players to tree first" : currentMatch ? "Match in progress" : "Find match for a new player"}
        >
          Find Match
        </button>
        <button
          onClick={onReset}
          className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white text-xs font-semibold rounded-lg border border-rose-600/20 transition-all active:scale-95"
        >
          Reset Simulation
        </button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
        <span>Players in Queue: {playerCount}</span>
        <span>Matchmaking: Manual</span>
      </div>
    </div>
  );
};

export default ControlPanel;
