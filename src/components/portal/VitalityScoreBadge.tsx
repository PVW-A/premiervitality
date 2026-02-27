import { motion } from "framer-motion";
import { getScoreColor, getScoreLabel } from "@/lib/vitality";

interface VitalityScoreBadgeProps {
  score: number | null;
  onClick: () => void;
}

export default function VitalityScoreBadge({ score, onClick }: VitalityScoreBadgeProps) {
  if (score === null) return null;

  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const circumference = 2 * Math.PI * 22;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer"
      style={{
        background: `hsl(${color} / 0.06)`,
        border: `1px solid hsl(${color} / 0.15)`,
      }}
    >
      <div className="relative w-12 h-12 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="22" fill="none" stroke="hsl(var(--muted-foreground) / 0.1)" strokeWidth="3" />
          <motion.circle
            cx="26" cy="26" r="22" fill="none"
            stroke={`hsl(${color})`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
            style={{ filter: `drop-shadow(0 0 4px hsl(${color} / 0.4))` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-heading font-light text-foreground tabular-nums">{score}</span>
        </div>
      </div>
      <div className="text-left">
        <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 font-body block">
          Vitality
        </span>
        <span className="text-xs font-body font-light" style={{ color: `hsl(${color})` }}>
          {label}
        </span>
      </div>
    </motion.button>
  );
}
