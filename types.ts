
export interface Player {
  id: string;
  name: string;
  rating: number;
  wins: number;
  losses: number;
  avatar: string;
}

export interface Match {
  id: string;
  playerA: Player;
  playerB: Player;
  winnerId?: string;
  status: 'pending' | 'active' | 'completed';
  timestamp: number;
  skillDiff: number;
}

export interface AVLNode {
  player: Player;
  left: AVLNode | null;
  right: AVLNode | null;
  height: number;
  x: number;
  y: number;
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

export interface Stats {
  totalMatches: number;
  avgRatingGap: number;
  totalMMRChange: number;
}
