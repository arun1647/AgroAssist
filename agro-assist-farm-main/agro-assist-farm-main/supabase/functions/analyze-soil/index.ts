import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type SoilType = 
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

interface CropRecommendation {
  name: string;
  reason: string;
  expectedYield: number;
  yieldUnit: string;
  growingPeriod: string;
}

interface MarketPrice {
  crop: string;
  currentPrice: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

// Mock soil classification based on various inputs
function classifySoil(hasImage: boolean, state: string, district: string): SoilType {
  const soilTypes: SoilType[] = [
    'Red Soil', 'Black Soil', 'Sandy Soil', 'Clay Soil', 'Loamy Soil',
    'Laterite Soil', 'Alluvial Soil', 'Peaty Soil', 'Saline Soil', 'Mixed Soil'
  ];
  
  // Use location and time for deterministic but varied results
  const locationHash = (state.length * 7 + district.length * 13 + Date.now() % 10000) % soilTypes.length;
  return soilTypes[locationHash];
}

function getSoilDescription(soilType: SoilType, language: string): string {
  const descriptions: Record<SoilType, { en: string; ta: string }> = {
    'Red Soil': {
      en: 'Your soil is red colored due to iron content. Good drainage but needs more nutrients.',
      ta: 'உங்கள் மண் இரும்புச் சத்தால் சிவப்பு நிறம். நல்ல வடிகால் ஆனால் அதிக சத்துக்கள் தேவை.'
    },
    'Black Soil': {
      en: 'Rich black cotton soil. Holds water well and very fertile for many crops.',
      ta: 'செழிப்பான கருப்பு பருத்தி மண். நீரை நன்கு தக்க வைக்கும், பல பயிர்களுக்கு மிகவும் வளமானது.'
    },
    'Sandy Soil': {
      en: 'Light sandy soil with quick drainage. Good for root vegetables and groundnuts.',
      ta: 'விரைவான வடிகால் கொண்ட இலகுவான மணல் மண். கிழங்கு வகைகள் மற்றும் வேர்க்கடலைக்கு நல்லது.'
    },
    'Clay Soil': {
      en: 'Heavy clay soil that holds moisture. Good for rice and wheat cultivation.',
      ta: 'ஈரப்பதத்தை தக்க வைக்கும் கனமான களிமண். நெல் மற்றும் கோதுமை சாகுபடிக்கு நல்லது.'
    },
    'Loamy Soil': {
      en: 'Excellent balanced soil with good nutrients. Suitable for most crops.',
      ta: 'நல்ல சத்துக்களுடன் சமநிலையான மண். பெரும்பாலான பயிர்களுக்கு ஏற்றது.'
    },
    'Laterite Soil': {
      en: 'Weathered soil found in hilly regions. Good for plantation crops.',
      ta: 'மலைப்பகுதிகளில் காணப்படும் தேய்ந்த மண். தோட்டப் பயிர்களுக்கு நல்லது.'
    },
    'Alluvial Soil': {
      en: 'River deposited fertile soil. Very productive for agriculture.',
      ta: 'ஆற்றுப்படிவு வளமான மண். விவசாயத்திற்கு மிகவும் உற்பத்தித்திறன்.'
    },
    'Peaty Soil': {
      en: 'Organic rich acidic soil. Good with proper management for vegetables.',
      ta: 'கரிம நிறைந்த அமில மண். சரியான மேலாண்மையுடன் காய்கறிகளுக்கு நல்லது.'
    },
    'Saline Soil': {
      en: 'Salt affected soil. Needs treatment but can grow salt-tolerant crops.',
      ta: 'உப்பு பாதிக்கப்பட்ட மண். சிகிச்சை தேவை ஆனால் உப்பு தாங்கும் பயிர்களை வளர்க்கலாம்.'
    },
    'Mixed Soil': {
      en: 'Combination of different soil types. Versatile for various crops.',
      ta: 'பல்வேறு மண் வகைகளின் கலவை. பல்வேறு பயிர்களுக்கு பன்முகத்தன்மை.'
    },
  };
  
  return language === 'tamil' ? descriptions[soilType].ta : descriptions[soilType].en;
}

function getCropRecommendations(
  soilType: SoilType,
  season: string,
  landSize: number,
  language: string
): CropRecommendation[] {
  const cropDatabase: Record<string, Record<string, { en: CropRecommendation[]; ta: CropRecommendation[] }>> = {
    'Summer': {
      'Red Soil': {
        en: [
          { name: 'Groundnut', reason: 'Best suited for red soil in hot weather. Low water need.', expectedYield: 8, yieldUnit: 'quintals/acre', growingPeriod: '100-120 days' },
          { name: 'Sunflower', reason: 'Heat tolerant and grows well in red soil drainage.', expectedYield: 6, yieldUnit: 'quintals/acre', growingPeriod: '85-95 days' },
          { name: 'Sesame', reason: 'Drought resistant oilseed that thrives in summer heat.', expectedYield: 3, yieldUnit: 'quintals/acre', growingPeriod: '80-90 days' },
        ],
        ta: [
          { name: 'வேர்க்கடலை', reason: 'வெப்பமான காலநிலையில் சிவப்பு மண்ணுக்கு மிகவும் ஏற்றது. குறைந்த நீர் தேவை.', expectedYield: 8, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '100-120 நாட்கள்' },
          { name: 'சூரியகாந்தி', reason: 'வெப்பத்தை தாங்கக்கூடியது, சிவப்பு மண் வடிகாலில் நன்கு வளரும்.', expectedYield: 6, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '85-95 நாட்கள்' },
          { name: 'எள்', reason: 'கோடை வெப்பத்தில் செழிக்கும் வறட்சி தாங்கும் எண்ணெய் விதை.', expectedYield: 3, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '80-90 நாட்கள்' },
        ],
      },
      'Black Soil': {
        en: [
          { name: 'Cotton', reason: 'Black soil is ideal for cotton. High profit potential.', expectedYield: 10, yieldUnit: 'quintals/acre', growingPeriod: '150-180 days' },
          { name: 'Soybean', reason: 'Grows excellently in black soil with summer moisture.', expectedYield: 8, yieldUnit: 'quintals/acre', growingPeriod: '90-100 days' },
          { name: 'Sugarcane', reason: 'Long term crop but very profitable in black soil.', expectedYield: 350, yieldUnit: 'quintals/acre', growingPeriod: '12-18 months' },
        ],
        ta: [
          { name: 'பருத்தி', reason: 'கருப்பு மண் பருத்திக்கு சிறந்தது. அதிக லாப வாய்ப்பு.', expectedYield: 10, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '150-180 நாட்கள்' },
          { name: 'சோயாபீன்', reason: 'கோடை ஈரப்பதத்துடன் கருப்பு மண்ணில் சிறப்பாக வளரும்.', expectedYield: 8, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '90-100 நாட்கள்' },
          { name: 'கரும்பு', reason: 'நீண்டகால பயிர் ஆனால் கருப்பு மண்ணில் மிகவும் லாபகரமானது.', expectedYield: 350, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '12-18 மாதங்கள்' },
        ],
      },
    },
    'Monsoon': {
      'Red Soil': {
        en: [
          { name: 'Rice', reason: 'Monsoon rains provide enough water for paddy cultivation.', expectedYield: 20, yieldUnit: 'quintals/acre', growingPeriod: '120-150 days' },
          { name: 'Millets', reason: 'Nutritious grain that grows well with monsoon in red soil.', expectedYield: 10, yieldUnit: 'quintals/acre', growingPeriod: '70-90 days' },
          { name: 'Pulses', reason: 'Red gram and black gram thrive in monsoon red soil conditions.', expectedYield: 5, yieldUnit: 'quintals/acre', growingPeriod: '90-120 days' },
        ],
        ta: [
          { name: 'நெல்', reason: 'மழைக்கால மழை நெல் சாகுபடிக்கு போதுமான நீர் அளிக்கிறது.', expectedYield: 20, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '120-150 நாட்கள்' },
          { name: 'தினைகள்', reason: 'சிவப்பு மண்ணில் மழைக்காலத்தில் நன்கு வளரும் சத்தான தானியம்.', expectedYield: 10, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '70-90 நாட்கள்' },
          { name: 'பருப்பு வகைகள்', reason: 'துவரை மற்றும் உளுந்து மழைக்கால சிவப்பு மண் நிலைகளில் செழிக்கும்.', expectedYield: 5, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '90-120 நாட்கள்' },
        ],
      },
      'Black Soil': {
        en: [
          { name: 'Sorghum', reason: 'Hardy crop perfect for black soil during monsoon season.', expectedYield: 12, yieldUnit: 'quintals/acre', growingPeriod: '100-120 days' },
          { name: 'Maize', reason: 'High yielding corn variety suited for monsoon black soil.', expectedYield: 25, yieldUnit: 'quintals/acre', growingPeriod: '80-110 days' },
          { name: 'Pigeon Pea', reason: 'Excellent protein crop that fixes nitrogen in black soil.', expectedYield: 6, yieldUnit: 'quintals/acre', growingPeriod: '150-180 days' },
        ],
        ta: [
          { name: 'சோளம்', reason: 'மழைக்காலத்தில் கருப்பு மண்ணுக்கு ஏற்ற கடினமான பயிர்.', expectedYield: 12, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '100-120 நாட்கள்' },
          { name: 'மக்காச்சோளம்', reason: 'மழைக்கால கருப்பு மண்ணுக்கு ஏற்ற அதிக விளைச்சல் சோள வகை.', expectedYield: 25, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '80-110 நாட்கள்' },
          { name: 'துவரை', reason: 'கருப்பு மண்ணில் நைட்ரஜனை நிலைப்படுத்தும் சிறந்த புரத பயிர்.', expectedYield: 6, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '150-180 நாட்கள்' },
        ],
      },
    },
    'Winter': {
      'Red Soil': {
        en: [
          { name: 'Wheat', reason: 'Cool weather ideal for wheat growth in red soil regions.', expectedYield: 15, yieldUnit: 'quintals/acre', growingPeriod: '120-150 days' },
          { name: 'Chickpea', reason: 'Winter pulse crop that performs well in red soil.', expectedYield: 6, yieldUnit: 'quintals/acre', growingPeriod: '90-120 days' },
          { name: 'Mustard', reason: 'Oilseed that thrives in cool temperatures and red soil.', expectedYield: 5, yieldUnit: 'quintals/acre', growingPeriod: '100-130 days' },
        ],
        ta: [
          { name: 'கோதுமை', reason: 'சிவப்பு மண் பகுதிகளில் கோதுமை வளர்ச்சிக்கு குளிர் காலநிலை சிறந்தது.', expectedYield: 15, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '120-150 நாட்கள்' },
          { name: 'கொண்டைக்கடலை', reason: 'சிவப்பு மண்ணில் நன்கு செயல்படும் குளிர்கால பருப்பு பயிர்.', expectedYield: 6, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '90-120 நாட்கள்' },
          { name: 'கடுகு', reason: 'குளிர் வெப்பநிலை மற்றும் சிவப்பு மண்ணில் செழிக்கும் எண்ணெய் விதை.', expectedYield: 5, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '100-130 நாட்கள்' },
        ],
      },
      'Black Soil': {
        en: [
          { name: 'Safflower', reason: 'Oilseed crop perfect for winter cultivation in black soil.', expectedYield: 6, yieldUnit: 'quintals/acre', growingPeriod: '120-150 days' },
          { name: 'Lentil', reason: 'High protein pulse ideal for black soil winter cropping.', expectedYield: 5, yieldUnit: 'quintals/acre', growingPeriod: '100-120 days' },
          { name: 'Coriander', reason: 'Spice crop with good returns in winter black soil.', expectedYield: 4, yieldUnit: 'quintals/acre', growingPeriod: '90-120 days' },
        ],
        ta: [
          { name: 'குசும்பா', reason: 'கருப்பு மண்ணில் குளிர்கால சாகுபடிக்கு ஏற்ற எண்ணெய் விதை பயிர்.', expectedYield: 6, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '120-150 நாட்கள்' },
          { name: 'மசூர் பருப்பு', reason: 'கருப்பு மண் குளிர்கால பயிருக்கு ஏற்ற அதிக புரத பருப்பு.', expectedYield: 5, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '100-120 நாட்கள்' },
          { name: 'கொத்தமல்லி', reason: 'குளிர்கால கருப்பு மண்ணில் நல்ல வருமானத்துடன் மசாலா பயிர்.', expectedYield: 4, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '90-120 நாட்கள்' },
        ],
      },
    },
  };

  // Default crops for any soil/season combination not explicitly defined
  const defaultCrops = {
    en: [
      { name: 'Vegetables', reason: 'Diverse vegetable cultivation suitable for your conditions.', expectedYield: 80, yieldUnit: 'quintals/acre', growingPeriod: '60-90 days' },
      { name: 'Pulses', reason: 'Protein-rich legumes that improve soil health.', expectedYield: 5, yieldUnit: 'quintals/acre', growingPeriod: '90-120 days' },
      { name: 'Millets', reason: 'Climate resilient crops with good nutrition value.', expectedYield: 8, yieldUnit: 'quintals/acre', growingPeriod: '70-90 days' },
    ],
    ta: [
      { name: 'காய்கறிகள்', reason: 'உங்கள் நிலைமைகளுக்கு ஏற்ற பல்வேறு காய்கறி சாகுபடி.', expectedYield: 80, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '60-90 நாட்கள்' },
      { name: 'பருப்பு வகைகள்', reason: 'மண் ஆரோக்கியத்தை மேம்படுத்தும் புரதம் நிறைந்த பயறு வகைகள்.', expectedYield: 5, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '90-120 நாட்கள்' },
      { name: 'தினைகள்', reason: 'நல்ல ஊட்டச்சத்து மதிப்புடன் காலநிலை நெகிழ்வான பயிர்கள்.', expectedYield: 8, yieldUnit: 'குவிண்டால்/ஏக்கர்', growingPeriod: '70-90 நாட்கள்' },
    ],
  };

  const seasonKey = season.includes('Monsoon') ? 'Monsoon' : season.includes('Winter') ? 'Winter' : 'Summer';
  const soilKey = soilType.includes('Red') ? 'Red Soil' : soilType.includes('Black') ? 'Black Soil' : 'Red Soil';
  
  const crops = cropDatabase[seasonKey]?.[soilKey]?.[language === 'tamil' ? 'ta' : 'en'] 
    || defaultCrops[language === 'tamil' ? 'ta' : 'en'];

  return crops.map(crop => ({
    ...crop,
    expectedYield: Math.round(crop.expectedYield * landSize * 10) / 10,
  }));
}

function getMarketPrices(crops: CropRecommendation[]): MarketPrice[] {
  const priceData: Record<string, { basePrice: number; unit: string }> = {
    'Groundnut': { basePrice: 5200, unit: 'quintal' },
    'Sunflower': { basePrice: 4800, unit: 'quintal' },
    'Sesame': { basePrice: 12000, unit: 'quintal' },
    'Cotton': { basePrice: 6500, unit: 'quintal' },
    'Soybean': { basePrice: 4500, unit: 'quintal' },
    'Sugarcane': { basePrice: 350, unit: 'quintal' },
    'Rice': { basePrice: 2200, unit: 'quintal' },
    'Millets': { basePrice: 3500, unit: 'quintal' },
    'Pulses': { basePrice: 7500, unit: 'quintal' },
    'Sorghum': { basePrice: 2800, unit: 'quintal' },
    'Maize': { basePrice: 2100, unit: 'quintal' },
    'Pigeon Pea': { basePrice: 7200, unit: 'quintal' },
    'Wheat': { basePrice: 2400, unit: 'quintal' },
    'Chickpea': { basePrice: 5800, unit: 'quintal' },
    'Mustard': { basePrice: 5500, unit: 'quintal' },
    'Safflower': { basePrice: 5600, unit: 'quintal' },
    'Lentil': { basePrice: 6200, unit: 'quintal' },
    'Coriander': { basePrice: 8500, unit: 'quintal' },
    'Vegetables': { basePrice: 1500, unit: 'quintal' },
  };

  const trends: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];
  
