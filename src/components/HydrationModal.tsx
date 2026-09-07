import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Droplets, Plus, Trash2 } from 'lucide-react';

interface HydrationModalProps {
  onClose: () => void;
}

export const HydrationModal: React.FC<HydrationModalProps> = ({ onClose }) => {
  const { selectedDate, userProfile, addWaterEntry, deleteWaterEntry, waterEntries } = useApp();

  const [customMl, setCustomMl] = useState<number>(250);

  const dayEntries = waterEntries.filter(w => w.date === selectedDate);
  const totalMl = dayEntries.reduce((acc, curr) => acc + curr.amountMl, 0);
  const targetMl = userProfile.dailyWaterTargetMl || 3000;
  const percent = Math.min(100, Math.round((totalMl / targetMl) * 100));

  const handleQuickAdd = (ml: number) => {
    addWaterEntry(ml, selectedDate);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-[#13131D] border border-[#252538] rounded-3xl overflow-hidden shadow-2xl my-auto animate-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-[#212133] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#00E5FF]/20 text-[#00E5FF] tracking-wider">
              DAILY 3.0L TARGET
            </span>
            <h2 className="font-athletic text-2xl font-bold text-white tracking-wide mt-1">
              HYDRATION TRACKER
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[#1C1C2B] text-[#8E8EA2] hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Progress Visual */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#161B2E] to-[#121422] border border-[#1F2D48] text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center mx-auto">
              <Droplets className="w-6 h-6 fill-[#00E5FF]" />
            </div>

            <div className="font-athletic text-4xl font-bold text-white leading-none">
              {(totalMl / 1000).toFixed(2)}L <span className="text-sm font-sans font-normal text-[#8E8EA2]">/ {(targetMl / 1000).toFixed(1)}L</span>
            </div>

            <div className="w-full h-3 rounded-full bg-[#1A1A28] overflow-hidden p-0.5 border border-[#29293C]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-[#8E8EA2] font-semibold px-1">
              <span>{percent}% Completed</span>
              <span>{Math.max(0, targetMl - totalMl)} ml remaining</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-[#A0A0B5] uppercase tracking-wider mb-2">
              Quick Add Water
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '250 ml', ml: 250, desc: '1 Glass' },
                { label: '500 ml', ml: 500, desc: '1 Bottle' },
                { label: '750 ml', ml: 750, desc: '1 Shaker' },
                { label: '1.0 L', ml: 1000, desc: 'Big Bottle' }
              ].map(item => (
                <button
                  key={item.ml}
                  type="button"
                  onClick={() => handleQuickAdd(item.ml)}
                  className="p-2.5 rounded-xl bg-[#191928] border border-[#27273C] hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 text-center transition-all group"
                >
                  <div className="font-athletic text-lg font-bold text-white group-hover:text-[#00E5FF]">
                    +{item.label}
                  </div>
                  <div className="text-[10px] text-[#7C7C92]">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Milliliters */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#171724] border border-[#262638]">
            <input
              type="number"
              step={50}
              value={customMl}
              onChange={e => setCustomMl(Math.max(10, Number(e.target.value)))}
              className="w-24 px-3 py-1.5 text-center font-athletic text-2xl font-bold bg-[#111119] border border-[#2E2E44] rounded-lg text-white focus:border-[#00E5FF] outline-hidden"
            />
            <span className="text-xs text-[#8E8EA2] font-bold">ml custom</span>
            <button
              type="button"
              onClick={() => handleQuickAdd(customMl)}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00E5FF] text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Today's Logged Entries */}
          <div>
            <div className="text-xs font-bold text-[#8A8A9E] uppercase tracking-wider mb-1.5">
              Today's Entries ({dayEntries.length})
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
              {dayEntries.length === 0 ? (
                <div className="text-xs text-[#6F6F85] text-center py-3">No water logged yet today.</div>
              ) : (
                dayEntries.map(entry => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#181826] border border-[#232336] text-xs"
                  >
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Droplets className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span>+{entry.amountMl} ml</span>
                      <span className="text-[11px] text-[#787890] font-normal">at {entry.timestamp}</span>
                    </div>
                    <button
                      onClick={() => deleteWaterEntry(entry.id)}
                      className="text-[#787890] hover:text-red-400 p-1 rounded transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-[#1E1E2C] bg-[#0E0E15] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1F1F2F] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2A2A3E] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
