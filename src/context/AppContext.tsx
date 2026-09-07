import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserProfile,
  FoodEntry,
  WaterEntry,
  ActivityEntry,
  WeightEntry,
  DailySummaryData,
  FutureSelfAspiration
} from '../types';
import {
  PRD_FOOD_ITEMS,
  FUTURE_SELF_ASPIRATIONS,
  calculateAge,
  calculateBmr,
  calculateBmi,
  calculateTargetWeight,
  calculateDailyCalorieTarget
} from '../data/referenceData';

interface AppContextType {
  userProfile: UserProfile;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  foodEntries: FoodEntry[];
  waterEntries: WaterEntry[];
  activityEntries: ActivityEntry[];
  weightEntries: WeightEntry[];
  activeTab: 'dashboard' | 'log-food' | 'log-water' | 'log-activity' | 'future-self' | 'progress' | 'credits' | 'profile';
  setActiveTab: (tab: any) => void;
  activeAspiration: FutureSelfAspiration;
  setActiveAspirationId: (id: string) => void;
  allAspirations: FutureSelfAspiration[];
  saveAiGeneratedAspiration: (aspiration: FutureSelfAspiration) => void;
  // Actions
  updateProfile: (profile: Partial<UserProfile>) => void;
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => void;
  editFoodEntry: (id: string, updated: Partial<FoodEntry>) => void;
  deleteFoodEntry: (id: string) => void;
  addWaterEntry: (amountMl: number, date?: string) => void;
  deleteWaterEntry: (id: string) => void;
  addActivityEntry: (entry: Omit<ActivityEntry, 'id' | 'timestamp'>) => void;
  editActivityEntry: (id: string, updated: Partial<ActivityEntry>) => void;
  deleteActivityEntry: (id: string) => void;
  logWeight: (weightKg: number, date?: string, note?: string) => void;
  getDailyCalculations: (date: string) => DailySummaryData;
  resetAllData: () => void;
  seedRealisticData: () => void;
  aiCoachLoading: boolean;
  aiCoachData: any | null;
  refreshAiCoach: () => Promise<void>;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-athlete-01',
  name: '',
  dob: '1998-05-14',
  age: 28,
  gender: 'female',
  heightCm: 165,
  currentWeightKg: 65,
  targetWeightKg: 55,
  profileImage: '',
  uploadedPhoto: '',
  bmr: 1400,
  bmi: 23.9,
  bmiCategory: 'Normal Weight',
  dailyCalorieTarget: 1450,
  dailyWaterTargetMl: 3000,
  onboardingCompleted: false,
  activeAspirationId: 'activewear-cult',
  createdDate: new Date().toISOString().split('T')[0],
  aiGeneratedAspirations: []
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'cult_user_profile_v4',
  FOOD: 'cult_food_entries_v4',
  WATER: 'cult_water_entries_v4',
  ACTIVITY: 'cult_activity_entries_v4',
  WEIGHT: 'cult_weight_entries_v4',
  DATE: 'cult_selected_date_v4'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [activeTab, setActiveTab] = useState<AppContextType['activeTab']>('dashboard');
  const [aiCoachLoading, setAiCoachLoading] = useState<boolean>(false);
  const [aiCoachData, setAiCoachData] = useState<any | null>(null);

