import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Droplets,
  Activity,
  Utensils,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Plus,
  RefreshCw,
  Edit2,
  ChevronRight,
  Smartphone
} from 'lucide-react';

interface DashboardViewProps {
  onOpenLogModal: (type: 'food' | 'water' | 'activity', editId?: string) => void;
  onOpenApkModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenLogModal, onOpenApkModal }) => {
  const {
    selectedDate,
    userProfile,
    getDailyCalculations,
    activeAspiration,
    setActiveTab,
    foodEntries,
    activityEntries,
    aiCoachLoading,
    aiCoachData,
    refreshAiCoach
  } = useApp();

  const daily = getDailyCalculations(selectedDate);
  const dayFoods = foodEntries.filter(f => f.date === selectedDate);
  const dayActivities = activityEntries.filter(a => a.date === selectedDate);

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const isDeficitOnTrack = daily.deficitStatus === 'On track';

  // Target macros based on profile
  const targetProteinG = Math.round(userProfile.currentWeightKg * 1.6); // ~1.6g/kg
  const targetCarbsG = Math.round((userProfile.dailyCalorieTarget * 0.45) / 4);
  const targetFatG = Math.round((userProfile.dailyCalorieTarget * 0.25) / 9);
  const targetFiberG = 25;

  const activeFeedback = aiCoachData || daily.futureSelfFeedback;

  return (
    <div className="space-y-5 pb-24">
      {/* 1. FUTURE SELF HERO CARD — MOTIVATIONAL LAYER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#181826] to-[#12121B] border border-[#27273C] p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Aspiration Visual Thumbnail */}
          <div 
            onClick={() => setActiveTab('future-self')}
            className="relative w-full sm:w-28 h-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 cursor-pointer group shadow-lg border border-[#3A3A54]"
          >
            <img
              src={activeAspiration.imageUrl}
              alt={activeAspiration.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <span className={`absolute top-2 left-2 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-widest border ${
              activeAspiration.isAiGenerated
                ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                : 'bg-black/80 text-[#FF3269] border-[#FF3269]/40'
            }`}>
              {activeAspiration.isAiGenerated ? 'AI PERSONALIZED' : activeAspiration.badge}
            </span>
            <div className="absolute bottom-1.5 left-2 right-2 text-[10px] font-bold text-white truncate flex items-center justify-between">
              <span>{userProfile.targetWeightKg} kg Goal</span>
              <ChevronRight className="w-3 h-3 text-[#FF3269]" />
            </div>
          </div>

          {/* Coach Communication Bubble */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF3269]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Future Self Voice
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  isDeficitOnTrack ? 'bg-[#CCFF00]/20 text-[#CCFF00] border border-[#CCFF00]/40' : 'bg-[#FF3269]/20 text-[#FF3269] border border-[#FF3269]/40'
                }`}>
                  {activeFeedback.coachStatus || (isDeficitOnTrack ? 'ON TRACK' : 'NEEDS TO CUT DOWN')}
                </span>
              </div>

              <button
                onClick={refreshAiCoach}
                disabled={aiCoachLoading}
                className="flex items-center gap-1 text-[11px] text-[#A0A0B8] hover:text-white px-2 py-1 rounded-lg bg-[#202030] hover:bg-[#2A2A3E] transition-colors"
                title="Generate AI Coach advice for today's data"
              >
                <RefreshCw className={`w-3 h-3 ${aiCoachLoading ? 'animate-spin text-[#FF3269]' : ''}`} />
                <span>{aiCoachLoading ? 'Analyzing...' : 'Ask Future Self'}</span>
              </button>
            </div>

            <div className="text-sm font-semibold text-white leading-snug italic">
              "{activeFeedback.message || activeFeedback.cultMotivation}"
            </div>

            {/* Quick bullet outcomes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs">
              <div className="text-[#88D66C] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#88D66C]" />
                <span className="truncate">{activeFeedback.whatWentWell?.[0] || 'Logged nutrition faithfully.'}</span>
              </div>
              {activeFeedback.whatWasMissing?.[0] && (
                <div className="text-[#FFAE70] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#FFAE70]" />
                  <span className="truncate">{activeFeedback.whatWasMissing[0]}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ANDROID APP & APK BANNER */}
      {onOpenApkModal && (
        <div className="bg-gradient-to-r from-[#111624] via-[#161626] to-[#1F1424] border border-[#00E5FF]/30 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-[#00E5FF] flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Android App &amp; APK Package
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30">
                  Ready
                </span>
              </div>
              <p className="text-[11px] text-[#A2A2BC]">
                Install directly as a native Android WebAPK or generate a signed .APK file.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenApkModal}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00A3FF] hover:brightness-110 text-black text-xs font-extrabold uppercase tracking-wider transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-md shadow-[#00E5FF]/20"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Get Android App</span>
          </button>
        </div>
      )}

      {/* 2. CALORIE DEFICIT COMMAND CENTER (PRD Section 15) */}
      <div className="rounded-3xl bg-[#13131D] border border-[#242436] p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FF3269]/20 text-[#FF3269] flex items-center justify-center">
              <Flame className="w-4 h-4 fill-[#FF3269]" />
            </div>
            <div>
              <h3 className="font-athletic text-2xl font-bold tracking-wide text-white leading-none">
                CALORIE DEFICIT TARGET
              </h3>
              <p className="text-[11px] text-[#86869C]">Deficit = BMR (A) + Activity (B) - Consumed (C)</p>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 border ${
            isDeficitOnTrack
              ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/40'
              : 'bg-[#FF3269]/15 text-[#FF3269] border-[#FF3269]/40'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isDeficitOnTrack ? 'bg-[#CCFF00]' : 'bg-[#FF3269]'} animate-pulse`} />
            <span>{daily.deficitStatus}</span>
          </div>
        </div>

        {/* Big Athletic Deficit Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-center">
          <div className="p-3 rounded-2xl bg-[#181826] border border-[#262638]">
            <span className="text-[10px] text-[#8A8A9E] uppercase font-bold tracking-wider">A. BMR Burn</span>
            <div className="font-athletic text-3xl font-bold text-white leading-none mt-1">
              {daily.bmr}
            </div>
            <span className="text-[10px] text-[#6D6D82]">Resting baseline</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#181826] border border-[#262638]">
            <span className="text-[10px] text-[#8A8A9E] uppercase font-bold tracking-wider">B. Activity Burn</span>
            <div className="font-athletic text-3xl font-bold text-[#CCFF00] leading-none mt-1">
              +{daily.caloriesBurned}
            </div>
            <span className="text-[10px] text-[#6D6D82]">{dayActivities.length} active sessions</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#181826] border border-[#262638]">
            <span className="text-[10px] text-[#8A8A9E] uppercase font-bold tracking-wider">C. Food Intake</span>
            <div className="font-athletic text-3xl font-bold text-[#FF5500] leading-none mt-1">
              -{daily.caloriesConsumed}
            </div>
            <span className="text-[10px] text-[#6D6D82]">Target: {userProfile.dailyCalorieTarget} kcal</span>
          </div>

          <div className={`p-3 rounded-2xl border ${
            isDeficitOnTrack ? 'bg-[#CCFF00]/10 border-[#CCFF00]/30' : 'bg-[#FF3269]/10 border-[#FF3269]/30'
          }`}>
            <span className="text-[10px] text-[#8A8A9E] uppercase font-bold tracking-wider">Net Deficit</span>
            <div className={`font-athletic text-3xl font-bold leading-none mt-1 ${
              isDeficitOnTrack ? 'text-[#CCFF00]' : 'text-[#FF3269]'
            }`}>
              {daily.calorieDeficit > 0 ? `+${daily.calorieDeficit}` : daily.calorieDeficit}
            </div>
            <span className="text-[10px] text-white font-semibold">
              {isDeficitOnTrack ? 'Fat burning zone' : 'Surplus day'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. DAILY NUTRITION & MACRONUTRIENTS (PRD Section 11 & 16) */}
      <div className="rounded-3xl bg-[#13131D] border border-[#242436] p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FF3269]/20 text-[#FF3269] flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-athletic text-2xl font-bold tracking-wide text-white leading-none">
                NUTRITION & MACROS
              </h3>
              <p className="text-[11px] text-[#86869C]">{daily.caloriesConsumed} / {userProfile.dailyCalorieTarget} kcal consumed</p>
            </div>
          </div>

          <button
            onClick={() => onOpenLogModal('food')}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#FF3269] hover:bg-[#FF4655] text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Food</span>
          </button>
        </div>

        {/* 4 Macro Progress Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {/* Protein */}
          <div className="p-3 rounded-2xl bg-[#171725] border border-[#27273C] space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#CCFF00]">Protein</span>
              <span className="text-white font-semibold">{daily.protein} / {targetProteinG}g</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#1F1F30] overflow-hidden">
              <div
                className="h-full bg-[#CCFF00] rounded-full transition-all"
                style={{ width: `${Math.min(100, (daily.protein / targetProteinG) * 100)}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="p-3 rounded-2xl bg-[#171725] border border-[#27273C] space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-white">Carbs</span>
              <span className="text-[#A0A0B5] font-semibold">{daily.carbs} / {targetCarbsG}g</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#1F1F30] overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${Math.min(100, (daily.carbs / targetCarbsG) * 100)}%` }}
              />
            </div>
          </div>

          {/* Fiber */}
          <div className="p-3 rounded-2xl bg-[#171725] border border-[#27273C] space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#9D71FF]">Fiber</span>
              <span className="text-[#A0A0B5] font-semibold">{daily.fiber} / {targetFiberG}g</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#1F1F30] overflow-hidden">
              <div
                className="h-full bg-[#9D71FF] rounded-full transition-all"
                style={{ width: `${Math.min(100, (daily.fiber / targetFiberG) * 100)}%` }}
              />
            </div>
          </div>

          {/* Fat */}
          <div className="p-3 rounded-2xl bg-[#171725] border border-[#27273C] space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#00E5FF]">Fat</span>
              <span className="text-[#A0A0B5] font-semibold">{daily.fat} / {targetFatG}g</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#1F1F30] overflow-hidden">
              <div
                className="h-full bg-[#00E5FF] rounded-full transition-all"
                style={{ width: `${Math.min(100, (daily.fat / targetFatG) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Food List snippet */}
        {dayFoods.length > 0 ? (
          <div className="pt-2 border-t border-[#232336] space-y-1.5">
            <div className="text-[11px] text-[#8A8A9E] font-bold uppercase tracking-wider">
              Logged Meals Today ({dayFoods.length})
            </div>
            <div className="space-y-1.5">
              {dayFoods.map(f => (
                <div
                  key={f.id}
                  onClick={() => onOpenLogModal('food', f.id)}
                  className="p-2.5 rounded-xl bg-[#181826] border border-[#252538] hover:border-[#3A3A52] flex items-center justify-between cursor-pointer transition-colors text-xs"
                >
                  <div>
                    <span className="font-bold text-white">{f.foodName}</span>
                    <span className="text-[#8888A0] ml-2">({f.quantityG}g • {f.mealType})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-athletic font-bold text-sm text-[#FF3269]">{f.calories} kcal</span>
                    <span className="text-[10px] text-[#9A9AB2]">P: {f.protein}g</span>
                    <Edit2 className="w-3 h-3 text-[#6A6A82]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="pt-3 border-t border-[#232336] text-center py-2">
            <p className="text-xs text-[#8A8A9E]">No meals logged for today yet.</p>
            <button
              onClick={() => onOpenLogModal('food')}
              className="mt-1.5 inline-flex items-center gap-1 text-xs text-[#FF3269] font-bold hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log first meal</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. HYDRATION & ACTIVITY ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Hydration Card */}
        <div className="rounded-3xl bg-[#13131D] border border-[#242436] p-4 sm:p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center">
                <Droplets className="w-4 h-4 fill-[#00E5FF]" />
              </div>
              <div>
                <h3 className="font-athletic text-2xl font-bold tracking-wide text-white leading-none">
                  HYDRATION
                </h3>
                <p className="text-[11px] text-[#86869C]">Target: 3.0 Litres</p>
              </div>
            </div>

            <button
              onClick={() => onOpenLogModal('water')}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#00E5FF] text-black hover:opacity-90 transition-opacity"
            >
              + Water
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171725] border border-[#27273C] space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="font-athletic text-3xl font-bold text-white">
                {(daily.waterTotalMl / 1000).toFixed(2)}L <span className="text-xs font-sans text-[#8E8EA2] font-normal">/ 3.0L</span>
              </div>
              <div className="text-xs font-bold text-[#00E5FF]">
                {daily.waterPercent}% Complete
              </div>
            </div>

            <div className="w-full h-2.5 rounded-full bg-[#1E1E2C] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] rounded-full transition-all"
                style={{ width: `${daily.waterPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Activity Card */}
        <div className="rounded-3xl bg-[#13131D] border border-[#242436] p-4 sm:p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#CCFF00]/20 text-[#CCFF00] flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-athletic text-2xl font-bold tracking-wide text-white leading-none">
                  ACTIVITY & BURN
                </h3>
                <p className="text-[11px] text-[#86869C]">Auto MET calc + editable burn</p>
              </div>
            </div>

            <button
              onClick={() => onOpenLogModal('activity')}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#CCFF00] text-black hover:opacity-90 transition-opacity"
            >
              + Activity
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171725] border border-[#27273C] space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="font-athletic text-3xl font-bold text-[#CCFF00]">
                {daily.caloriesBurned} <span className="text-xs font-sans text-[#8E8EA2] font-normal">kcal burned</span>
              </div>
              <div className="text-xs font-bold text-white">
                {dayActivities.reduce((a, c) => a + c.durationMinutes, 0)} mins active
              </div>
            </div>

            {dayActivities.length === 0 ? (
              <div className="text-xs text-[#7A7A92] italic">No workout logged yet today.</div>
            ) : (
              <div className="space-y-1">
                {dayActivities.map(act => (
                  <div
                    key={act.id}
                    onClick={() => onOpenLogModal('activity', act.id)}
                    className="flex items-center justify-between text-xs text-[#A8A8BF] hover:text-white cursor-pointer"
                  >
                    <span>• {act.activityName} ({act.durationMinutes}m)</span>
                    <span className="font-athletic text-sm font-bold text-[#CCFF00]">
                      {act.userEditedCalories} kcal
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. DAILY CHECKLIST (PRD Section 11 & 17) */}
      <div className="rounded-3xl bg-[#13131D] border border-[#242436] p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#CCFF00]" />
            <h3 className="font-athletic text-2xl font-bold tracking-wide text-white leading-none">
              DAILY CHECKLIST
            </h3>
          </div>
          <span className="text-xs text-[#8E8EA2] font-semibold">
            {[daily.nutritionLogged, daily.waterTotalMl >= daily.waterTargetMl, daily.activityLogged].filter(Boolean).length} / 3 Tasks Done
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
            daily.nutritionLogged ? 'bg-[#CCFF00]/10 border-[#CCFF00]/30 text-white' : 'bg-[#181826] border-[#252538] text-[#7E7E94]'
          }`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              daily.nutritionLogged ? 'bg-[#CCFF00] text-black' : 'border border-[#4A4A62]'
            }`}>
              {daily.nutritionLogged && <CheckCircle2 className="w-3.5 h-3.5 fill-black text-black" />}
            </div>
            <div>
              <div className="text-xs font-bold">{daily.nutritionLogged ? 'Nutrition Logged' : 'Log Food Intake'}</div>
              <div className="text-[10px] text-[#86869E]">{daily.caloriesConsumed} kcal tracked</div>
            </div>
          </div>

          <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
            daily.waterTotalMl >= daily.waterTargetMl ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-white' : 'bg-[#181826] border-[#252538] text-[#7E7E94]'
          }`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              daily.waterTotalMl >= daily.waterTargetMl ? 'bg-[#00E5FF] text-black' : 'border border-[#4A4A62]'
            }`}>
              {daily.waterTotalMl >= daily.waterTargetMl && <CheckCircle2 className="w-3.5 h-3.5 fill-black text-black" />}
            </div>
            <div>
              <div className="text-xs font-bold">{daily.waterTotalMl >= daily.waterTargetMl ? '3.0L Water Reached' : '3L Hydration Target'}</div>
              <div className="text-[10px] text-[#86869E]">{(daily.waterTotalMl / 1000).toFixed(1)} / 3.0L completed</div>
            </div>
          </div>

          <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
            daily.activityLogged ? 'bg-[#FF3269]/10 border-[#FF3269]/30 text-white' : 'bg-[#181826] border-[#252538] text-[#7E7E94]'
          }`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              daily.activityLogged ? 'bg-[#FF3269] text-white' : 'border border-[#4A4A62]'
            }`}>
              {daily.activityLogged && <CheckCircle2 className="w-3.5 h-3.5 fill-white text-white" />}
            </div>
            <div>
              <div className="text-xs font-bold">{daily.activityLogged ? 'Activity Completed' : 'Log Active Exercise'}</div>
              <div className="text-[10px] text-[#86869E]">{daily.caloriesBurned} kcal burned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
