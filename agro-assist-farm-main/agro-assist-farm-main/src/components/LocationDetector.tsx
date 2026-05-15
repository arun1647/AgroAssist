import { useState } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { LocationData } from '@/types/analysis';

interface LocationDetectorProps {
  location: LocationData | null;
  onLocationChange: (location: LocationData | null) => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export function LocationDetector({ location, onLocationChange }: LocationDetectorProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualState, setManualState] = useState('');
  const [manualDistrict, setManualDistrict] = useState('');

  const detectLocation = async () => {
    setIsDetecting(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('GPS not available. Please enter location manually.');
      setManualMode(true);
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          
          const state = data.address?.state || 'Unknown State';
          const district = data.address?.county || data.address?.city || data.address?.town || 'Unknown District';
          
          onLocationChange({
            latitude,
            longitude,
            state,
            district
          });
        } catch {
          onLocationChange({
            latitude,
            longitude,
            state: 'Location Detected',
            district: 'District Unknown'
          });
        }
        setIsDetecting(false);
      },
      (err) => {
        setError('Could not detect location. Please enter manually.');
        setManualMode(true);
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleManualSubmit = () => {
    if (manualState && manualDistrict) {
      onLocationChange({
        latitude: 0,
        longitude: 0,
        state: manualState,
        district: manualDistrict
      });
      setError(null);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold text-foreground">
        <MapPin className="inline-block w-5 h-5 mr-2 text-primary" />
        Your Location
      </label>

      {!location && !manualMode && (
        <div className="space-y-3">
          <Button
            type="button"
            onClick={detectLocation}
            disabled={isDetecting}
            className="w-full py-6 text-lg gap-2"
          >
            {isDetecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Detecting Location...
              </>
            ) : (
              <>
                <MapPin className="w-5 h-5" />
                Detect My Location
              </>
            )}
          </Button>
          
          <button
            type="button"
            onClick={() => setManualMode(true)}
            className="w-full text-center text-muted-foreground hover:text-primary transition-colors py-2"
          >
            Or enter location manually
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {manualMode && !location && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-xl">
          <div>
            <label className="block text-sm font-medium mb-2">State</label>
            <select
              value={manualState}
              onChange={(e) => setManualState(e.target.value)}
              className="farmer-input"
            >
              <option value="">Select your state</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">District</label>
            <Input
              type="text"
              value={manualDistrict}
              onChange={(e) => setManualDistrict(e.target.value)}
              placeholder="Enter your district"
              className="farmer-input"
            />
          </div>
          
          <Button
            type="button"
            onClick={handleManualSubmit}
            disabled={!manualState || !manualDistrict}
            className="w-full py-4"
          >
            Confirm Location
          </Button>
        </div>
      )}

      {location && (
        <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{location.district}</p>
              <p className="text-muted-foreground">{location.state}</p>
              {location.latitude !== 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  GPS: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                onLocationChange(null);
                setManualMode(false);
                setManualState('');
                setManualDistrict('');
              }}
              className="text-sm text-primary hover:underline"
            >
              Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