  // Persistent User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PROFILE;
  });

  // Onboarding should open automatically if onboarding has not been completed
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        return !parsed.onboardingCompleted;
      }
    } catch (e) {
      console.error(e);
    }
    return true;
  });

  // Food Entries (starts empty - no dummy data)
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOOD);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Water Entries (starts empty - no dummy data)
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Activity Entries (starts empty - no dummy data)
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Weight Entries (starts empty - no dummy data)
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEIGHT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOOD, JSON.stringify(foodEntries));
    } catch (e) {
      console.error(e);
    }
  }, [foodEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WATER, JSON.stringify(waterEntries));
    } catch (e) {
      console.error(e);
    }
  }, [waterEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activityEntries));
    } catch (e) {
      console.error(e);
    }
  }, [activityEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WEIGHT, JSON.stringify(weightEntries));
    } catch (e) {
      console.error(e);
    }
  }, [weightEntries]);

  const allAspirations = useMemo(() => {
    const aiList = userProfile.aiGeneratedAspirations || [];
    return [...aiList, ...FUTURE_SELF_ASPIRATIONS];
  }, [userProfile.aiGeneratedAspirations]);

  const activeAspiration = useMemo(() => {
    return (
      allAspirations.find(a => a.id === userProfile.activeAspirationId) ||
      allAspirations[0]
    );
  }, [allAspirations, userProfile.activeAspirationId]);

  const setActiveAspirationId = (id: string) => {
    setUserProfile(prev => ({ ...prev, activeAspirationId: id }));
  };

  const saveAiGeneratedAspiration = (aspiration: FutureSelfAspiration) => {
    setUserProfile(prev => {
      const existing = prev.aiGeneratedAspirations || [];
      const filtered = existing.filter(a => a.id !== aspiration.id);
      return {
        ...prev,
        aiGeneratedAspirations: [aspiration, ...filtered],
        activeAspirationId: aspiration.id
      };
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const merged = { ...prev, ...updates };
      const age = calculateAge(merged.dob);
      const bmr = calculateBmr(merged.currentWeightKg, merged.heightCm, age, merged.gender);
      const { bmi, category } = calculateBmi(merged.currentWeightKg, merged.heightCm);
      const targetWeightKg = updates.targetWeightKg || calculateTargetWeight(merged.heightCm);
      const dailyCalorieTarget = calculateDailyCalorieTarget(bmr);
      return {
        ...merged,
        age,
        bmr,
        bmi,
        bmiCategory: category,
        targetWeightKg,
        dailyCalorieTarget
      };
    });
  };

  const addFoodEntry = (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: `food-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setFoodEntries(prev => [newEntry, ...prev]);
  };

  const editFoodEntry = (id: string, updated: Partial<FoodEntry>) => {
    setFoodEntries(prev => prev.map(f => (f.id === id ? { ...f, ...updated } : f)));
  };

  const deleteFoodEntry = (id: string) => {
    setFoodEntries(prev => prev.filter(f => f.id !== id));
  };

  const addWaterEntry = (amountMl: number, date = selectedDate) => {
    const newEntry: WaterEntry = {
      id: `water-${Date.now()}`,
      date,
      amountMl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setWaterEntries(prev => [newEntry, ...prev]);
  };

  const deleteWaterEntry = (id: string) => {
    setWaterEntries(prev => prev.filter(w => w.id !== id));
  };

  const addActivityEntry = (entry: Omit<ActivityEntry, 'id' | 'timestamp'>) => {
    const newEntry: ActivityEntry = {
      ...entry,
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setActivityEntries(prev => [newEntry, ...prev]);
  };

  const editActivityEntry = (id: string, updated: Partial<ActivityEntry>) => {
    setActivityEntries(prev => prev.map(a => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteActivityEntry = (id: string) => {
    setActivityEntries(prev => prev.filter(a => a.id !== id));
  };

  const logWeight = (weightKg: number, date = selectedDate, note?: string) => {
    const newEntry: WeightEntry = {
      id: `wt-${Date.now()}`,
      date,
      weightKg,
      note,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setWeightEntries(prev => [newEntry, ...prev]);
    // Also update current weight on profile
    updateProfile({ currentWeightKg: weightKg });
  };

  // PRD Core Calculation Engine
  const getDailyCalculations = (date: string): DailySummaryData => {
    const dayFoods = foodEntries.filter(f => f.date === date);
    const dayWaters = waterEntries.filter(w => w.date === date);
    const dayActivities = activityEntries.filter(a => a.date === date);

    const caloriesConsumed = Math.round(dayFoods.reduce((acc, curr) => acc + (curr.calories || 0), 0));
    const protein = Math.round(dayFoods.reduce((acc, curr) => acc + (curr.protein || 0), 0) * 10) / 10;
    const carbs = Math.round(dayFoods.reduce((acc, curr) => acc + (curr.carbs || 0), 0) * 10) / 10;
    const fat = Math.round(dayFoods.reduce((acc, curr) => acc + (curr.fat || 0), 0) * 10) / 10;
    const fiber = Math.round(dayFoods.reduce((acc, curr) => acc + (curr.fiber || 0), 0) * 10) / 10;

    const caloriesBurned = Math.round(
      dayActivities.reduce((acc, curr) => acc + (curr.userEditedCalories ?? curr.calculatedCalories ?? 0), 0)
    );

    const waterTotalMl = dayWaters.reduce((acc, curr) => acc + curr.amountMl, 0);
    const waterTargetMl = userProfile.dailyWaterTargetMl || 3000;
    const waterPercent = Math.min(100, Math.round((waterTotalMl / waterTargetMl) * 100));

    // PRD Section 15: Calorie Deficit = BMR (A) + Activity (B) - Consumed (C)
    const bmr = userProfile.bmr;
    const calorieDeficit = bmr + caloriesBurned - caloriesConsumed;
    const deficitStatus: 'On track' | 'Needs to cut down' = calorieDeficit > 0 ? 'On track' : 'Needs to cut down';

    const nutritionLogged = dayFoods.length > 0;
    const waterLogged = dayWaters.length > 0;
    const activityLogged = dayActivities.length > 0;

    // Future Self Feedback Engine (PRD Section 20)
    const whatWentWell: string[] = [];
    const whatWasMissing: string[] = [];
    let greeting = `Hey ${userProfile.name}, this is your Future Self.`;
    let coachStatus = deficitStatus === 'On track' ? 'WINNING THE DAY' : 'RECOVERY MODE';
    let improvementTip = 'Start your morning with 500ml water and 20g clean protein.';
    let cultMotivation = 'Discipline beats motivation every single time.';

    if (deficitStatus === 'On track') {
      whatWentWell.push(`Maintained a net deficit of +${calorieDeficit} kcal.`);
      cultMotivation = `You took another undeniable stride towards ${userProfile.targetWeightKg} kg. Keep this energy locked in!`;
    } else {
      whatWasMissing.push(`Calorie surplus of ${Math.abs(calorieDeficit)} kcal. Keep food portions checked tomorrow.`);
      cultMotivation = `One off day never breaks the journey. Reset your mind, own your next meal, and crush tomorrow's workout.`;
    }

    if (waterTotalMl >= waterTargetMl) {
      whatWentWell.push(`Met the 3L Cult hydration standard (${(waterTotalMl / 1000).toFixed(1)}L).`);
    } else {
      whatWasMissing.push(`Water target missed by ${Math.max(0, waterTargetMl - waterTotalMl)} ml.`);
      improvementTip = 'Keep a 1-litre water bottle right at your desk and finish 3 bottles through the day.';
    }

    if (protein >= 75) {
      whatWentWell.push(`Solid protein intake (${protein}g) to support lean muscle preservation.`);
    } else if (nutritionLogged) {
      whatWasMissing.push(`Protein was ${protein}g. Aim for 75g-90g for faster metabolism.`);
    }

    if (activityLogged) {
      whatWentWell.push(`Burned ${caloriesBurned} kcal through ${dayActivities.map(a => a.activityName.split(' ')[0]).join(', ')}.`);
    } else {
      whatWasMissing.push(`No active workout logged today.`);
    }

    return {
      date,
      caloriesConsumed,
      caloriesBurned,
      bmr,
      calorieDeficit,
      deficitStatus,
      protein,
      carbs,
      fat,
      fiber,
      waterTotalMl,
      waterTargetMl,
      waterPercent,
      nutritionLogged,
      waterLogged,
      activityLogged,
      futureSelfFeedback: {
        greeting,
        coachStatus,
        whatWentWell: whatWentWell.length ? whatWentWell : ['Ready to log your meals and moves today.'],
        whatWasMissing: whatWasMissing.length ? whatWasMissing : ['No major gaps recorded.'],
        improvementTip,
        cultMotivation
      }
    };
  };

  // AI Coach API caller
  const refreshAiCoach = async () => {
    setAiCoachLoading(true);
    const dayData = getDailyCalculations(selectedDate);
    const dayActivities = activityEntries.filter(a => a.date === selectedDate).map(a => a.activityName);

    try {
      const res = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userProfile.name,
          currentWeight: userProfile.currentWeightKg,
          targetWeight: userProfile.targetWeightKg,
          date: selectedDate,
          caloriesConsumed: dayData.caloriesConsumed,
          bmr: dayData.bmr,
          caloriesBurned: dayData.caloriesBurned,
          calorieDeficit: dayData.calorieDeficit,
          waterTotalMl: dayData.waterTotalMl,
          waterTargetMl: dayData.waterTargetMl,
          protein: dayData.protein,
          carbs: dayData.carbs,
          fat: dayData.fat,
          activities: dayActivities
        })
      });
      if (res.ok) {
        const json = await res.json();
        setAiCoachData(json);
      }
    } catch (e) {
      console.error('Error fetching AI coach:', e);
    } finally {
      setAiCoachLoading(false);
    }
  };

  const resetAllData = () => {
    localStorage.clear();
    setUserProfile(DEFAULT_PROFILE);
    setFoodEntries([]);
    setWaterEntries([]);
    setActivityEntries([]);
    setWeightEntries([]);
    setAiCoachData(null);
    setShowOnboarding(true);
  };

  const seedRealisticData = () => {
    setUserProfile(DEFAULT_PROFILE);
    setFoodEntries(getInitialFoodEntries(todayStr));
    setWaterEntries([
      { id: 'w-1', date: todayStr, amountMl: 500, timestamp: '08:15' },
      { id: 'w-2', date: todayStr, amountMl: 750, timestamp: '11:30' },
      { id: 'w-3', date: todayStr, amountMl: 500, timestamp: '14:20' },
      { id: 'w-4', date: todayStr, amountMl: 500, timestamp: '17:00' }
    ]);
    setActivityEntries([
      {
        id: 'act-1',
        date: todayStr,
        activityType: 'walking',
        activityName: 'Walking (Brisk, ~5 km/h)',
        durationMinutes: 45,
        calculatedCalories: 178,
        userEditedCalories: 190,
        timestamp: '07:30'
      },
      {
        id: 'act-2',
        date: todayStr,
        activityType: 'badminton',
        activityName: 'Badminton (Competitive / Casual mix)',
        durationMinutes: 30,
        calculatedCalories: 153,
        userEditedCalories: 160,
        timestamp: '18:45'
      }
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        selectedDate,
        setSelectedDate,
        foodEntries,
        waterEntries,
        activityEntries,
        weightEntries,
        activeTab,
        setActiveTab,
        activeAspiration,
        setActiveAspirationId,
        allAspirations,
        saveAiGeneratedAspiration,
        updateProfile,
        addFoodEntry,
        editFoodEntry,
        deleteFoodEntry,
        addWaterEntry,
        deleteWaterEntry,
        addActivityEntry,
        editActivityEntry,
        deleteActivityEntry,
        logWeight,
        getDailyCalculations,
        resetAllData,
        seedRealisticData,
        aiCoachLoading,
        aiCoachData,
        refreshAiCoach,
        showOnboarding,
        setShowOnboarding
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

function getInitialFoodEntries(date: string): FoodEntry[] {
  return [
    {
      id: 'f-1',
      date,
      foodItemId: 'idli',
      foodName: 'Idli (Steamed)',
      quantityG: 100,
      servingLabel: '2 standard idlis',
      calories: 130,
      protein: 4,
      carbs: 27,
      fat: 0.5,
      fiber: 1.5,
      mealType: 'breakfast',
      timestamp: '08:45'
    },
    {
      id: 'f-2',
      date,
      foodItemId: 'sambar',
      foodName: 'Sambar',
      quantityG: 150,
      servingLabel: '1 bowl',
      calories: 90,
      protein: 4.2,
      carbs: 13.5,
      fat: 2.2,
      fiber: 3.7,
      mealType: 'breakfast',
      timestamp: '08:45'
    },
    {
      id: 'f-3',
      date,
      foodItemId: 'chicken-breast',
      foodName: 'Chicken Breast (Cooked, plain)',
      quantityG: 150,
      servingLabel: 'Grilled portion',
      calories: 248,
      protein: 46.5,
      carbs: 0,
      fat: 5.4,
      fiber: 0,
      mealType: 'lunch',
      timestamp: '13:15'
    },
    {
      id: 'f-4',
      date,
      foodItemId: 'brown-rice',
      foodName: 'Brown Rice',
      quantityG: 120,
      servingLabel: 'Cooked portion',
      calories: 133,
      protein: 3.1,
      carbs: 27.6,
      fat: 1.1,
      fiber: 2.2,
      mealType: 'lunch',
      timestamp: '13:15'
    },
    {
      id: 'f-5',
      date,
      foodItemId: 'dal-tadka',
      foodName: 'Dal Tadka',
      quantityG: 120,
      servingLabel: '1 katori',
      calories: 120,
      protein: 6,
      carbs: 16.8,
      fat: 4.2,
      fiber: 4.2,
      mealType: 'lunch',
      timestamp: '13:15'
    },
    {
      id: 'f-6',
      date,
      foodItemId: 'whey-isolate',
      foodName: 'Whey Isolate Powder',
      quantityG: 30,
      servingLabel: '1 Scoop (~30g)',
      calories: 110,
      protein: 26,
      carbs: 0.5,
      fat: 0.3,
      fiber: 0,
      mealType: 'snack',
      timestamp: '17:30'
    }
  ];
}
