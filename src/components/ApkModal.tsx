import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  QrCode
} from 'lucide-react';

interface ApkModalProps {
  onClose: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const ApkModal: React.FC<ApkModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'pwabuilder' | 'cli'>('direct');
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installSuccess, setInstallSuccess] = useState(false);

  // URLs for the active environment
  const devUrl = 'https://ais-dev-4b7ozuznmlz3ndstafdfka-142151943176.asia-east1.run.app';
  const preUrl = 'https://ais-pre-4b7ozuznmlz3ndstafdfka-142151943176.asia-east1.run.app';
  
  // Default to devUrl if in dev, or window.location.origin
  const appUrl = typeof window !== 'undefined' && window.location.origin.includes('ais-')
    ? window.location.origin
    : devUrl;

  const pwabuilderUrl = `https://www.pwabuilder.com/?site=${encodeURIComponent(appUrl)}`;

  // Capture native Android install prompt if triggered
  useEffect(() => {
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallSuccess(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Install prompt error:', err);
    }
  };

  const copyAppUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-[#12121A] border border-[#262638] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 my-8 text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#1D1D2B] text-[#9A9AA8] hover:text-white hover:bg-[#2A2A3E] transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pr-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00E5FF] via-[#FF3269] to-[#CCFF00] p-[2px] shadow-lg shadow-[#00E5FF]/20 flex-shrink-0">
            <div className="w-full h-full bg-[#12121A] rounded-[14px] flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-[#00E5FF]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-athletic text-2xl tracking-wider uppercase font-bold text-white leading-none">
                Install Cult on Android & APK
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30">
                PWA & WebAPK
              </span>
            </div>
            <p className="text-xs text-[#9E9EB5] mt-1">
              Run as a full-screen native Android app or generate an installable APK file.
            </p>
          </div>
        </div>

        {/* Quick App Link Bar */}
        <div className="space-y-2">
          <div className="bg-[#191924] border border-[#2B2B3E] rounded-2xl p-3 flex items-center justify-between gap-2">
            <div className="truncate text-xs text-[#C2C2D6] font-mono select-all">
              {appUrl}
            </div>
            <button
              onClick={copyAppUrl}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#252538] hover:bg-[#32324C] text-xs font-semibold text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#CCFF00]" />
                  <span className="text-[#CCFF00]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#9E9EB5]" />
                  <span>Copy URL</span>
                </>
              )}
            </button>
          </div>
          <div className="text-[11px] text-[#8C8CA4] px-1 flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> The link above is your live development instance. To make the app publicly shareable without logging into AI Studio, click the <strong>&ldquo;Share&rdquo;</strong> button in the top-right AI Studio toolbar.
            </span>
          </div>
        </div>

        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#181824] rounded-2xl border border-[#262638]">
          <button
            onClick={() => setActiveTab('direct')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === 'direct'
                ? 'bg-[#FF3269] text-white shadow-md'
                : 'text-[#9E9EB5] hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>1-Tap WebAPK</span>
          </button>

          <button
            onClick={() => setActiveTab('pwabuilder')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === 'pwabuilder'
                ? 'bg-[#00E5FF] text-black shadow-md'
                : 'text-[#9E9EB5] hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate APK</span>
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              activeTab === 'cli'
                ? 'bg-[#CCFF00] text-black shadow-md'
                : 'text-[#9E9EB5] hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Android Studio</span>
          </button>
        </div>

        {/* Tab 1: Direct Android 1-Tap WebAPK */}
        {activeTab === 'direct' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-[#181826] border border-[#28283D] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
                <span>Instant Android WebAPK Installation</span>
              </div>
              <p className="text-xs text-[#A8A8BF] leading-relaxed">
                When opened in Android Google Chrome, Android uses Google's official <span className="text-white font-semibold">WebAPK minting service</span> to automatically compile and install a genuine native Android APK package directly onto your phone without requiring manual file downloads or unknown-source warnings.
              </p>

              {/* Native Prompt button if available */}
              {deferredPrompt && (
                <button
                  onClick={handleNativeInstall}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF3269] to-[#FF5722] hover:brightness-110 text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF3269]/25 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Install Cult WebAPK on This Device</span>
                </button>
              )}

              {installSuccess && (
                <div className="p-3 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-xs text-[#CCFF00] flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Cult has been successfully installed on your Android device! Check your home screen or app drawer.</span>
                </div>
              )}

              {/* Steps for Android Phone */}
              <div className="space-y-2 pt-2 border-t border-[#26263A]">
                <div className="text-[11px] font-extrabold text-[#85859E] uppercase tracking-wider">
                  How to Install on Any Android Phone:
                </div>
                
                <ol className="space-y-2 text-xs text-[#D1D1E0]">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#252538] text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Open this app URL in <strong>Google Chrome</strong> or <strong>Samsung Internet</strong> on your Android phone.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#252538] text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Tap the <strong>three dots (⋮)</strong> menu in the browser top-right corner.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#252538] text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Tap <strong>&ldquo;Install app&rdquo;</strong> (or &ldquo;Add to Home screen&rdquo;). Android will build and launch it as a full-screen standalone app!</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* QR Code Scan Section */}
            <div className="bg-[#181826] border border-[#28283D] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-white p-2.5 rounded-xl shadow-inner flex-shrink-0">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&margin=0&data=${encodeURIComponent(appUrl)}`}
                  alt="Scan QR to open on Android" 
                  className="w-[110px] h-[110px]"
                />
              </div>
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-white">
                  <QrCode className="w-4 h-4 text-[#00E5FF]" />
                  <span>Scan to Open on Android</span>
                </div>
                <p className="text-[11px] text-[#8E8EA0] leading-normal">
                  Scan this QR code with your Android phone camera to open the app directly and install in 1 tap.
                </p>
                <button
                  onClick={copyAppUrl}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#00E5FF] hover:underline pt-1"
                >
                  <span>Copy mobile install link</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: PWABuilder (1-Click APK Download) */}
        {activeTab === 'pwabuilder' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-[#181826] border border-[#28283D] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Download className="w-4 h-4 text-[#00E5FF]" />
                <span>Download Signed .APK / .AAB via PWABuilder</span>
              </div>
              <p className="text-xs text-[#A8A8BF] leading-relaxed">
                PWABuilder is Microsoft's open-source tool that wraps progressive web apps into official Android Packages (APKs) and Google Play Store App Bundles (AABs) using Google's <strong>Trusted Web Activity (TWA)</strong>.
              </p>

              <div className="p-3 bg-[#111119] rounded-xl border border-[#242436] space-y-2 text-xs">
                <div className="font-semibold text-white">What PWABuilder generates for you:</div>
                <ul className="space-y-1 text-[#A0A0B8] list-disc list-inside">
                  <li><strong className="text-white">Standalone .APK:</strong> Sideload directly to any Android device or emulator</li>
                  <li><strong className="text-white">Signed .AAB:</strong> Ready to upload to the Google Play Store Console</li>
                  <li><strong className="text-white">Java/Kotlin Source:</strong> Full Android Studio project source files</li>
                </ul>
              </div>

              <a
                href={pwabuilderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00A3FF] hover:brightness-110 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#00E5FF]/20 transition-all cursor-pointer"
              >
                <span>Generate APK on PWABuilder</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="text-[11px] text-[#787890] text-center">
                Clicking opens PWABuilder with this app's URL pre-loaded. Click &ldquo;Package for Android&rdquo; to download your APK.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Offline Android Studio / Capacitor CLI */}
        {activeTab === 'cli' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-[#181826] border border-[#28283D] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Terminal className="w-4 h-4 text-[#CCFF00]" />
                <span>Build Offline APK with Capacitor & Android Studio</span>
              </div>
              <p className="text-xs text-[#A8A8BF] leading-relaxed">
                If you have exported this project to your computer and have Android Studio installed, you can generate a custom native Android APK locally with Capacitor:
              </p>

              <div className="bg-[#0B0B10] p-3 rounded-xl border border-[#222233] font-mono text-[11px] text-[#A6E22E] space-y-1.5 overflow-x-auto select-all">
                <div className="text-[#888899]"># 1. Install Capacitor Android tools</div>
                <div>npm install @capacitor/core @capacitor/cli @capacitor/android</div>
                <div className="text-[#888899] pt-1"># 2. Initialize native project</div>
                <div>npx cap init &quot;Cult Future Self&quot; &quot;com.cult.futureself&quot;</div>
                <div className="text-[#888899] pt-1"># 3. Add Android platform & build</div>
                <div>npm run build</div>
                <div>npx cap add android</div>
                <div>npx cap copy</div>
                <div className="text-[#888899] pt-1"># 4. Open in Android Studio to build .APK</div>
                <div>npx cap open android</div>
              </div>

              <p className="text-[11px] text-[#8E8EA0]">
                In Android Studio, select <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong> to output your release or debug APK.
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-2 border-t border-[#202030] flex items-center justify-between text-xs text-[#7B7B92]">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#FF3269]" />
            <span>PWA Spec: Standalone, 192px/512px Icons &amp; Service Worker Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1C1C28] hover:bg-[#252536] text-white font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
