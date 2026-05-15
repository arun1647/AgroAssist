import { Wheat, Clock, TrendingUp } from 'lucide-react';
import type { CropRecommendation } from '@/types/analysis';

interface CropCardProps {
  crop: CropRecommendation;
  index: number;
}

export function CropCard({ crop, index }: CropCardProps) {
  const rankColors = ['bg-amber-500', 'bg-slate-400', 'bg-amber-700'];
  
  return (
    <div 
      className="p-5 rounded-xl bg-gradient-to-br from-card to-muted/50 border border-border/50 shadow-soft hover:shadow-card transition-all"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${rankColors[index]} flex items-center justify-center text-white font-bold shadow-md`}>
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Wheat className="w-5 h-5 text-primary" />
            {crop.name}
          </h4>
          <p className="text-muted-foreground mt-2 leading-relaxed">{crop.reason}</p>
          
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-crop-green" />
              <span className="text-foreground font-medium">
                {crop.expectedYield} {crop.yieldUnit}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-sky-blue" />
              <span className="text-foreground font-medium">{crop.growingPeriod}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