  return crops.map((crop, idx) => {
    const baseInfo = priceData[crop.name] || { basePrice: 3000, unit: 'quintal' };
    const trend = trends[idx % 3];
    const change = trend === 'up' ? Math.round(Math.random() * 8 + 2) : 
                   trend === 'down' ? -Math.round(Math.random() * 8 + 2) : 
                   Math.round(Math.random() * 2 - 1);
    
    return {
      crop: crop.name,
      currentPrice: baseInfo.basePrice + Math.round(Math.random() * 500 - 250),
      unit: baseInfo.unit,
      trend,
      change,
    };
  });
}

function calculateProfit(crops: CropRecommendation[], prices: MarketPrice[]): number {
  let totalProfit = 0;
  
  crops.forEach((crop, idx) => {
    const price = prices[idx];
    if (price) {
      const revenue = crop.expectedYield * price.currentPrice;
      const cost = revenue * 0.4; // Assume 40% production cost
      totalProfit += revenue - cost;
    }
  });
  
  return Math.round(totalProfit / crops.length);
}

function getFutureCrop(soilType: SoilType, currentSeason: string, language: string): { name: string; reason: string } {
  const futureSeasons: Record<string, string> = {
    'Summer': 'Monsoon',
    'Winter': 'Summer',
    'Monsoon': 'Winter',
    'Pre-Monsoon': 'Monsoon',
    'Post-Monsoon': 'Winter',
  };
  
  const nextSeason = futureSeasons[currentSeason] || 'Monsoon';
  
  const suggestions: Record<string, { en: { name: string; reason: string }; ta: { name: string; reason: string } }> = {
    'Monsoon': {
      en: { name: 'Green Manure Crops', reason: `Plant green manure before ${nextSeason} to add nutrients to your ${soilType.toLowerCase()}.` },
      ta: { name: 'பசுந்தாள் உரம்', reason: `உங்கள் ${soilType} மண்ணில் சத்துக்களைச் சேர்க்க ${nextSeason} முன் பசுந்தாள் உரம் நடுங்கள்.` },
    },
    'Winter': {
      en: { name: 'Legume Cover Crops', reason: `Grow legumes to fix nitrogen naturally before ${nextSeason} planting.` },
      ta: { name: 'பயறு வகை மூடி பயிர்கள்', reason: `${nextSeason} நடவுக்கு முன் நைட்ரஜனை இயற்கையாக நிலைப்படுத்த பயறு வகைகளை வளர்க்கவும்.` },
    },
    'Summer': {
      en: { name: 'Short Duration Vegetables', reason: `Quick harvest vegetables before ${nextSeason} for extra income.` },
      ta: { name: 'குறுகிய கால காய்கறிகள்', reason: `கூடுதல் வருமானத்திற்காக ${nextSeason} முன் விரைவான அறுவடை காய்கறிகள்.` },
    },
  };
  
  return suggestions[nextSeason]?.[language === 'tamil' ? 'ta' : 'en'] || suggestions['Monsoon'][language === 'tamil' ? 'ta' : 'en'];
}

