import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AiFutureSelfGenerator } from './AiFutureSelfGenerator';
import { Sparkles, Check, Flame, Award, Heart, Compass, User, Camera } from 'lucide-react';

export const FutureSelfView: React.FC = () => {
  const { userProfile, activeAspiration, setActiveAspirationId, allAspirations } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ai-generated' | 'dress' | 'picture' | 'activity'>('all');

  const filteredAspirations = allAspirations.filter(a => {
    return selectedCategory === 'all' || a.category === selectedCategory;
  });

  const weightDelta = Math.max(0, userProfile.currentWeightKg - userProfile.targetWeightKg);
  const weeksToGoal = Math.ceil(weightDelta / 0.5);

  return (
    <div className="space-y-8 pb-24">
      {/* Transformation Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-[#161624] via-[#1B1B2C] to-[#251A2E] border border-[#2D2D44] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#FF3269]/20 text-[#FF3269] border border-[#FF3269]/30 tracking-widest">
              CULT ASPIRATION ENGINE
            </span>
            <h2 className="font-athletic text-4xl sm:text-5xl font-bold text-white tracking-wide leading-none">
              WHO YOU ARE BECOMING
            </h2>
            <p className="text-xs text-[#9E9EB5] max-w-md">
              "This is who I want to become → this is what I did today → am I getting closer?"
            </p>
          </div>

          {/* Goal Stats Badge */}
          <div className="flex items-center gap-3 bg-[#111119]/80 border border-[#2D2D42] rounded-2xl p-3.5 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] text-[#8A8A9E] uppercase font-bold">Current</span>
              <div className="font-athletic text-2xl font-bold text-white">{userProfile.currentWeightKg} kg</div>
            </div>
            <div className="text-xl text-[#FF3269] font-bold">→</div>
            <div className="text-center px-2">
              <span className="text-[10px] text-[#CCFF00] uppercase font-bold">Goal Target</span>
              <div className="font-athletic text-2xl font-bold text-[#CCFF00]">{userProfile.targetWeightKg} kg</div>
            </div>
            <div className="border-l border-[#27273A] pl-3 text-left">
              <div className="text-xs font-bold text-white">-{weightDelta.toFixed(1)} kg</div>
              <div className="text-[10px] text-[#8A8A9E]">~{weeksToGoal} wks at 0.5kg/wk</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Future Self Portrait Studio (Upload & AI Transformation) */}
      <AiFutureSelfGenerator />

      {/* Active Selected Aspiration Highlight */}
      <div className="rounded-3xl bg-[#14141E] border-2 border-[#FF3269]/40 p-4 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF3269]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Current Active Aspiration
            </span>
          </div>
          <div className="flex items-center gap-2">
            {activeAspiration.isAiGenerated && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#CCFF00] text-black">
                PERSONALIZED AI VISION
              </span>
            )}
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#FF3269] text-white">
              ACTIVE ON DASHBOARD
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 items-center">
          <div className="w-full sm:w-52 h-60 rounded-2xl overflow-hidden bg-black shrink-0 relative border border-[#2F2F44]">
            <img
              src={activeAspiration.imageUrl}
              alt={activeAspiration.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-black/80 text-[#FF3269] tracking-wider">
              {activeAspiration.badge}
            </span>
            {activeAspiration.targetWeightKg && (
              <span className="absolute bottom-2 right-2 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#CCFF00] text-black">
                {activeAspiration.targetWeightKg} kg Vision
              </span>
            )}
          </div>

          <div className="space-y-2.5 text-center sm:text-left flex-1">
            <h3 className="font-athletic text-3xl sm:text-4xl font-bold text-white leading-none">
              {activeAspiration.title}
            </h3>
            <div className="text-sm font-semibold text-[#CCFF00]">{activeAspiration.tagline}</div>
            <p className="text-xs text-[#A0A0B5] leading-relaxed">{activeAspiration.description}</p>
            <div className="p-3.5 rounded-xl bg-[#1B1B29] border border-[#2B2B3E] text-xs text-white italic">
              "Every clean calorie and every drop of sweat brings you closer to slipping into this reality with effortless confidence."
            </div>

            {userProfile.uploadedPhoto && activeAspiration.isAiGenerated && (
              <div className="pt-1 flex items-center gap-2 justify-center sm:justify-start text-xs text-[#8C8CA0]">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-white/30 shrink-0">
                  <img src={userProfile.uploadedPhoto} alt="Your Face" className="w-full h-full object-cover" />
                </div>
                <span>Facial features and skin tone mapped from your portrait</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Section Header & Tabs */}
      <div className="space-y-4 pt-4 border-t border-[#222234]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-athletic text-2xl sm:text-3xl font-bold text-white leading-none">
              ASPIRATION VAULT & GALLERY
            </h3>
            <p className="text-xs text-[#8E8EA8]">
              Browse your AI generated variations and cult aesthetic archetypes
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: 'all', label: 'All Aspirations' },
            { key: 'ai-generated', label: 'AI Generated' },
            { key: 'dress', label: 'Desirable Dresses' },
            { key: 'picture', label: 'Desirable Pictures' },
            { key: 'activity', label: 'Desirable Activities' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-[#FF3269] text-white border-[#FF3269] shadow-md shadow-[#FF3269]/30'
                  : 'bg-[#151520] text-[#8E8EA2] border-[#252538] hover:border-[#3E3E56]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAspirations.map(asp => {
            const isSelected = asp.id === activeAspiration.id;
            return (
              <div
                key={asp.id}
                className={`rounded-2xl overflow-hidden border flex flex-col transition-all ${
                  isSelected
                    ? 'bg-[#1C1C2C] border-[#FF3269] ring-2 ring-[#FF3269]/40'
                    : asp.isAiGenerated
                    ? 'bg-[#161424] border-[#00E5FF]/40 hover:border-[#00E5FF]'
                    : 'bg-[#14141E] border-[#252536] hover:border-[#383850]'
                }`}
              >
                <div className="relative h-52 bg-black overflow-hidden group">
                  <img
                    src={asp.imageUrl}
                    alt={asp.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14141E] via-transparent to-transparent" />
                  
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-black/80 text-[#FF3269] tracking-wider">
                      {asp.badge}
                    </span>
                    {asp.isAiGenerated && (
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#00E5FF] text-black tracking-wider">
                        AI Generated
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FF3269] text-white flex items-center justify-center shadow-lg">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-athletic text-2xl font-bold text-white leading-none truncate">
                      {asp.title}
                    </h4>
                    <div className="text-xs text-[#CCFF00] font-semibold mt-0.5">{asp.tagline}</div>
                    <p className="text-[11px] text-[#8C8CA0] mt-1 line-clamp-2">{asp.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveAspirationId(asp.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                      isSelected
                        ? 'bg-[#29293C] text-[#A0A0B8] cursor-default'
                        : 'bg-[#FF3269] hover:bg-[#FF4655] text-white shadow-md shadow-[#FF3269]/20'
                    }`}
                  >
                    {isSelected ? 'Active Visual' : 'Set As Future Self'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
