import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Calendar, ChevronLeft, ChevronRight, Sparkles, Coins, User, Smartphone, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onOpenApkModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenApkModal }) => {
  const { selectedDate, setSelectedDate, userProfile, setActiveTab, activeTab, setShowOnboarding, resetAllData } = useApp();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B0E]/95 backdrop-blur-md border-b border-[#1E1E28] px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Cult Logo Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF3269] to-[#FF5722] flex items-center justify-center shadow-lg shadow-[#FF3269]/20 transition-transform group-hover:scale-105">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-athletic text-2xl tracking-wider text-white font-bold leading-none">
                CULT
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#FF3269]/20 text-[#FF3269] border border-[#FF3269]/30 tracking-widest">
                FUTURE SELF
              </span>
            </div>
            <p className="text-[11px] text-[#8E8EA0] font-medium leading-none mt-0.5">
              Target: <span className="text-white font-semibold">{userProfile.targetWeightKg} kg</span> ({userProfile.currentWeightKg - userProfile.targetWeightKg > 0 ? `-${(userProfile.currentWeightKg - userProfile.targetWeightKg).toFixed(1)}kg to go` : 'Goal achieved'})
            </p>
          </div>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center bg-[#15151F] border border-[#262636] rounded-xl px-2 py-1 shadow-inner">
          <button
            onClick={handlePrevDay}
            className="p-1 text-[#9E9EB2] hover:text-white hover:bg-[#222233] rounded-lg transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1.5 px-2">
            <Calendar className="w-3.5 h-3.5 text-[#FF3269]" />
            <span className="text-xs font-semibold text-white tracking-wide whitespace-nowrap">
              {isToday ? 'Today' : formattedDate}
            </span>
          </div>

          <button
            onClick={handleNextDay}
            className="p-1 text-[#9E9EB2] hover:text-white hover:bg-[#222233] rounded-lg transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onOpenApkModal && (
            <button
              onClick={onOpenApkModal}
              className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 transition-all shadow-sm"
              title="Get Android APK or install on device"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span className="inline">Get APK</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('credits')}
            className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all ${
              activeTab === 'credits'
                ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                : 'bg-[#181824] text-[#CCFF00] border-[#CCFF00]/30 hover:bg-[#CCFF00]/10'
            }`}
            title="View credits & costs required to build this app"
          >
            <Coins className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Credits Info</span>
          </button>

          <button
            onClick={() => setShowConfirmReset(true)}
            className="p-2 rounded-xl bg-[#181824] text-[#9E9EB2] hover:text-[#FF3269] border border-[#252538] hover:border-[#FF3269]/40 transition-colors"
            title="Reset All Data & Restart Onboarding from Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowOnboarding(true)}
            className="p-2 rounded-xl bg-[#181824] text-[#9E9EB2] hover:text-white border border-[#252538] hover:border-[#3B3B52] transition-colors"
            title="Edit Profile & Onboarding"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Resetting */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full rounded-2xl bg-[#161622] border border-[#2E2E42] p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-[#FF3269]/20 text-[#FF3269] flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-athletic text-2xl font-bold text-white">RESTART FRESH ONBOARDING?</h3>
              <p className="text-xs text-[#9E9EB5]">
                This will clear all logged meals, water, and workouts, returning you to the clean step-1 onboarding setup.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#202030] hover:bg-[#2A2A3E] text-xs font-bold text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowConfirmReset(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#FF3269] hover:bg-[#FF4655] text-xs font-bold text-white transition-colors shadow-lg shadow-[#FF3269]/30"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
