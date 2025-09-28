import React from 'react';

interface SymbolProps {
  symbolId: string;
  className?: string;
}

const Symbol: React.FC<SymbolProps> = ({ symbolId, className = '' }) => {
  const getSymbolPath = (id: string) => {
    switch (id) {
      case 'circle':
        return (
          <circle 
            cx="50" 
            cy="50" 
            r="35" 
            fill="none" 
            stroke={`url(#gradient-${id})`} 
            strokeWidth="3.5"
            className="animate-pulse-gentle"
            style={{ paintOrder: 'stroke' }}
          />
        );
      case 'triangle':
        return (
          <polygon 
            points="50,15 85,75 15,75" 
            fill="none" 
            stroke={`url(#gradient-${id})`} 
            strokeWidth="3.5"
            className="animate-pulse-gentle"
            style={{ paintOrder: 'stroke' }}
          />
        );
      case 'diamond':
        return (
          <polygon 
            points="50,15 85,50 50,85 15,50" 
            fill="none" 
            stroke={`url(#gradient-${id})`} 
            strokeWidth="3.5"
            className="animate-pulse-gentle"
            style={{ paintOrder: 'stroke' }}
          />
        );
      case 'hexagon':
        return (
          <polygon 
            points="50,15 75,30 75,70 50,85 25,70 25,30" 
            fill="none" 
            stroke={`url(#gradient-${id})`} 
            strokeWidth="3.5"
            className="animate-pulse-gentle"
            style={{ paintOrder: 'stroke' }}
          />
        );
      case 'star':
        return (
          <polygon 
            points="50,15 58,35 80,35 64,50 72,70 50,58 28,70 36,50 20,35 42,35" 
            fill="none" 
            stroke={`url(#gradient-${id})`} 
            strokeWidth="3.5"
            className="animate-pulse-gentle"
            style={{ paintOrder: 'stroke' }}
          />
        );
      case 'cross':
        return (
          <g>
            <line 
              x1="50" 
              y1="20" 
              x2="50" 
              y2="80" 
              stroke={`url(#gradient-${id})`} 
              strokeWidth="3.5"
              className="animate-pulse-gentle"
              style={{ paintOrder: 'stroke' }}
            />
            <line 
              x1="20" 
              y1="50" 
              x2="80" 
              y2="50" 
              stroke={`url(#gradient-${id})`} 
              strokeWidth="3.5"
              className="animate-pulse-gentle"
              style={{ paintOrder: 'stroke' }}
            />
          </g>
        );
      case 'wave':
        return (
          <path 
            d="M15,50 Q30,25 50,50 T85,50" 
            fill="none" 
            stroke={`url(#gradient-${id})`} 
            strokeWidth="3.5"
            className="animate-pulse-gentle"
            style={{ paintOrder: 'stroke' }}
          />
        );
      case 'spiral':
        return (
          <path 
            d="M50,50 Q60,40 70,50 Q60,60 50,50 Q40,40 30,50 Q40,60 50,50 Q55,45 60,50" 
            fill="none" 
            stroke={`url(#gradient-${id})`} 
            strokeWidth="3.5"
            className="animate-pulse-gentle"
            style={{ paintOrder: 'stroke' }}
          />
        );
      default:
        return (
          <circle 
            cx="50" 
            cy="50" 
            r="35" 
            fill="none" 
            stroke={`url(#gradient-${id})`} 
            strokeWidth="3.5"
            className="animate-pulse-gentle"
            style={{ paintOrder: 'stroke' }}
          />
        );
    }
  };

  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`w-full h-full transition-all duration-500 hover:scale-110 ${className}`}
      style={{ 
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }}
    >
      <defs>
        <linearGradient id={`gradient-${symbolId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
        </linearGradient>
      </defs>
      {getSymbolPath(symbolId)}
    </svg>
  );
};

export default Symbol;
