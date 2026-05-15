import { Link, useLocation } from 'react-router-dom';
import { Sprout, Home, FileSearch, BarChart3 } from 'lucide-react';

export function Header() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/analyze', label: 'Analyze', icon: FileSearch },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Sprout className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">AGRO ASSIST</span>
        </Link>
        
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
