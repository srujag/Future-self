export interface UserProfile {
  id: string;
  name: string;
  dob: string; // YYYY-MM-DD
  age: number;
  gender: 'female' | 'male';
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  profileImage: string; // Data URL or asset
  faceImage?: string;
  uploadedPhoto?: string;
  aiGeneratedAspirations?: FutureSelfAspiration[];
  bmr: number;
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal Weight' | 'Overweight' | 'Obese';
  dailyCalorieTarget: number;
  dailyWaterTargetMl: number;
  onboardingCompleted: boolean;
  activeAspirationId: string;
  createdDate: string;
}

export interface FutureSelfAspiration {
  id: string;
  category: 'dress' | 'picture' | 'activity' | 'ai-generated';
  title: string;
  tagline: string;
  imageUrl: string;
  badge: string;
  description: string;
  isAiGenerated?: boolean;
  sourceImage?: string;
  targetWeightKg?: number;
  generatedAt?: string;
  styleKey?: string;
}

export interface FoodItemReference {
  id: string;
  name: string;
  prep: string;
  servingUnit: string;
  servingWeightG: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  category: 'staple' | 'protein' | 'dairy' | 'vegetable' | 'fruit' | 'breakfast' | 'supplement';
  defaultPortionG?: number;
}

export interface FoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  foodItemId: string;
  foodName: string;
  quantityG: number;
  servingLabel?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
}

export interface WaterEntry {
  id: string;
  date: string; // YYYY-MM-DD
  amountMl: number;
  timestamp: string;
}

export interface ActivityReference {
  type: string;
  displayName: string;
  icon: string;
  burnRatePer60Min50Kg: number;
  burnRatePer60Min60Kg: number;
  burnRatePer60Min70Kg: number;
  burnRatePer60Min80Kg: number;
  burnRatePer60Min90Kg: number;
}

export interface ActivityEntry {
  id: string;
  date: string; // YYYY-MM-DD
  activityType: string;
  activityName: string;
  durationMinutes: number;
  calculatedCalories: number;
  userEditedCalories: number;
  timestamp: string;
}

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  note?: string;
  timestamp: string;
}

export interface DailySummaryData {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  bmr: number;
  calorieDeficit: number; // BMR + Burned - Consumed
  deficitStatus: 'On track' | 'Needs to cut down';
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  waterTotalMl: number;
  waterTargetMl: number;
  waterPercent: number;
  nutritionLogged: boolean;
  waterLogged: boolean;
  activityLogged: boolean;
  futureSelfFeedback: {
    greeting: string;
    coachStatus: string;
    whatWentWell: string[];
    whatWasMissing: string[];
    improvementTip: string;
    cultMotivation: string;
  };
}
