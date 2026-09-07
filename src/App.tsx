import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { FutureSelfView } from './components/FutureSelfView';
import { ProgressView } from './components/ProgressView';
import { CreditsModal } from './components/CreditsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { FoodLogModal } from './components/FoodLogModal';
import { ActivityLogModal } from './components/ActivityLogModal';
import { HydrationModal } from './components/HydrationModal';
import { ApkModal } from './components/ApkModal';

const AppContent: React.FC = () => {
  const { activeTab, showOnboarding } = useApp();

  // Modal states
  const [logModalType, setLogModalType] = useState<'food' | 'water' | 'activity' | null>(null);
  const [editEntryId, setEditEntryId] = useState<string | undefined>(undefined);
  const [showApkModal, setShowApkModal] = useState(false);

  const handleOpenLogModal = (type: 'food' | 'water' | 'activity', editId?: string) => {
    setEditEntryId(editId);
    setLogModalType(type);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-white flex flex-col font-sans selection:bg-[#FF3269] selection:text-white">
      {/* Top App Header */}
      <Header onOpenApkModal={() => setShowApkModal(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 pt-4">
        {activeTab === 'dashboard' && (
          <DashboardView 
            onOpenLogModal={handleOpenLogModal} 
            onOpenApkModal={() => setShowApkModal(true)}
          />
        )}
        {activeTab === 'future-self' && <FutureSelfView />}
        {activeTab === 'progress' && <ProgressView />}
        {activeTab === 'credits' && <CreditsModal />}
      </main>

      {/* Persistent Bottom Floating Navigation */}
      <Navigation onOpenLogModal={handleOpenLogModal} />

      {/* Modals & Dialogs */}
      {showOnboarding && <OnboardingModal />}

      {showApkModal && (
        <ApkModal onClose={() => setShowApkModal(false)} />
      )}

      {logModalType === 'food' && (
        <FoodLogModal
          onClose={() => {
            setLogModalType(null);
            setEditEntryId(undefined);
          }}
          editEntryId={editEntryId}
        />
      )}

      {logModalType === 'activity' && (
        <ActivityLogModal
          onClose={() => {
            setLogModalType(null);
            setEditEntryId(undefined);
          }}
          editEntryId={editEntryId}
        />
      )}

      {logModalType === 'water' && (
        <HydrationModal
          onClose={() => {
            setLogModalType(null);
            setEditEntryId(undefined);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
