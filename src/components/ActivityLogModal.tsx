import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PRD_ACTIVITY_TABLE, calculateEstimatedCalories } from '../data/referenceData';
import { ActivityEntry } from '../types';
import { X, Plus, Trash2, Edit3, Flame, Clock } from 'lucide-react';

interface ActivityLogModalProps {
  onClose: () => void;
  editEntryId?: string;
}

export const ActivityLogModal: React.FC<ActivityLogModalProps> = ({ onClose, editEntryId }) => {
  const { selectedDate, userProfile, addActivityEntry, editActivityEntry, deleteActivityEntry, activityEntries } = useApp();

  const existingEntry = editEntryId ? activityEntries.find(a => a.id === editEntryId) : null;

  const [selectedType, setSelectedType] = useState<string>(existingEntry ? existingEntry.activityType : 'walking');
  const [durationMinutes, setDurationMinutes] = useState<number>(existingEntry ? existingEntry.durationMinutes : 30);
  const [userCalories, setUserCalories] = useState<number>(
    existingEntry ? existingEntry.userEditedCalories : 150
  );
  const [isManualOverride, setIsManualOverride] = useState<boolean>(
    existingEntry ? existingEntry.userEditedCalories !== existingEntry.calculatedCalories : false
  );

  const selectedActivity = PRD_ACTIVITY_TABLE.find(a => a.type === selectedType) || PRD_ACTIVITY_TABLE[0];

  // Auto calculate based on PRD weight table
  const systemCalculated = calculateEstimatedCalories(selectedType, durationMinutes, userProfile.currentWeightKg);

  useEffect(() => {
    if (!isManualOverride) {
      setUserCalories(systemCalculated);
    }
  }, [selectedType, durationMinutes, userProfile.currentWeightKg, isManualOverride, systemCalculated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingEntry) {
      editActivityEntry(existingEntry.id, {
        activityType: selectedType,
        activityName: selectedActivity.name,
        durationMinutes,
        calculatedCalories: systemCalculated,
        userEditedCalories: userCalories
      });
    } else {
      addActivityEntry({
        date: selectedDate,
        activityType: selectedType,
        activityName: selectedActivity.name,
        durationMinutes,
        calculatedCalories: systemCalculated,
        userEditedCalories: userCalories
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#13131D] border border-[#252538] rounded-3xl overflow-hidden shadow-2xl my-auto animate-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-[#212133] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#CCFF00]/20 text-[#CCFF00] tracking-wider">
              PRD MET-TABLE BURN ENGINE
            </span>
            <h2 className="font-athletic text-2xl font-bold text-white tracking-wide mt-1">
              {existingEntry ? 'EDIT ACTIVITY ENTRY' : 'LOG ACTIVITY & BURN'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[#1C1C2B] text-[#8E8EA2] hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Activity Selector */}
          <div>
            <label className="block text-xs font-bold text-[#A0A0B5] uppercase tracking-wider mb-1.5">
              Select Cult Activity
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRD_ACTIVITY_TABLE.map(act => {
                const isSelected = act.type === selectedType;
                return (
                  <div
                    key={act.type}
                    onClick={() => {
                      setSelectedType(act.type);
                      setIsManualOverride(false);
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#CCFF00]/15 border-[#CCFF00]'
                        : 'bg-[#181826] border-[#252538] hover:border-[#38384E]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{act.name}</span>
                    </div>
                    <div className="text-[11px] text-[#828299] mt-0.5">{act.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Duration Input */}
          <div className="p-4 rounded-2xl bg-[#171725] border border-[#27273C] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-[#9E9EB2] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FF3269]" />
                  Workout Duration
                </label>
                <div className="text-xs text-[#6E6E85]">Body weight: {userProfile.currentWeightKg} kg</div>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={e => {
                    setDurationMinutes(Math.max(1, Number(e.target.value)));
                    setIsManualOverride(false);
                  }}
                  className="w-20 px-2 py-1 text-center font-athletic text-2xl font-bold bg-[#111119] border border-[#2E2E44] rounded-lg text-white focus:border-[#CCFF00] outline-hidden"
                />
                <span className="text-xs font-bold text-[#8E8EA2]">minutes</span>
              </div>
            </div>

            {/* Quick Duration Chips */}
            <div className="flex gap-2">
              {[15, 30, 45, 60, 90].map(mins => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    setDurationMinutes(mins);
                    setIsManualOverride(false);
                  }}
                  className={`flex-1 py-1 text-xs rounded-lg border font-semibold ${
                    durationMinutes === mins ? 'bg-[#CCFF00]/20 text-[#CCFF00] border-[#CCFF00]/40' : 'bg-[#1E1E2C] text-[#8E8EA2] border-[#2A2A3E]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Editable Calories Burn Section (PRD Section 13 Feature) */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#1A1A28] to-[#1F1F30] border border-[#2F2F45] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Flame className="w-4 h-4 text-[#FF5500] fill-[#FF5500]" />
                  <span>Calories Burned</span>
                </div>
                <div className="text-[11px] text-[#8E8EA2]">
                  System estimated: <span className="text-white font-semibold">{systemCalculated} kcal</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="number"
                    value={userCalories}
                    onChange={e => {
                      setUserCalories(Math.max(0, Number(e.target.value)));
                      setIsManualOverride(true);
                    }}
                    className="w-24 px-2 py-1 text-center font-athletic text-3xl font-bold bg-[#101017] border border-[#FF3269]/40 rounded-xl text-[#CCFF00] focus:border-[#CCFF00] outline-hidden"
                  />
                  <span className="absolute -bottom-4 left-0 right-0 text-[9px] text-center text-[#828298] font-bold">
                    {isManualOverride ? 'USER EDITED' : 'AUTO ESTIMATED'}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#8E8EA2]">kcal</span>
              </div>
            </div>

            <p className="text-[11px] text-[#7C7C92] pt-2 border-t border-[#2A2A3E]">
              💡 As per PRD requirements, you can edit the calorie value to match your fitness watch or personal effort. The edited value is what counts in your daily deficit.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            {existingEntry ? (
              <button
                type="button"
                onClick={() => {
                  deleteActivityEntry(existingEntry.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold px-3 py-2 rounded-xl hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-[#8E8EA2] hover:text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CCFF00] to-[#99E600] text-black hover:opacity-95 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#CCFF00]/20"
              >
                <Plus className="w-4 h-4" />
                <span>{existingEntry ? 'Update Activity' : 'Log Workout'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
