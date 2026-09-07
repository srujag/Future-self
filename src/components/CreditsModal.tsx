import React from 'react';
import { Coins, Zap, Sparkles, Server, CheckCircle2, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

export const CreditsModal: React.FC = () => {
  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-tr from-[#1E1A14] via-[#1A181C] to-[#121219] border border-[#3D3524] p-5 sm:p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#CCFF00]/20 text-[#CCFF00] flex items-center justify-center">
            <Coins className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 tracking-widest">
            RESOURCE & CREDIT ESTIMATION
          </span>
        </div>

        <h2 className="font-athletic text-4xl sm:text-5xl font-bold text-white tracking-wide leading-none">
          CREDITS REQUIRED TO BUILD THIS APP
        </h2>
        <p className="text-sm text-[#A0A0B2] max-w-2xl leading-relaxed">
          Comprehensive breakdown of development credits, Gemini token costs, Lovable credit usage, and runtime API consumption for Phase 1 of the Future Self Weight Loss application.
        </p>
      </div>

      {/* Credit Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Lovable Credits */}
        <div className="p-4 rounded-2xl bg-[#14141E] border border-[#262638] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#FF85A2] uppercase tracking-wider">Lovable Platform</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF3269]/20 text-[#FF3269] font-bold">PROMPTS</span>
          </div>
          <div className="font-athletic text-4xl font-bold text-white leading-none">
            35 – 55 <span className="text-sm font-sans font-normal text-[#8A8A9E]">credits</span>
          </div>
          <p className="text-xs text-[#8E8EA2] leading-relaxed">
            Covers initial prototype scaffold, BMR calculation engine, full nutrition table, activity MET tables, and Future Self gallery.
          </p>
        </div>

        {/* Card 2: Google AI Studio & Gemini API */}
        <div className="p-4 rounded-2xl bg-[#14141E] border border-[#262638] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#CCFF00] uppercase tracking-wider">Google AI Studio</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#CCFF00]/20 text-[#CCFF00] font-bold">TOKENS</span>
          </div>
          <div className="font-athletic text-4xl font-bold text-[#CCFF00] leading-none">
            ~35k <span className="text-sm font-sans font-normal text-[#8A8A9E]">tokens (&lt; $0.01)</span>
          </div>
          <p className="text-xs text-[#8E8EA2] leading-relaxed">
            Gemini 3.8 Flash ($0.15/1M in, $0.60/1M out). The entire codebase builds for fractions of a single cent, well within standard free tier limits.
          </p>
        </div>

        {/* Card 3: Runtime AI Coach */}
        <div className="p-4 rounded-2xl bg-[#14141E] border border-[#262638] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#00E5FF] uppercase tracking-wider">Runtime Coach Calls</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#00E5FF]/20 text-[#00E5FF] font-bold">PER ADVICE</span>
          </div>
          <div className="font-athletic text-4xl font-bold text-[#00E5FF] leading-none">
            $0.0001 <span className="text-sm font-sans font-normal text-[#8A8A9E]">/ day</span>
          </div>
          <p className="text-xs text-[#8E8EA2] leading-relaxed">
            Each personalized daily Future Self feedback message consumes ~500 tokens. Fully covered by Google AI Studio's 15 RPM free tier.
          </p>
        </div>
      </div>

      {/* Detailed Architectural Cost Breakdown */}
      <div className="rounded-3xl bg-[#13131D] border border-[#242436] p-5 shadow-lg space-y-4">
        <h3 className="font-athletic text-2xl font-bold text-white tracking-wide">
          DETAILED COST & RESOURCE BREAKDOWN
        </h3>

        <div className="space-y-3">
          {/* Row 1 */}
          <div className="p-3.5 rounded-2xl bg-[#171725] border border-[#262638] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#CCFF00]" />
                <span>1. Agent Code Generation & Verification</span>
              </div>
              <p className="text-[#8A8A9E]">
                Scaffolding the full TypeScript stack, Express server, Vite middleware, Tailwind dark theme, and PRD datasets.
              </p>
            </div>
            <div className="text-right sm:shrink-0 font-athletic text-xl font-bold text-[#CCFF00]">
              ~25,000 tokens ($0.005)
            </div>
          </div>

          {/* Row 2 */}
          <div className="p-3.5 rounded-2xl bg-[#171725] border border-[#262638] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF3269]" />
                <span>2. Future Self Visual Assets (Phase 1 vs Phase 2)</span>
              </div>
              <p className="text-[#8A8A9E]">
                Phase 1 uses curated high-resolution aspiration photographs (Dresses, Beach, Activities) at 0 credit cost. Custom Imagen 3 / Nano Banana generation in Phase 2 costs ~$0.03 - $0.04 per image.
              </p>
            </div>
            <div className="text-right sm:shrink-0 font-athletic text-xl font-bold text-white">
              0 credits (Phase 1)
            </div>
          </div>

          {/* Row 3 */}
          <div className="p-3.5 rounded-2xl bg-[#171725] border border-[#262638] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00E5FF]" />
                <span>3. Daily Motivational Feedback Engine</span>
              </div>
              <p className="text-[#8A8A9E]">
                Dual engine: Built-in instant algorithmic evaluator + Gemini 3.8 Flash server endpoint for natural conversational coaching.
              </p>
            </div>
            <div className="text-right sm:shrink-0 font-athletic text-xl font-bold text-[#00E5FF]">
              Free Tier (15 RPM)
            </div>
          </div>

          {/* Row 4 */}
          <div className="p-3.5 rounded-2xl bg-[#171725] border border-[#262638] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-[#FF85A2]" />
                <span>4. Hosting & Container Runtime</span>
              </div>
              <p className="text-[#8A8A9E]">
                Hosted on Google Cloud Run with automatic scale-to-zero container routing and client-side secure persistence.
              </p>
            </div>
            <div className="text-right sm:shrink-0 font-athletic text-xl font-bold text-[#FF85A2]">
              $0.00 / month (Free tier)
            </div>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#181826] to-[#1F1F30] border border-[#2E2E44] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <CheckCircle2 className="w-4 h-4 text-[#CCFF00]" />
          <span>Verdict & Recommendation</span>
        </div>
        <p className="text-xs text-[#A0A0B8] leading-relaxed">
          If you are building this prototype in **Google AI Studio**, it requires **less than 1 cent worth of Gemini API tokens** (and is covered by Google's free preview allowances). If building in **Lovable**, budget **~40–50 credits** for the full multi-screen flow. Running the app daily for users is essentially free under standard Gemini 3.8 Flash API limits.
        </p>
      </div>
    </div>
  );
};