function getSoilTip(soilType: SoilType, language: string): string {
  const tips: Record<SoilType, { en: string; ta: string }> = {
    'Red Soil': {
      en: 'Add organic compost to increase water holding capacity. Use mulching to prevent soil erosion.',
      ta: 'நீர் தக்க வைக்கும் திறனை அதிகரிக்க கரிம உரம் சேர்க்கவும். மண் அரிப்பைத் தடுக்க தழை மூடி பயன்படுத்துங்கள்.',
    },
    'Black Soil': {
      en: 'Avoid water logging by improving drainage. Add gypsum if soil becomes too sticky.',
      ta: 'வடிகால் மேம்படுத்தி நீர் தேக்கத்தைத் தவிர்க்கவும். மண் மிகவும் ஒட்டும் தன்மையானால் ஜிப்சம் சேர்க்கவும்.',
    },
    'Sandy Soil': {
      en: 'Mix organic matter to improve nutrient retention. Water frequently but in small amounts.',
      ta: 'சத்து தக்க வைப்பை மேம்படுத்த கரிமப் பொருட்களைக் கலக்கவும். அடிக்கடி ஆனால் சிறிய அளவில் நீர் ஊற்றுங்கள்.',
    },
    'Clay Soil': {
      en: 'Add sand and organic matter to improve aeration. Avoid working when wet.',
      ta: 'காற்றோட்டத்தை மேம்படுத்த மணல் மற்றும் கரிமப் பொருட்களைச் சேர்க்கவும். ஈரமாக இருக்கும்போது வேலை செய்வதைத் தவிர்க்கவும்.',
    },
    'Loamy Soil': {
      en: 'Maintain organic matter levels with regular composting. Practice crop rotation.',
      ta: 'வழக்கமான உரமிடுதலுடன் கரிம பொருள் அளவை பராமரிக்கவும். பயிர் சுழற்சி கடைப்பிடிக்கவும்.',
    },
    'Laterite Soil': {
      en: 'Apply lime to reduce acidity. Add plenty of organic manure before planting.',
      ta: 'அமிலத்தன்மையைக் குறைக்க சுண்ணாம்பு இடுங்கள். நடவு செய்வதற்கு முன் நிறைய கரிம உரம் சேர்க்கவும்.',
    },
    'Alluvial Soil': {
      en: 'Prevent nutrient leaching with cover crops. Monitor for flooding during monsoon.',
      ta: 'மூடி பயிர்களுடன் சத்து கசிவைத் தடுக்கவும். மழைக்காலத்தில் வெள்ளத்தைக் கண்காணிக்கவும்.',
    },
    'Peaty Soil': {
      en: 'Add lime to balance pH. Ensure good drainage to prevent waterlogging.',
      ta: 'pH சமநிலைக்கு சுண்ணாம்பு சேர்க்கவும். நீர் தேக்கத்தைத் தடுக்க நல்ல வடிகால் உறுதி செய்யுங்கள்.',
    },
    'Saline Soil': {
      en: 'Use gypsum treatment and proper drainage. Grow salt-tolerant varieties initially.',
      ta: 'ஜிப்சம் சிகிச்சை மற்றும் சரியான வடிகால் பயன்படுத்துங்கள். ஆரம்பத்தில் உப்பு தாங்கும் வகைகளை வளர்க்கவும்.',
    },
    'Mixed Soil': {
      en: 'Test soil regularly and amend based on specific needs. Use balanced fertilization.',
      ta: 'மண்ணை தொடர்ந்து சோதித்து குறிப்பிட்ட தேவைகளின் அடிப்படையில் திருத்தவும். சமநிலையான உரமிடுதல் பயன்படுத்துங்கள்.',
    },
  };
  
  return tips[soilType]?.[language === 'tamil' ? 'ta' : 'en'] || tips['Mixed Soil'][language === 'tamil' ? 'ta' : 'en'];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { soilImage, location, season, landSize, language } = body;

    // Input validation
    const validSeasons = ['Summer', 'Winter', 'Monsoon', 'Pre-Monsoon', 'Post-Monsoon'];
    const validLanguages = ['english', 'tamil'];

    if (!soilImage || typeof soilImage !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Soil image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (typeof landSize !== 'number' || landSize <= 0 || landSize > 10000) {
      return new Response(
        JSON.stringify({ error: 'Land size must be between 0.1 and 10000 acres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validSeasons.includes(season)) {
      return new Response(
        JSON.stringify({ error: 'Invalid season selected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validLanguages.includes(language)) {
      return new Response(
        JSON.stringify({ error: 'Invalid language selected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analysis request received:', { 
      hasImage: !!soilImage, 
      location: location?.district, 
      season, 
      landSize, 
      language 
    });

    // Classify soil
    const soilType = classifySoil(!!soilImage, location?.state || '', location?.district || '');
    const soilDescription = getSoilDescription(soilType, language);

    // Get crop recommendations
    const recommendations = getCropRecommendations(soilType, season, landSize, language);

    // Calculate total yield
    const totalYield = recommendations.reduce((sum, crop) => sum + crop.expectedYield, 0);

    // Get market prices
    const marketPrices = getMarketPrices(recommendations);

    // Calculate profit
    const estimatedProfit = calculateProfit(recommendations, marketPrices);

    // Get future crop suggestion
    const futureCrop = getFutureCrop(soilType, season, language);

    // Get soil improvement tip
    const soilTip = getSoilTip(soilType, language);

    const result = {
      soilType,
      soilDescription,
      recommendations,
      totalYield: Math.round(totalYield * 10) / 10,
      estimatedProfit,
      marketPrices,
      futureCrop,
      soilTip,
    };

    console.log('Analysis complete:', { soilType, cropCount: recommendations.length });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze soil data' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
