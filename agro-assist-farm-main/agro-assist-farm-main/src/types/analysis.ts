export type SoilType = 
  | 'Red Soil'
  | 'Black Soil'
  | 'Sandy Soil'
  | 'Clay Soil'
  | 'Loamy Soil'
  | 'Laterite Soil'
  | 'Alluvial Soil'
  | 'Peaty Soil'
  | 'Saline Soil'
  | 'Mixed Soil';

export type Season = 
  | 'Summer'
  | 'Winter'
  | 'Monsoon'
  | 'Pre-Monsoon'
  | 'Post-Monsoon';

export type Language = 'english' | 'tamil';

export interface LocationData {
  latitude: number;
  longitude: number;
  state: string;
  district: string;
}

export interface AnalysisInput {
  soilImage: string | null;
  location: LocationData | null;
  season: Season;
  landSize: number;
  language: Language;
}

export interface CropRecommendation {
  name: string;
  reason: string;
  expectedYield: number;
  yieldUnit: string;
  growingPeriod: string;
}

export interface MarketPrice {
  crop: string;
  currentPrice: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface AnalysisResult {
  soilType: SoilType;
  soilDescription: string;
  recommendations: CropRecommendation[];
  totalYield: number;
  estimatedProfit: number;
  marketPrices: MarketPrice[];
  futureCrop: {
    name: string;
    reason: string;
  };
  soilTip: string;
}
