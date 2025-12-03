import React from 'react';
import { AnalysisResult } from '../types';
import MacroChart from './MacroChart';
import { Award, Info, Zap } from 'lucide-react';

interface NutritionCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ result, onReset }) => {
  const { summary, items } = result;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Summary Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap size={120} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Analysis Complete</h2>
            <div className="flex items-center space-x-2 text-gray-600 mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${summary.healthScore >= 7 ? 'bg-green-100 text-green-700' : summary.healthScore >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                Health Score: {summary.healthScore}/10
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-gray-50 p-4 rounded-xl">
                 <p className="text-sm text-gray-500">Total Calories</p>
                 <p className="text-3xl font-bold text-gray-900">{summary.totalCalories}</p>
                 <p className="text-xs text-gray-400">kcal</p>
               </div>
               <div className="bg-blue-50 p-4 rounded-xl">
                 <p className="text-sm text-blue-600">Total Protein</p>
                 <p className="text-2xl font-bold text-blue-900">{summary.totalProtein}g</p>
               </div>
            </div>
            
            <p className="mt-4 text-sm text-gray-600 italic border-l-4 border-indigo-500 pl-3">
              "{summary.advice}"
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-4">
             <h3 className="text-sm font-semibold text-gray-500 mb-2">Macro Distribution</h3>
             <MacroChart 
               protein={summary.totalProtein} 
               carbs={summary.totalCarbs} 
               fat={summary.totalFat} 
             />
          </div>
        </div>
      </div>

      {/* Breakdown List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            Item Breakdown
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {items.map((item, idx) => (
            <div key={idx} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{item.portionSize}</span>
                </div>
                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                  <span className="text-blue-600 font-medium">P: {item.protein}g</span>
                  <span className="text-emerald-600 font-medium">C: {item.carbs}g</span>
                  <span className="text-amber-600 font-medium">F: {item.fat}g</span>
                </div>
              </div>
              <div className="text-right flex flex-col items-end min-w-[80px]">
                <span className="font-bold text-gray-900">{item.calories}</span>
                <span className="text-xs text-gray-400">kcal</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-4 pb-12">
        <button 
          onClick={onReset}
          className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          Scan Another Meal
        </button>
      </div>

    </div>
  );
};

export default NutritionCard;