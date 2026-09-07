import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Plus, Calendar, Scale, Award, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { userProfile, weightEntries, logWeight, foodEntries, waterEntries, activityEntries } = useApp();

  const [newWeight, setNewWeight] = useState<number>(userProfile.currentWeightKg);
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newNote, setNewNote] = useState<string>('');
  const [showLogWeight, setShowLogWeight] = useState<boolean>(false);

  // Compute stats
  const initialWeight = weightEntries[0]?.weightKg || userProfile.currentWeightKg;
  const currentWeight = userProfile.currentWeightKg;
  const targetWeight = userProfile.targetWeightKg;
  const totalLost = Math.max(0, initialWeight - currentWeight);
  const remaining = Math.max(0, currentWeight - targetWeight);

  // Past 7 days calculation
  const past7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const adherenceDays = past7Days.filter(date => {
    const hasFood = foodEntries.some(f => f.date === date);
    const hasWater = waterEntries.some(w => w.date === date);
    return hasFood || hasWater;
  }).length;

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeight > 30 && newWeight < 250) {
      logWeight(newWeight, newDate, newNote || 'Check-in');
      setShowLogWeight(false);
      setNewNote('');
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Weight Transformation Header */}
      <div className="rounded-3xl bg-[#13131D] border border-[#242436] p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#CCFF00]/20 text-[#CCFF00] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-athletic text-3xl font-bold text-white tracking-wide leading-none">
                WEIGHT JOURNEY & PROGRESS
              </h2>
              <p className="text-[11px] text-[#8A8A9E]">Historical milestone tracking per PRD Section 21</p>
            </div>
          </div>

          <button
            onClick={() => setShowLogWeight(!showLogWeight)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#CCFF00] text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Weight</span>
          </button>
        </div>

        {/* 3 Metric Pillars */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-[#171725] border border-[#262638]">
            <span className="text-[10px] text-[#8A8A9E] uppercase font-bold tracking-wider">Start Baseline</span>
            <div className="font-athletic text-3xl font-bold text-white leading-none mt-1">
              {initialWeight} <span className="text-xs font-sans text-[#8A8A9E] font-normal">kg</span>
            </div>
            <span className="text-[10px] text-[#6D6D82]">Onboarding</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171725] border border-[#262638]">
            <span className="text-[10px] text-[#CCFF00] uppercase font-bold tracking-wider">Current Weight</span>
            <div className="font-athletic text-3xl font-bold text-[#CCFF00] leading-none mt-1">
              {currentWeight} <span className="text-xs font-sans text-[#8A8A9E] font-normal">kg</span>
            </div>
            <span className="text-[10px] text-[#88D66C]">-{totalLost.toFixed(1)} kg dropped</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171725] border border-[#262638]">
            <span className="text-[10px] text-[#FF3269] uppercase font-bold tracking-wider">Future Self Goal</span>
            <div className="font-athletic text-3xl font-bold text-[#FF3269] leading-none mt-1">
              {targetWeight} <span className="text-xs font-sans text-[#8A8A9E] font-normal">kg</span>
            </div>
            <span className="text-[10px] text-[#FF3269]">{remaining.toFixed(1)} kg to go</span>
          </div>
        </div>

        {/* Weight Log Modal / Form */}
        {showLogWeight && (
          <form onSubmit={handleSaveWeight} className="p-4 rounded-2xl bg-[#1A1A28] border border-[#303046] space-y-3 animate-in fade-in">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Record New Scale Measurement</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-[#8A8A9E] uppercase mb-1 font-bold">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={e => setNewWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#12121B] border border-[#2B2B3E] text-white text-sm focus:border-[#CCFF00] outline-hidden font-athletic font-bold text-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#8A8A9E] uppercase mb-1 font-bold">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12121B] border border-[#2B2B3E] text-white text-xs focus:border-[#CCFF00] outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#8A8A9E] uppercase mb-1 font-bold">Note</label>
                <input
                  type="text"
                  placeholder="Morning weigh-in, post-fast..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12121B] border border-[#2B2B3E] text-white text-xs focus:border-[#CCFF00] outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowLogWeight(false)}
                className="px-3 py-1.5 text-xs text-[#8A8A9E] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#CCFF00] text-black font-extrabold text-xs uppercase"
              >
                Save Measurement
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Weekly Adherence & Consistency Score */}
      <div className="rounded-3xl bg-[#13131D] border border-[#242436] p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#FF3269]/20 text-[#FF3269] tracking-wider">
              PRD SECTION 19 ADHERENCE
            </span>
            <h3 className="font-athletic text-2xl font-bold text-white tracking-wide mt-1">
              WEEKLY CONSISTENCY SCORE
            </h3>
          </div>
          <div className="font-athletic text-3xl font-bold text-[#CCFF00]">
            {adherenceDays} / 7 <span className="text-xs font-sans text-[#8A8A9E] font-normal">Active Days</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {past7Days.map(date => {
            const hasFood = foodEntries.some(f => f.date === date);
            const hasWater = waterEntries.some(w => w.date === date);
            const isLogged = hasFood || hasWater;
            const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'narrow' });

            return (
              <div
                key={date}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isLogged
                    ? 'bg-[#CCFF00]/15 border-[#CCFF00]/40 text-white'
                    : 'bg-[#171724] border-[#252538] text-[#636378]'
                }`}
              >
                <div className="text-[10px] font-bold uppercase">{dayLabel}</div>
                <div className="font-athletic text-lg font-bold mt-0.5">
                  {date.split('-')[2]}
                </div>
                <div className="text-[9px] mt-0.5">
                  {isLogged ? '✓ Logged' : 'Empty'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Weight Timeline */}
      <div className="rounded-3xl bg-[#13131D] border border-[#242436] p-5 shadow-lg space-y-3">
        <h3 className="font-athletic text-2xl font-bold text-white tracking-wide">
          MEASUREMENT TIMELINE
        </h3>

        <div className="space-y-2">
          {weightEntries.map((w, idx) => {
            const diffFromPrev = idx > 0 ? (w.weightKg - weightEntries[idx - 1].weightKg).toFixed(1) : null;
            return (
              <div
                key={w.id}
                className="p-3 rounded-2xl bg-[#171725] border border-[#252538] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#232334] text-white flex items-center justify-center font-athletic text-lg font-bold">
                    #{weightEntries.length - idx}
                  </div>
                  <div>
                    <div className="font-bold text-white">{w.date}</div>
                    <div className="text-[11px] text-[#86869E]">{w.note || 'Regular weigh-in'}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-athletic text-2xl font-bold text-white leading-none">
                    {w.weightKg} kg
                  </div>
                  {diffFromPrev && (
                    <span className={`text-[10px] font-bold ${Number(diffFromPrev) <= 0 ? 'text-[#88D66C]' : 'text-[#FF3269]'}`}>
                      {Number(diffFromPrev) <= 0 ? `${diffFromPrev} kg` : `+${diffFromPrev} kg`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
