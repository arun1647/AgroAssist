import { useLocation, Navigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ResultCard } from '@/components/ResultCard';
import { CropCard } from '@/components/CropCard';
import { MarketPriceCard } from '@/components/MarketPriceCard';
import { Button } from '@/components/ui/button';
import { 
  Sprout, 
  Wheat, 
  TrendingUp, 
  BarChart3, 
  Lightbulb,
  MapPin,
  Calendar,
  ArrowLeft,
  RefreshCw,
  IndianRupee,
  Scale
} from 'lucide-react';
import type { AnalysisResult, AnalysisInput } from '@/types/analysis';

interface LocationState {
  result: AnalysisResult;
  input: AnalysisInput;
}

export default function Results() {
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (!state?.result) {
    return <Navigate to="/analyze" replace />;
  }

  const { result, input } = state;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sprout className="w-5 h-5" />
            <span className="font-medium">Analysis Complete</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Your Crop Recommendations</h1>
          
          {/* Input Summary */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            {input.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {input.location.district}, {input.location.state}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {input.season}
            </span>
            <span className="flex items-center gap-1">
              <Scale className="w-4 h-4" />
              {input.landSize} Acres
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Soil Type */}
          <ResultCard
            title="Soil Type Detected"
            icon={<Sprout className="w-6 h-6" />}
          >
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
              <p className="text-2xl font-bold text-primary">{result.soilType}</p>
              <p className="text-muted-foreground mt-2">{result.soilDescription}</p>
            </div>
          </ResultCard>

          {/* Crop Recommendations */}
          <ResultCard
            title="Top 3 Crop Recommendations"
            icon={<Wheat className="w-6 h-6" />}
          >
            <div className="space-y-4">
              {result.recommendations.map((crop, index) => (
                <CropCard key={crop.name} crop={crop} index={index} />
              ))}
            </div>
          </ResultCard>

          {/* Yield and Profit Estimation */}
          <ResultCard
            title="Expected Yield & Profit"
            icon={<TrendingUp className="w-6 h-6" />}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-crop-green/10 border border-crop-green/20">
                <div className="flex items-center gap-2 text-crop-green mb-2">
                  <Scale className="w-5 h-5" />
                  <span className="font-medium">Total Expected Yield</span>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {result.totalYield.toLocaleString()} <span className="text-lg font-normal text-muted-foreground">quintals</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">For {input.landSize} acres of land</p>
              </div>
              
              <div className="p-5 rounded-xl bg-sun-yellow/10 border border-sun-yellow/20">
                <div className="flex items-center gap-2 text-amber-600 mb-2">
                  <IndianRupee className="w-5 h-5" />
                  <span className="font-medium">Estimated Profit</span>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  ₹{result.estimatedProfit.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Based on current market prices</p>
              </div>
            </div>
          </ResultCard>

          {/* Market Prices */}
          <ResultCard
            title="Current Market Prices"
            icon={<BarChart3 className="w-6 h-6" />}
          >
            <p className="text-sm text-muted-foreground mb-4">7-day price trend comparison</p>
            <div className="space-y-3">
              {result.marketPrices.map((price) => (
                <MarketPriceCard key={price.crop} price={price} />
              ))}
            </div>
          </ResultCard>

          {/* Future Recommendation */}
          <ResultCard
            title="Plan for Next Season"
            icon={<Lightbulb className="w-6 h-6" />}
          >
            <div className="space-y-4">
              <div className="p-4 bg-sky-blue/10 rounded-xl border border-sky-blue/20">
                <p className="font-semibold text-foreground">Next Season Crop: {result.futureCrop.name}</p>
                <p className="text-muted-foreground mt-1">{result.futureCrop.reason}</p>
              </div>
              
              <div className="p-4 bg-earth-tan/30 rounded-xl border border-earth-tan">
                <p className="font-semibold text-foreground">Soil Care Tip</p>
                <p className="text-muted-foreground mt-1">{result.soilTip}</p>
              </div>
            </div>
          </ResultCard>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/analyze" className="flex-1">
              <Button variant="outline" size="lg" className="w-full py-6 text-lg gap-2">
                <RefreshCw className="w-5 h-5" />
                New Analysis
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="secondary" size="lg" className="w-full py-6 text-lg gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
