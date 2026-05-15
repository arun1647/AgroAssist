import { Sun, Cloud, CloudRain, Leaf, Wind } from 'lucide-react';
import type { Season } from '@/types/analysis';

interface SeasonSelectorProps {
  season: Season;
  onSeasonChange: (season: Season) => void;
}

const seasons: { value: Season; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'Summer', label: 'Summer', icon: <Sun className="w-6 h-6" />, color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { value: 'Winter', label: 'Winter', icon: <Wind className="w-6 h-6" />, color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'Monsoon', label: 'Monsoon', icon: <CloudRain className="w-6 h-6" />, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
  { value: 'Pre-Monsoon', label: 'Pre-Monsoon', icon: <Cloud className="w-6 h-6" />, color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { value: 'Post-Monsoon', label: 'Post-Monsoon', icon: <Leaf className="w-6 h-6" />, color: 'bg-green-100 text-green-700 border-green-300' },
];

export function SeasonSelector({ season, onSeasonChange }: SeasonSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold text-foreground">
        <CloudRain className="inline-block w-5 h-5 mr-2 text-primary" />
        Current Season
      </label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {seasons.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onSeasonChange(s.value)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              season === s.value
                ? `${s.color} border-current shadow-md scale-[1.02]`
                : 'bg-background border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
          >
            {s.icon}
            <span className="font-medium text-sm">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
