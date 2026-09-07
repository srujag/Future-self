import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, PlusCircle, Sparkles, TrendingUp, Coins, Utensils, Droplets, Activity } from 'lucide-react';

interface NavigationProps {
  onOpenLogModal: (type: 'food' | 'water' | 'activity') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenLogModal }) => {
  const { activeTab, setActiveTab } = useApp();
  const [logMenuOpen, setLogMenuOpen] = React.useState(false);

  return (
    <>
      {/* Popover Quick Log Menu */}
      {logMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setLogMenuOpen(false)}
        >
          <div 
            className="w-full max-w-xs bg-[#161622] border border-[#2B2B3D] rounded-2xl p-3 space-y-2 shadow-2xl mb-16 sm:mb-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs font-bold text-[#8A8A9E] px-2 py-1 uppercase tracking-wider">
              Quick Log Actions
            </div>
            
            <button
              onClick={() => {
                setLogMenuOpen(false);
                onOpenLogModal('food');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#1E1E2C] hover:bg-[#28283C] text-left transition-colors text-white font-semibold text-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FF3269]/20 text-[#FF3269] flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <div>Log Food & Macros</div>
                <div className="text-[11px] text-[#8E8EA0] font-normal">Select from PRD staple table</div>
              </div>
            </button>

            <button
              onClick={() => {
                setLogMenuOpen(false);
                onOpenLogModal('water');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#1E1E2C] hover:bg-[#28283C] text-left transition-colors text-white font-semibold text-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <div>Log Hydration</div>
                <div className="text-[11px] text-[#8E8EA0] font-normal">Track towards 3L daily goal</div>
              </div>
            </button>

            <button
              onClick={() => {
                setLogMenuOpen(false);
                onOpenLogModal('activity');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#1E1E2C] hover:bg-[#28283C] text-left transition-colors text-white font-semibold text-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-[#CCFF00]/20 text-[#CCFF00] flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div>Log Activity & Burn</div>
                <div className="text-[11px] text-[#8E8EA0] font-normal">Auto MET calc with editable calories</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav (Cult athletic mobile/tablet bar) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E14]/95 backdrop-blur-lg border-t border-[#1F1F2C] py-2 px-4">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Today Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'dashboard' ? 'text-[#FF3269]' : 'text-[#7D7D92] hover:text-white'
            }`}
          >
            <Flame className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-tight">Today</span>
          </button>

          {/* Future Self Gallery */}
          <button
            onClick={() => setActiveTab('future-self')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'future-self' ? 'text-[#FF3269]' : 'text-[#7D7D92] hover:text-white'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-tight">Future Self</span>
          </button>

          {/* Central Prominent Quick Log Button */}
          <button
            onClick={() => setLogMenuOpen(!logMenuOpen)}
            className="flex flex-col items-center -mt-5 group"
            title="Log Food, Water, or Activity"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF3269] to-[#FF5500] text-white flex items-center justify-center shadow-lg shadow-[#FF3269]/40 group-hover:scale-105 active:scale-95 transition-transform">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white mt-0.5">Log</span>
          </button>

          {/* Progress & Trends */}
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'progress' ? 'text-[#FF3269]' : 'text-[#7D7D92] hover:text-white'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-tight">Progress</span>
          </button>

          {/* Credits Question & Cost Breakdown */}
          <button
            onClick={() => setActiveTab('credits')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'credits' ? 'text-[#CCFF00]' : 'text-[#7D7D92] hover:text-white'
            }`}
          >
            <Coins className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-tight">Credits</span>
          </button>
        </div>
      </nav>
    </>
  );
};
