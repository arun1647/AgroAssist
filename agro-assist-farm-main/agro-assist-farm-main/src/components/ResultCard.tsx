import { ReactNode } from 'react';

interface ResultCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ResultCard({ title, icon, children, className = '' }: ResultCardProps) {
  return (
    <div className={`farmer-card animate-fade-in ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}
