import React, { useState } from 'react';
import { AppState, AnalysisResult } from './types';
import { analyzeFoodImage } from './services/geminiService';
import UploadArea from './components/UploadArea';
import NutritionCard from './components/NutritionCard';
import { Utensils, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = async (base64: string, mimeType: string) => {
    setState(AppState.ANALYZING);
    setError(null);

    try {
      const data = await analyzeFoodImage(base64, mimeType);
      setResult(data);
      setState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze image. Please try again.");
      setState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setState(AppState.IDLE);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-gray-900 font-sans">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Utensils className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              NutriScan AI
            </h1>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Realistic Calorie Tracker
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {state === AppState.IDLE && (
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              What's on your plate?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload a photo of your meal. Our AI will analyze the portion sizes, ingredients, and cooking methods to give you a realistic calorie count.
            </p>
          </div>
        )}

        {state === AppState.ERROR && (
          <div className="max-w-xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900">Analysis Failed</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button 
                onClick={resetApp}
                className="mt-2 text-xs font-semibold text-red-700 hover:text-red-900 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center">
          {state !== AppState.SUCCESS && (
            <UploadArea 
              onImageSelected={handleImageSelected} 
              isAnalyzing={state === AppState.ANALYZING} 
            />
          )}

          {state === AppState.SUCCESS && result && (
            <NutritionCard result={result} onReset={resetApp} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} NutriScan AI. Estimates are for informational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;