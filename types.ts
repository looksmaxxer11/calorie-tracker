export interface FoodItem {
  name: string;
  portionSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: string;
}

export interface NutritionSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  healthScore: number; // 1-10
  advice: string;
}

export interface AnalysisResult {
  items: FoodItem[];
  summary: NutritionSummary;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}