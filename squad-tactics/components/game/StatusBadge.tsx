'use client';

import type { PlayerRole, PlayerStatus, Team } from '@/types/game';

interface StatusBadgeProps {
  role: PlayerRole;
  status: PlayerStatus;
  team: Team | null;
}

export function StatusBadge({ role, status, team }: StatusBadgeProps) {
  const getRoleIcon = () => {
    switch (role) {
      case 'SNIPER':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
            <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
          </svg>
        );
      case 'OCCUPIER':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        );
      case 'ADMIN':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 15l-2 5 3-3 3 3-2-5" />
            <path d="M12 3L3 9l9 6 9-6-9-6z" />
          </svg>
        );
    }
  };
  
  const getRoleLabel = () => {
    switch (role) {
      case 'SNIPER': return 'SNIPER';
      case 'OCCUPIER': return 'OCCUPIER';
      case 'ADMIN': return 'ADMIN';
    }
  };
  
  const teamColorClass = team?.color_hex === '#FF2D55' ? 'team-red' : 'team-blue';
  
  return (
    <div className="flex items-center gap-3">
      {/* Team badge */}
      {team && (
        <div className={`team-badge ${teamColorClass}`} style={{ backgroundColor: team.color_hex }}>
          {team.name}
        </div>
      )}
      
      {/* Role badge */}
      <div className="flex items-center gap-2 bg-bg-elevated px-3 py-1.5 rounded border border-border-dim">
        <span className="text-neon">{getRoleIcon()}</span>
        <span className="font-mono text-xs text-text-secondary">{getRoleLabel()}</span>
      </div>
      
      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <div className={`status-dot ${status === 'JAMMED' ? 'status-jammed' : 'status-active'}`} />
        <span className={`font-mono text-xs ${status === 'JAMMED' ? 'text-warning' : 'text-terminal'}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

