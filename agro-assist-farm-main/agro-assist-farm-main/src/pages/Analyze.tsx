import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ImageUpload } from '@/components/ImageUpload';
import { LocationDetector } from '@/components/LocationDetector';
import { SeasonSelector } from '@/components/SeasonSelector';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, FileSearch, LandPlot, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { AnalysisInput, Season, Language, LocationData, AnalysisResult } from '@/types/analysis';

export default function Analyze() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<AnalysisInput>({
    soilImage: null,
    location: null,
    season: 'Monsoon',
    landSize: 1,
    language: 'english',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.location) {
      setError('Please detect or enter your location');
      return;
    }

    if (formData.landSize <= 0) {
      setError('Please enter valid land size');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-soil', {
        body: {
          soilImage: formData.soilImage,
          location: formData.location,
          season: formData.season,
          landSize: formData.landSize,
          language: formData.language,
        },
      });

      if (fnError) throw fnError;

      // Navigate to results with the analysis data
      navigate('/results', { state: { result: data as AnalysisResult, input: formData } });
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <FileSearch className="w-5 h-5" />
            <span className="font-medium">Soil Analysis</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Analyze Your Soil</h1>
          <p className="text-muted-foreground mt-2">Fill in the details below to get crop recommendations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <ImageUpload 
            selectedImage={formData.soilImage}
            onImageSelect={(img) => setFormData(prev => ({ ...prev, soilImage: img }))}
          />

          {/* Location */}
          <LocationDetector
            location={formData.location}
            onLocationChange={(loc) => setFormData(prev => ({ ...prev, location: loc }))}
          />

          {/* Season */}
          <SeasonSelector
            season={formData.season}
            onSeasonChange={(season) => setFormData(prev => ({ ...prev, season }))}
          />

          {/* Land Size */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-foreground">
              <LandPlot className="inline-block w-5 h-5 mr-2 text-primary" />
              Land Size (in Acres)
            </label>
            <Input
              type="number"
              min="0.1"
              step="0.1"
              value={formData.landSize}
              onChange={(e) => setFormData(prev => ({ ...prev, landSize: parseFloat(e.target.value) || 0 }))}
              placeholder="Enter land size in acres"
              className="farmer-input"
            />
          </div>

          {/* Language */}
          <LanguageToggle
            language={formData.language}
            onLanguageChange={(lang) => setFormData(prev => ({ ...prev, language: lang }))}
          />

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-xl">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !formData.location}
            className="w-full py-6 text-xl gap-2 shadow-glow"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileSearch className="w-6 h-6" />
                Get Crop Recommendations
              </>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
