import { useEffect, useState } from 'react';
import { getScoreColor } from '../data';

interface ESGScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export default function ESGScoreRing({ score, size = 120, strokeWidth = 8, label, showLabel = true, animated = true }: ESGScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(animated ? 0 : score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(animatedScore);

  useEffect(() => {
    if (!animated) { setAnimatedScore(score); return; }
    let frame: number;
    let start: number | null = null;
    const duration = 1200;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score, animated]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(42, 42, 62, 0.5)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-100"
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black" style={{ color }}>{animatedScore}</span>
        {showLabel && label && (
          <span className="text-[10px] text-obsidian-400 mt-0.5">{label}</span>
        )}
      </div>
    </div>
  );
}
