
import React from 'react';
import { Stats, Player } from '../types';

interface StatsPanelProps {
  stats: Stats;
  leaderboard: Player[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, leaderboard }) => {
  // Simple distribution logic: buckets of 500 MMR
  const buckets = [0, 0, 0, 0, 0, 0]; // 0-500, 501-1000, etc.
  leaderboard.forEach(p => {
    const idx = Math.min(Math.floor(p.rating / 500), 5);
    buckets[idx]++;
  });
  const maxBucket = Math.max(...buckets, 1);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-lg">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Simulation Stats</h3>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-2 bg-slate-800 rounded-lg">
          <div className="text-lg font-bold text-white">{stats.totalMatches}</div>
          <div className="text-[9px] text-slate-500 uppercase">Matches</div>
        </div>
        <div className="text-center p-2 bg-slate-800 rounded-lg">
          <div className="text-lg font-bold text-blue-400">{Math.round(stats.avgRatingGap)}</div>
          <div className="text-[9px] text-slate-500 uppercase">Avg Gap</div>
        </div>
        <div className="text-center p-2 bg-slate-800 rounded-lg">
          <div className="text-lg font-bold text-emerald-400">{stats.totalMMRChange}</div>
          <div className="text-[9px] text-slate-500 uppercase">ΔMMR</div>
        </div>
      </div>

      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Rating Distribution</h4>
      <div className="flex items-end justify-between h-16 gap-1 mb-6 px-1">
        {buckets.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center group">
            <div 
              className="w-full bg-indigo-600 rounded-t-sm transition-all duration-500 group-hover:bg-indigo-400" 
              style={{ height: `${(val / maxBucket) * 100}%` }}
            ></div>
            <span className="text-[7px] text-slate-600 mt-1">{i * 500}+</span>
          </div>
        ))}
      </div>

      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Live Leaderboard</h4>
      <div className="space-y-1.5 max-h-40 overflow-y-auto scroll-hide">
        {leaderboard.length === 0 ? (
          <div className="text-center py-4 text-[10px] text-slate-700 italic">No players available</div>
        ) : (
          leaderboard.sort((a,b) => b.rating - a.rating).slice(0, 8).map((p, idx) => (
            <div key={p.id} className="flex items-center justify-between bg-slate-800/50 p-1.5 rounded-lg border border-slate-700/50">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-600 w-3">{idx+1}</span>
                <img src={p.avatar} className="w-5 h-5 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-200 truncate w-20">{p.name}</span>
                </div>
              </div>
              <div className="text-[10px] font-mono font-bold text-blue-400">{p.rating}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StatsPanel;
