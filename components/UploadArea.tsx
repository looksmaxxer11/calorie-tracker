import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface UploadAreaProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  isAnalyzing: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onImageSelected, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      
      // Extract base64 data and mime type
      const matches = result.match(/^data:(.+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        onImageSelected(matches[2], matches[1]);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`relative group cursor-pointer transition-all duration-300 ease-in-out
          ${preview ? 'h-96 border-none shadow-2xl' : 'h-80 border-2 border-dashed'}
          ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'}
          rounded-3xl overflow-hidden flex flex-col items-center justify-center
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          onChange={handleChange}
          accept="image/*"
          disabled={isAnalyzing}
        />

        {preview ? (
          <>
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover" 
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                <p className="text-white font-medium text-lg animate-pulse">Analyzing nutritional content...</p>
                <p className="text-white/60 text-sm mt-2">Identifying ingredients & portion sizes</p>
              </div>
            )}
            {!isAnalyzing && (
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                 <div className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                   Change Photo
                 </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-6 space-y-4">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-colors ${dragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-500'}`}>
              <Upload className="w-10 h-10" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">
                {dragActive ? "Drop it like it's hot!" : "Click or drop food image here"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports JPG, PNG, WEBP
              </p>
            </div>
          </div>
        )}
      </div>

      {!preview && (
        <div className="mt-8 grid grid-cols-3 gap-4">
           {/* Demo thumbnails could go here to help user test quickly, skipping for MVP strictness */}
        </div>
      )}
    </div>
  );
};

export default UploadArea;