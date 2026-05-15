import { useState, useRef } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';

interface ImageUploadProps {
  onImageSelect: (base64: string | null) => void;
  selectedImage: string | null;
}

export function ImageUpload({ onImageSelect, selectedImage }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    onImageSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold text-foreground">
        <ImageIcon className="inline-block w-5 h-5 mr-2 text-primary" />
        Upload Soil Photo
      </label>
      
      {selectedImage ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 shadow-card">
          <img 
            src={selectedImage} 
            alt="Soil sample" 
            className="w-full h-64 object-cover"
          />
          <button
            onClick={clearImage}
            className="absolute top-3 right-3 p-2 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:bg-destructive/90 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-white font-medium">Soil photo ready for analysis</p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-2xl p-8 bg-muted/30 hover:bg-muted/50 transition-colors">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground text-center">
              Take a photo of your soil or upload from gallery
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
                id="camera-input"
              />
              <label htmlFor="camera-input">
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  className="cursor-pointer gap-2 text-base px-6 py-6"
                  asChild
                >
                  <span>
                    <Camera className="w-5 h-5" />
                    Take Photo
                  </span>
                </Button>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="cursor-pointer gap-2 text-base px-6 py-6"
                  asChild
                >
                  <span>
                    <Upload className="w-5 h-5" />
                    Upload File
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
