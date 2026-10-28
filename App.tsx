
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Player, AVLNode, Match, LogEntry, Stats } from './types';
import { AVLTree } from './logic/avl';
import { generatePlayers } from './logic/playerGenerator';
import AVLTreeVisualizer from './components/AVLTreeVisualizer';
import MatchArena from './components/MatchArena';
import ControlPanel from './components/ControlPanel';
import ExplanationPanel from './components/ExplanationPanel';
import StatsPanel from './components/StatsPanel';
import MatchQueuePanel from './components/MatchQueuePanel';
import AddPlayerForm from './components/AddPlayerForm';
import FindMatchForm from './components/FindMatchForm';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<AVLNode | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [matchQueue, setMatchQueue] = useState<Match[]>([]);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [stats, setStats] = useState<Stats>({ totalMatches: 0, avgRatingGap: 0, totalMMRChange: 0 });
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
  const [showFindMatchForm, setShowFindMatchForm] = useState(false);
  const [playerIdCounter, setPlayerIdCounter] = useState(1);
  
  const avlRef = useRef(new AVLTree());

  const addLog = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(2, 11),
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }].slice(-50)); // Keep last 50 logs
  }, []);

  const updateTreeState = useCallback(() => {
    setTreeState(avlRef.current.root ? { ...avlRef.current.root } : null);
    while (avlRef.current.logs.length > 0) {
      const msg = avlRef.current.logs.shift();
      if (msg) addLog(msg, 'warning');
    }
  }, [addLog]);

  const scanForMatches = useCallback(() => {
    const sorted = avlRef.current.getNodesInOrder();
    if (sorted.length < 2) return;

    const newMatches: Match[] = [];
    const usedIds = new Set<string>();

    for (let i = 0; i < sorted.length - 1; i++) {
      const p1 = sorted[i];
      const p2 = sorted[i+1];
      
      if (!usedIds.has(p1.id) && !usedIds.has(p2.id)) {
        const diff = Math.abs(p1.rating - p2.rating);
        // Heuristic: only queue if reasonably close or we are desperate
        if (diff < 500) {
          newMatches.push({
            id: `M-${Math.random().toString(36).substring(2, 7)}`,
            playerA: p1,
            playerB: p2,
            status: 'pending',
            timestamp: Date.now(),
            skillDiff: diff
          });
          usedIds.add(p1.id);
          usedIds.add(p2.id);
        }
      }
    }

    if (newMatches.length > 0) {
      addLog(`Tree scan complete: ${newMatches.length} matchups enqueued.`, 'info');
      setMatchQueue(prev => [...prev, ...newMatches]);
    }
  }, [addLog]);

  const handleGeneratePlayers = useCallback((count: number) => {
    const newPlayers = generatePlayers(count, [1000, 3000]);
    newPlayers.forEach(p => {
      avlRef.current.root = avlRef.current.insert(avlRef.current.root, p);
    });
    setAllPlayers(prev => [...prev, ...newPlayers]);
    addLog(`Inserted ${count} players. Rebalancing AVL Tree...`, 'info');
    updateTreeState();
    // After insertion, scan for potential matches
    setTimeout(scanForMatches, 500);
  }, [addLog, updateTreeState, scanForMatches]);

  const handleAddPlayer = useCallback((name: string, rating: number) => {
    const newPlayer: Player = {
      id: `P-${playerIdCounter}`,
      name,
      rating,
      wins: 0,
      losses: 0,
      avatar: `https://picsum.photos/seed/${playerIdCounter + 1000}/100/100`,
    };
    
    avlRef.current.root = avlRef.current.insert(avlRef.current.root, newPlayer);
    setAllPlayers(prev => [...prev, newPlayer]);
    setPlayerIdCounter(prev => prev + 1);
    addLog(`Added player "${name}" with rating ${rating}. Rebalancing AVL Tree...`, 'success');
    updateTreeState();
    // After insertion, scan for potential matches
    setTimeout(scanForMatches, 500);
  }, [playerIdCounter, addLog, updateTreeState, scanForMatches]);

  const handleFindMatch = useCallback((name: string, rating: number) => {
    if (currentMatch) {
      addLog('A match is already in progress. Please wait.', 'warning');
      return;
    }

    // Check if tree has any players
    const sorted = avlRef.current.getNodesInOrder();
    if (sorted.length === 0) {
      addLog('No players available for matching. Add players to the tree first.', 'error');
      return;
    }

    // Create new player
    const newPlayer: Player = {
      id: `P-${playerIdCounter}`,
      name,
      rating,
      wins: 0,
      losses: 0,
      avatar: `https://picsum.photos/seed/${playerIdCounter + 1000}/100/100`,
    };
    setPlayerIdCounter(prev => prev + 1);

    // Find closest player
    const closestPlayer = avlRef.current.findClosestPlayer(rating);
    
    if (!closestPlayer) {
      addLog('Could not find a matching opponent.', 'error');
      return;
    }

    const skillDiff = Math.abs(newPlayer.rating - closestPlayer.rating);
    addLog(`Player "${name}" (${rating}) searching for match...`, 'info');
    addLog(`Found closest opponent: ${closestPlayer.name} (${closestPlayer.rating}) - skill gap: ${skillDiff}`, 'success');

    // Create match
    const match: Match = {
      id: `M-${Math.random().toString(36).substring(2, 7)}`,
      playerA: newPlayer,
      playerB: closestPlayer,
      status: 'active',
      timestamp: Date.now(),
      skillDiff: skillDiff
    };

    // Remove opponent from tree (new player was never in tree)
    avlRef.current.root = avlRef.current.delete(avlRef.current.root, closestPlayer.rating, closestPlayer.id);
    updateTreeState();

    // Add new player to allPlayers list
    setAllPlayers(prev => [...prev, newPlayer]);

    setCurrentMatch(match);

    // Simulate match
    setTimeout(() => {
      const winProbA = 0.5 + (newPlayer.rating - closestPlayer.rating) / 1000;
      const winnerId = Math.random() < winProbA ? newPlayer.id : closestPlayer.id;
      const mmrChange = 25;

      const updatedP1 = { ...newPlayer };
      const updatedP2 = { ...closestPlayer };

      if (winnerId === newPlayer.id) {
        updatedP1.rating += mmrChange;
        updatedP1.wins += 1;
        updatedP2.rating -= mmrChange;
        updatedP2.losses += 1;
      } else {
        updatedP1.rating -= mmrChange;
        updatedP1.losses += 1;
        updatedP2.rating += mmrChange;
        updatedP2.wins += 1;
      }

      const winnerName = winnerId === newPlayer.id ? newPlayer.name : closestPlayer.name;
      const loserName = winnerId === newPlayer.id ? closestPlayer.name : newPlayer.name;
      const winner = winnerId === newPlayer.id ? updatedP1 : updatedP2;
      const loser = winnerId === newPlayer.id ? updatedP2 : updatedP1;
      
      addLog(`${winnerName} wins! ${updatedP1.name}: ${newPlayer.rating} → ${updatedP1.rating}, ${updatedP2.name}: ${closestPlayer.rating} → ${updatedP2.rating}`, 'success');
      addLog(`Winner ${winnerName} (${winner.rating}) re-enters matchmaking queue. ${loserName} eliminated.`, 'info');

      // Only insert winner back into tree
      avlRef.current.root = avlRef.current.insert(avlRef.current.root, winner);
      
      // Update allPlayers: update winner, remove loser if they were in the tree
      setAllPlayers(prev => {
        const updated = prev.map(p => {
          if (p.id === winner.id) return winner;
          return p;
        });
        // Remove loser from the list (they're eliminated)
        return updated.filter(p => p.id !== loser.id);
      });

      setStats(prev => ({
        totalMatches: prev.totalMatches + 1,
        avgRatingGap: (prev.avgRatingGap * prev.totalMatches + skillDiff) / (prev.totalMatches + 1),
        totalMMRChange: prev.totalMMRChange + mmrChange
      }));

      setCurrentMatch(null);
      updateTreeState();
    }, 2500);

  }, [currentMatch, playerIdCounter, addLog, updateTreeState]);


  const handleReset = () => {
    avlRef.current = new AVLTree();
    setTreeState(null);
    setAllPlayers([]);
    setMatchQueue([]);
    setCurrentMatch(null);
    setLogs([]);
    setStats({ totalMatches: 0, avgRatingGap: 0, totalMMRChange: 0 });
    setIsAutoRunning(false);
    setPlayerIdCounter(1);
    setShowAddPlayerForm(false);
    setShowFindMatchForm(false);
    addLog("System reset. Database cleared.", "error");
  };

  return (
    <div className="flex h-screen w-full bg-[#0f172a] text-slate-200 overflow-hidden">
      {/* Sidebar: Controls & Stats */}
      <div className="w-80 flex flex-col p-4 border-r border-slate-800 space-y-4 overflow-y-auto scroll-hide bg-slate-900/40 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-2 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-black text-white leading-tight uppercase tracking-tighter">AVL Matchmaker</h1>
            <p className="text-[10px] text-slate-500 font-medium">Full Simulator Pro</p>
          </div>
        </div>

        <ControlPanel 
          onGeneratePlayers={handleGeneratePlayers}
          onAddPlayer={() => setShowAddPlayerForm(true)}
          onReset={handleReset}
          onNextMatch={() => setShowFindMatchForm(true)}
          playerCount={allPlayers.length}
          currentMatch={currentMatch}
        />

        <StatsPanel stats={stats} leaderboard={allPlayers} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 gap-6 relative">
        <div className="flex gap-6 h-3/5">
          {/* AVL Visualizer */}
          <div className="flex-[2] min-w-0">
            <AVLTreeVisualizer 
              root={treeState} 
              highlightedIds={currentMatch ? [currentMatch.playerA.id, currentMatch.playerB.id] : []} 
            />
          </div>

          {/* Explanation Sidebar */}
          <div className="flex-1 min-w-0 max-w-sm">
            <ExplanationPanel logs={logs} />
          </div>
        </div>

        <div className="flex gap-6 h-2/5">
          {/* Match Arena */}
          <div className="flex-[1.5]">
            <MatchArena currentMatch={currentMatch} onMatchComplete={() => {}} />
          </div>

          {/* Match Queue Panel */}
          <div className="flex-1">
            <MatchQueuePanel queue={matchQueue} />
          </div>

          {/* Logic Summary */}
          <div className="w-64 shrink-0 bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-lg hidden lg:block">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">System Health</h4>
             <div className="space-y-2">
                <div className="flex justify-between text-[10px] py-1 border-b border-slate-800">
                  <span className="text-slate-500">Tree Balance</span>
                  <span className="text-emerald-400 font-mono">Stable</span>
                </div>
                <div className="flex justify-between text-[10px] py-1 border-b border-slate-800">
                  <span className="text-slate-500">Queue Depth</span>
                  <span className="text-indigo-400 font-mono">{matchQueue.length}</span>
                </div>
                <div className="flex justify-between text-[10px] py-1">
                  <span className="text-slate-500">Wait Time</span>
                  <span className="text-blue-400 font-mono">~3.2s</span>
                </div>
             </div>
             <div className="mt-4 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-[10px] leading-relaxed text-indigo-200">
                The simulator scans the tree using an <strong>In-Order Traversal</strong> to find pairs with minimal rating delta.
             </div>
          </div>
        </div>
      </div>

      {/* Add Player Form Modal */}
      {showAddPlayerForm && (
        <AddPlayerForm
          onAddPlayer={handleAddPlayer}
          onClose={() => setShowAddPlayerForm(false)}
        />
      )}

      {/* Find Match Form Modal */}
      {showFindMatchForm && (
        <FindMatchForm
          onFindMatch={handleFindMatch}
          onClose={() => setShowFindMatchForm(false)}
        />
      )}
    </div>
  );
};

export default App;
