import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { 
  Sprout, 
  Camera, 
  MapPin, 
  BarChart3, 
  TrendingUp,
  Wheat,
  Sun,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Camera,
    title: 'Soil Analysis',
    description: 'Upload a photo of your soil and get instant type detection',
  },
  {
    icon: MapPin,
    title: 'Location Based',
    description: 'Get recommendations based on your exact location and climate',
  },
  {
    icon: Wheat,
    title: 'Crop Suggestions',
    description: 'Receive 3 best crop recommendations for your land',
  },
  {
    icon: TrendingUp,
    title: 'Yield Estimation',
    description: 'Know how much you can harvest and earn',
  },
  {
    icon: BarChart3,
    title: 'Market Prices',
    description: 'Check current prices and 7-day market trends',
  },
  {
    icon: Sun,
    title: 'Future Planning',
    description: 'Get tips for next season crops and soil care',
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
              <Sprout className="w-5 h-5" />
              <span className="font-medium">Smart Farming Made Simple</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-slide-up">
              AGRO ASSIST
            </h1>
            <p className="text-xl md:text-2xl text-primary font-semibold mt-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Enhancing Agriculture Efficiency
            </p>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Upload your soil photo, share your location, and get personalized crop recommendations, 
              yield predictions, and market prices - all in simple language.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/analyze">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 gap-2 shadow-glow hover:shadow-glow/50">
                  Start Soil Analysis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle mt-2">Simple steps for better farming decisions</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title} 
                  className="farmer-card group hover:border-primary/30"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-3 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mt-4">{feature.title}</h3>
                  <p className="text-muted-foreground mt-2">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto text-center farmer-card gradient-hero text-primary-foreground">
            <Sprout className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold">Ready to Grow Better?</h2>
            <p className="mt-3 opacity-90">
              Start your free soil analysis today and make informed farming decisions.
            </p>
            <Link to="/analyze" className="mt-6 inline-block">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-6 gap-2 bg-background text-primary hover:bg-background/90"
              >
                Analyze Your Soil Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sprout className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">AGRO ASSIST</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Helping farmers make smart decisions
          </p>
        </div>
      </footer>
    </div>
  );
}
