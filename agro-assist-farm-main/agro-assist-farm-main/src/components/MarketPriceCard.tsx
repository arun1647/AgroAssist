import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { MarketPrice } from '@/types/analysis';

interface MarketPriceCardProps {
  price: MarketPrice;
}

export function MarketPriceCard({ price }: MarketPriceCardProps) {
  const getTrendIcon = () => {
    switch (price.trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-crop-green" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-destructive" />;
      default:
        return <Minus className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (price.trend) {
      case 'up':
        return 'text-crop-green bg-green-50';
      case 'down':
        return 'text-destructive bg-red-50';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:shadow-soft transition-shadow">
      <div>
        <p className="font-semibold text-foreground">{price.crop}</p>
        <p className="text-lg font-bold text-primary">
          ₹{price.currentPrice.toLocaleString()}/{price.unit}
        </p>
      </div>
      <div className={`flex items-center gap-1 px-3 py-2 rounded-lg ${getTrendColor()}`}>
        {getTrendIcon()}
        <span className="font-medium">{price.change > 0 ? '+' : ''}{price.change}%</span>
      </div>
    </div>
  );
}
