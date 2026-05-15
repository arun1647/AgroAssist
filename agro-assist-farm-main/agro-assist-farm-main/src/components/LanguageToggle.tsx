import { Languages } from 'lucide-react';
import type { Language } from '@/types/analysis';

interface LanguageToggleProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageToggle({ language, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="space-y-3">
      <label className="block text-lg font-semibold text-foreground">
        <Languages className="inline-block w-5 h-5 mr-2 text-primary" />
        Language / மொழி
      </label>
      
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onLanguageChange('english')}
          className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
            language === 'english'
              ? 'bg-primary text-primary-foreground shadow-glow'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => onLanguageChange('tamil')}
          className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
            language === 'tamil'
              ? 'bg-primary text-primary-foreground shadow-glow'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          தமிழ்
        </button>
      </div>
    </div>
  );
}
