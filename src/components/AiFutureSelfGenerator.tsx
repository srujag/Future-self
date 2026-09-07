import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { FutureSelfAspiration } from '../types';
import {
  FUTURE_SELF_TEMPLATES,
  synthesizeFutureSelf,
  TransformSettings,
  DEFAULT_TRANSFORM_SETTINGS
} from '../utils/faceSynthesis';
import {
  Upload,
  Sparkles,
  Camera,
  Check,
  RefreshCw,
  Sliders,
  Download,
  ShieldCheck,
  User,
  SlidersHorizontal,
  RotateCcw,
  ZoomIn,
  Move,
  SunMedium
} from 'lucide-react';

interface StyleOption {
  key: string;
  title: string;
  badge: string;
  outfit: string;
  tagline: string;
  sampleImg: string;
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    key: 'athletic-cult',
    title: 'Cult Athletic Core',
    badge: 'ATHLETIC SCULPT',
    outfit: 'Signature Cult activewear sports bra & sculpted leggings',
    tagline: 'Toned midriff, defined athletic arms, gym aura',
    sampleImg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
  },
  {
    key: 'party-dress',
    title: 'Little Black Party Dress',
    badge: 'EVENING GLAM',
    outfit: 'Sleek body-contouring evening cocktail dress',
    tagline: 'Sculpted waistline, elegant silhouette, evening aura',
    sampleImg: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
  },
  {
    key: 'summer-chic',
    title: 'Summer Linen Chic',
    badge: 'SUMMER CHIC',
    outfit: 'Lightweight breezy summer dress with delicate straps',
    tagline: 'Sculpted collarbones, toned legs, sunshine freedom',
    sampleImg: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'
  },
  {
    key: 'runner',
    title: 'High-Performance Runner',
    badge: 'RUNNER GLOW',
    outfit: 'Athletic technical running tank & performance shorts',
    tagline: 'Lean athletic runner legs, radiant cardio endurance',
    sampleImg: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'
  }
];

// Sample portrait for instant testing if user hasn't uploaded their own yet
const SAMPLE_PORTRAIT = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

export const AiFutureSelfGenerator: React.FC = () => {
  const { userProfile, updateProfile, saveAiGeneratedAspiration, setActiveAspirationId, activeAspiration } = useApp();

  const [uploadedPhoto, setUploadedPhoto] = useState<string>(userProfile.uploadedPhoto || userProfile.profileImage || '');
  const [selectedStyle, setSelectedStyle] = useState<string>('athletic-cult');
  const [targetWeight, setTargetWeight] = useState<number>(userProfile.targetWeightKg || 55);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [latestGenerated, setLatestGenerated] = useState<FutureSelfAspiration | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeCompareMode, setActiveCompareMode] = useState<'side-by-side' | 'split'>('side-by-side');

  // Precision Face Alignment & Tuning State
  const [showFineTuning, setShowFineTuning] = useState<boolean>(false);
  const [transformSettings, setTransformSettings] = useState<TransformSettings>(DEFAULT_TRANSFORM_SETTINGS);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Perform face synthesis onto toned body template
  const runSynthesis = useCallback(async (
    photoSrc: string,
    styleKey: string,
    settings: TransformSettings,
    goalWeight: number
  ) => {
    if (!photoSrc) return;

    setIsGenerating(true);
    setErrorMsg(null);
    setGenerationStep(1);

    try {
      setGenerationStep(2);
      // Synthesize user's real face onto chosen athletic body template
      const synthesizedDataUrl = await synthesizeFutureSelf(
        photoSrc,
        styleKey,
        settings,
        goalWeight
      );

      setGenerationStep(3);

      const styleObj = STYLE_OPTIONS.find(s => s.key === styleKey) || STYLE_OPTIONS[0];
      const newAspiration: FutureSelfAspiration = {
        id: `ai-future-${styleKey}-${Date.now()}`,
        category: 'ai-generated',
        title: `${userProfile.name ? userProfile.name + "'s" : 'Personalized'} ${styleObj.title}`,
        tagline: `${goalWeight} kg Lean & Toned Vision`,
        imageUrl: synthesizedDataUrl,
        badge: styleObj.badge,
        description: `Photorealistic future self transformation maintaining your natural facial features, smile, and skin tone with a lean, sculpted physique at ${goalWeight} kg.`,
        isAiGenerated: true,
        sourceImage: photoSrc,
        targetWeightKg: goalWeight,
        generatedAt: new Date().toISOString(),
        styleKey
      };

      saveAiGeneratedAspiration(newAspiration);
      setLatestGenerated(newAspiration);
      setIsGenerating(false);
      setGenerationStep(0);
    } catch (err: any) {
      console.error('Synthesis error:', err);
      setIsGenerating(false);
      setGenerationStep(0);
      setErrorMsg(err.message || 'Unable to composite face onto body. Please try another photo.');
    }
  }, [userProfile.name, saveAiGeneratedAspiration]);

  // Initial synthesis if user already has an uploaded photo and no generated aspiration yet
  useEffect(() => {
    if (uploadedPhoto && !latestGenerated && !isGenerating) {
      runSynthesis(uploadedPhoto, selectedStyle, transformSettings, targetWeight);
    }
  }, [uploadedPhoto, latestGenerated, isGenerating, runSynthesis, selectedStyle, transformSettings, targetWeight]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setUploadedPhoto(base64);
      updateProfile({ uploadedPhoto: base64, profileImage: base64 });
      setErrorMsg(null);
      // Immediately run synthesis with new photo
      runSynthesis(base64, selectedStyle, transformSettings, targetWeight);
    };
    reader.readAsDataURL(file);
  };

  const handleUseSample = () => {
    setUploadedPhoto(SAMPLE_PORTRAIT);
    updateProfile({ uploadedPhoto: SAMPLE_PORTRAIT });
    setErrorMsg(null);
    runSynthesis(SAMPLE_PORTRAIT, selectedStyle, transformSettings, targetWeight);
  };

  const handleRemovePhoto = () => {
    setUploadedPhoto('');
    setLatestGenerated(null);
    updateProfile({ uploadedPhoto: '' });
  };

  const handleStyleChange = (styleKey: string) => {
    setSelectedStyle(styleKey);
    if (uploadedPhoto) {
      runSynthesis(uploadedPhoto, styleKey, transformSettings, targetWeight);
    }
  };

  const handleGenerateClick = () => {
    if (!uploadedPhoto) {
      setErrorMsg('Please upload a photo of yourself first.');
      return;
    }
    runSynthesis(uploadedPhoto, selectedStyle, transformSettings, targetWeight);
  };

  const handleSettingChange = <K extends keyof TransformSettings>(key: K, val: TransformSettings[K]) => {
    const updated = { ...transformSettings, [key]: val };
    setTransformSettings(updated);
  };

  // Re-render when user finishes adjusting a slider
  const handleSettingCommit = () => {
    if (uploadedPhoto) {
      runSynthesis(uploadedPhoto, selectedStyle, transformSettings, targetWeight);
    }
  };

  const handleResetAlignment = () => {
    setTransformSettings(DEFAULT_TRANSFORM_SETTINGS);
    if (uploadedPhoto) {
      runSynthesis(uploadedPhoto, selectedStyle, DEFAULT_TRANSFORM_SETTINGS, targetWeight);
    }
  };

  const currentStyle = STYLE_OPTIONS.find(s => s.key === selectedStyle) || STYLE_OPTIONS[0];
  const weightDelta = Math.max(0, userProfile.currentWeightKg - targetWeight);

  return (
    <div className="space-y-6">
      {/* Studio Header Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-[#161626] via-[#1B1B30] to-[#2B1B35] border border-[#2F2F48] p-5 sm:p-7 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3269]/20 border border-[#FF3269]/40 text-[#FF3269] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>AI FUTURE SELF PORTRAIT STUDIO</span>
            </div>
            <h2 className="font-athletic text-3xl sm:text-5xl font-bold text-white tracking-wide">
              SEE YOUR FUTURE TONED PHYSIQUE
            </h2>
            <p className="text-xs sm:text-sm text-[#A5A5C0] max-w-2xl leading-relaxed">
              Upload your photo. Our transformation engine takes <strong className="text-white">your exact facial features, smile, eyes, and skin tone</strong> and composites them seamlessly onto a lean, toned body at your target weight of <strong className="text-[#CCFF00]">{targetWeight} kg</strong> (-{weightDelta.toFixed(1)} kg).
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#11111B]/90 border border-[#2E2E44] rounded-2xl p-3 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
              <div className="text-left">
                <div className="text-xs font-bold text-white">Identity Preservation</div>
                <div className="text-[10px] text-[#8C8CA0]">Your real face & skin tone kept intact</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Interactive Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Photo Upload & Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Step 1: Upload Your Photo */}
          <div className="rounded-3xl bg-[#141420] border border-[#262638] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#FF3269] text-white text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  Upload Your Photo
                </h3>
              </div>
              {uploadedPhoto && (
                <button
                  onClick={handleRemovePhoto}
                  className="text-[11px] text-[#FF5A82] hover:underline font-semibold"
                >
                  Change Photo
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {!uploadedPhoto ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group border-2 border-dashed border-[#34344E] hover:border-[#FF3269] rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#171725]/50 hover:bg-[#1C1C2E] space-y-3"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#222234] group-hover:bg-[#FF3269]/20 group-hover:text-[#FF3269] text-[#9090A8] flex items-center justify-center transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">
                    Click to select or drag & drop your photo
                  </div>
                  <div className="text-xs text-[#8C8CA0]">
                    Front-facing portrait, headshot, or selfie with clear lighting
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseSample();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#252538] hover:bg-[#32324C] text-xs font-semibold text-[#00E5FF] transition-colors flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Try Sample Photo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] max-h-72 w-full mx-auto border border-[#34344E] group">
                <img
                  src={uploadedPhoto}
                  alt="Present User Portrait"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 border border-white/20 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                  Present You • {userProfile.currentWeightKg} kg
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 backdrop-blur-sm transition-all"
                >
                  <Camera className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Choose Another</span>
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Desired Goal Weight & Style */}
          <div className="rounded-3xl bg-[#141420] border border-[#262638] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#FF3269] text-white text-xs font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                Target Weight & Future Physique
              </h3>
            </div>

            {/* Target Weight Slider */}
            <div className="bg-[#191928] border border-[#29293E] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9E9EB5]">
                  Desired Target Weight
                </span>
                <div className="font-athletic text-3xl font-bold text-[#CCFF00] leading-none">
                  {targetWeight} <span className="text-sm font-sans text-[#8C8CA0]">kg</span>
                </div>
              </div>

              <input
                type="range"
                min="45"
                max={Math.max(50, userProfile.currentWeightKg - 1)}
                value={targetWeight}
                onChange={(e) => {
                  const w = Number(e.target.value);
                  setTargetWeight(w);
                }}
                onMouseUp={() => {
                  if (uploadedPhoto) {
                    runSynthesis(uploadedPhoto, selectedStyle, transformSettings, targetWeight);
                  }
                }}
                onTouchEnd={() => {
                  if (uploadedPhoto) {
                    runSynthesis(uploadedPhoto, selectedStyle, transformSettings, targetWeight);
                  }
                }}
                className="w-full accent-[#CCFF00] h-2 bg-[#28283E] rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between text-[11px] text-[#8C8CA0] pt-1">
                <span>Current: {userProfile.currentWeightKg} kg</span>
                <span className="text-[#FF3269] font-bold">
                  Target Loss: -{weightDelta.toFixed(1)} kg
                </span>
                <span>Est. {Math.ceil(weightDelta / 0.5)} wks</span>
              </div>
            </div>

            {/* Style Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9E9EB5] block">
                Choose Future Self Outfit & Vibe
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLE_OPTIONS.map((style) => {
                  const isSelected = selectedStyle === style.key;
                  return (
                    <button
                      key={style.key}
                      type="button"
                      onClick={() => handleStyleChange(style.key)}
                      className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[90px] ${
                        isSelected
                          ? 'bg-[#201A2C] border-[#FF3269] ring-2 ring-[#FF3269]/30'
                          : 'bg-[#181826] border-[#29293C] hover:border-[#3E3E56]'
                      }`}
                    >
                      <div>
                        <div className="text-[9px] font-extrabold text-[#FF3269] uppercase tracking-wider">
                          {style.badge}
                        </div>
                        <div className="text-xs font-bold text-white mt-0.5 leading-tight">
                          {style.title}
                        </div>
                      </div>
                      <div className="text-[10px] text-[#8E8EA8] mt-1 line-clamp-2 leading-tight">
                        {style.outfit}
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#FF3269] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fine-Tuning Drawer Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowFineTuning(!showFineTuning)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#1B1B2A] hover:bg-[#232336] border border-[#2B2B3E] text-xs font-bold text-[#00E5FF] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Fine-Tune Face Fit & Skin Tone</span>
                </div>
                <span className="text-[11px] text-[#8A8A9E]">
                  {showFineTuning ? 'Hide Controls' : 'Adjust Alignment'}
                </span>
              </button>

              {/* Sliders Accordion */}
              {showFineTuning && (
                <div className="mt-3 p-4 rounded-2xl bg-[#101018] border border-[#252538] space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-[#212130]">
                    <span className="font-bold text-white uppercase tracking-wider text-[10px]">
                      Face Alignment Precision
                    </span>
                    <button
                      type="button"
                      onClick={handleResetAlignment}
                      className="flex items-center gap-1 text-[11px] text-[#8A8A9E] hover:text-white"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Zoom / Scale */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#9A9AB0]">
                      <span className="flex items-center gap-1">
                        <ZoomIn className="w-3 h-3 text-[#CCFF00]" />
                        Face Zoom / Scale
                      </span>
                      <span className="text-white font-bold">{Math.round(transformSettings.scale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.75"
                      max="1.35"
                      step="0.02"
                      value={transformSettings.scale}
                      onChange={(e) => handleSettingChange('scale', parseFloat(e.target.value))}
                      onMouseUp={handleSettingCommit}
                      onTouchEnd={handleSettingCommit}
                      className="w-full accent-[#CCFF00] h-1.5 bg-[#252538] rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Vertical Move */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#9A9AB0]">
                      <span className="flex items-center gap-1">
                        <Move className="w-3 h-3 text-[#FF3269]" />
                        Vertical Position (Up / Down)
                      </span>
                      <span className="text-white font-bold">{transformSettings.offsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-60"
                      max="60"
                      step="2"
                      value={transformSettings.offsetY}
                      onChange={(e) => handleSettingChange('offsetY', parseInt(e.target.value, 10))}
                      onMouseUp={handleSettingCommit}
                      onTouchEnd={handleSettingCommit}
                      className="w-full accent-[#FF3269] h-1.5 bg-[#252538] rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Horizontal Move */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#9A9AB0]">
                      <span className="flex items-center gap-1">
                        <Move className="w-3 h-3 text-[#00E5FF]" />
                        Horizontal Position (Left / Right)
                      </span>
                      <span className="text-white font-bold">{transformSettings.offsetX}px</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="2"
                      value={transformSettings.offsetX}
                      onChange={(e) => handleSettingChange('offsetX', parseInt(e.target.value, 10))}
                      onMouseUp={handleSettingCommit}
                      onTouchEnd={handleSettingCommit}
                      className="w-full accent-[#00E5FF] h-1.5 bg-[#252538] rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Skin Warmth / Matching */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#9A9AB0]">
                      <span className="flex items-center gap-1">
                        <SunMedium className="w-3 h-3 text-[#FF9E00]" />
                        Skin Warmth & Tone Match
                      </span>
                      <span className="text-white font-bold">{transformSettings.warmth > 0 ? `+${transformSettings.warmth}` : transformSettings.warmth}</span>
                    </div>
                    <input
                      type="range"
                      min="-15"
                      max="15"
                      step="1"
                      value={transformSettings.warmth}
                      onChange={(e) => handleSettingChange('warmth', parseInt(e.target.value, 10))}
                      onMouseUp={handleSettingCommit}
                      onTouchEnd={handleSettingCommit}
                      className="w-full accent-[#FF9E00] h-1.5 bg-[#252538] rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/50 text-xs text-red-200">
                {errorMsg}
              </div>
            )}

            {/* Generate Action Button */}
            <button
              type="button"
              disabled={isGenerating || !uploadedPhoto}
              onClick={handleGenerateClick}
              className={`w-full py-4 rounded-2xl font-athletic text-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
                isGenerating || !uploadedPhoto
                  ? 'bg-[#252538] text-[#707086] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FF3269] to-[#FF5A36] hover:brightness-110 text-white shadow-[#FF3269]/30'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-[#CCFF00]" />
                  <span>TRANSFORMING WITH YOUR REAL FACE...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-[#CCFF00]" />
                  <span>RE-RENDER FUTURE SELF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Transformation Showcase (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Generation Status Overlay */}
          {isGenerating && (
            <div className="rounded-3xl bg-[#141422] border-2 border-[#FF3269]/50 p-8 text-center space-y-6 animate-pulse">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-[#FF3269]/20 border-t-[#FF3269] animate-spin" />
                <div className="absolute inset-2 rounded-full bg-[#1F1424] flex items-center justify-center text-[#CCFF00]">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-athletic text-3xl font-bold text-white">
                  CREATING YOUR {targetWeight} KG TRANSFORMATION
                </h3>
                <p className="text-xs text-[#9E9EB5] max-w-md mx-auto">
                  Extracting your facial landmarks, eyes, smile, and natural skin tone, then blending onto the athletic {currentStyle.title} physique.
                </p>
              </div>

              {/* Progress Steps */}
              <div className="max-w-md mx-auto space-y-2 text-left text-xs">
                {[
                  { step: 1, text: 'Extracting your photo landmarks & facial contour...' },
                  { step: 2, text: `Harmonizing skin tone & lighting to match toned body...` },
                  { step: 3, text: `Seamlessly blending your face onto ${targetWeight} kg physique...` }
                ].map((s) => (
                  <div
                    key={s.step}
                    className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
                      generationStep >= s.step
                        ? 'bg-[#20172A] text-white'
                        : 'bg-[#181824] text-[#6E6E82]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        generationStep > s.step
                          ? 'bg-[#CCFF00] text-black'
                          : generationStep === s.step
                          ? 'bg-[#FF3269] text-white animate-bounce'
                          : 'bg-[#29293C] text-[#8A8A9E]'
                      }`}
                    >
                      {generationStep > s.step ? '✓' : s.step}
                    </div>
                    <span>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generated Result Showcase or Active Future Self */}
          {latestGenerated ? (
            <div className="rounded-3xl bg-[#141420] border-2 border-[#CCFF00]/40 p-5 sm:p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#CCFF00] animate-ping" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#CCFF00]">
                    Personalized Face Transformation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveCompareMode('side-by-side')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      activeCompareMode === 'side-by-side'
                        ? 'bg-[#2B2B40] text-white border border-[#3E3E5C]'
                        : 'text-[#8E8EA8] hover:text-white'
                    }`}
                  >
                    Side by Side
                  </button>
                  <button
                    onClick={() => setActiveCompareMode('split')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      activeCompareMode === 'split'
                        ? 'bg-[#2B2B40] text-white border border-[#3E3E5C]'
                        : 'text-[#8E8EA8] hover:text-white'
                    }`}
                  >
                    Full Portrait
                  </button>
                </div>
              </div>

              {/* Comparison Display */}
              {activeCompareMode === 'side-by-side' && uploadedPhoto ? (
                <div className="grid grid-cols-2 gap-3">
                  {/* Present Photo */}
                  <div className="space-y-1.5">
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] border border-[#2D2D42]">
                      <img
                        src={uploadedPhoto}
                        alt="Present Self"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-black/80 text-white">
                        Present • {userProfile.currentWeightKg} kg
                      </span>
                    </div>
                    <div className="text-center text-[11px] text-[#8C8CA0] font-semibold">
                      Your Uploaded Photo
                    </div>
                  </div>

                  {/* Future Self with Real Face */}
                  <div className="space-y-1.5">
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] border-2 border-[#CCFF00]/50 shadow-lg shadow-[#CCFF00]/10">
                      <img
                        src={latestGenerated.imageUrl}
                        alt={latestGenerated.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#CCFF00] text-black">
                        Future • {targetWeight} kg
                      </span>
                      <span className="absolute bottom-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded bg-black/80 text-[#CCFF00]">
                        -{weightDelta.toFixed(1)} kg Toned
                      </span>
                    </div>
                    <div className="text-center text-[11px] text-[#CCFF00] font-bold">
                      Your Real Face on Lean Toned Physique
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] max-h-[500px] w-full mx-auto border border-[#363650]">
                  <img
                    src={latestGenerated.imageUrl}
                    alt={latestGenerated.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-[#CCFF00] text-black tracking-wider">
                      {latestGenerated.badge}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-black/80 text-white border border-white/20">
                      Target: {targetWeight} kg
                    </span>
                  </div>
                </div>
              )}

              {/* Transformation Highlights Verification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-[#191928] p-3 rounded-2xl border border-[#29293C]">
                <div className="flex items-center gap-2 text-[#E0E0EC]">
                  <Check className="w-4 h-4 text-[#CCFF00] shrink-0" />
                  <span>Your eyes, smile & facial identity preserved</span>
                </div>
                <div className="flex items-center gap-2 text-[#E0E0EC]">
                  <Check className="w-4 h-4 text-[#CCFF00] shrink-0" />
                  <span>Your natural skin tone & ethnicity retained</span>
                </div>
                <div className="flex items-center gap-2 text-[#E0E0EC]">
                  <Check className="w-4 h-4 text-[#CCFF00] shrink-0" />
                  <span>Lean waist & athletic posture sculpted</span>
                </div>
                <div className="flex items-center gap-2 text-[#E0E0EC]">
                  <Check className="w-4 h-4 text-[#CCFF00] shrink-0" />
                  <span>Calibrated to {targetWeight} kg goal weight</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveAspirationId(latestGenerated.id);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    activeAspiration.id === latestGenerated.id
                      ? 'bg-[#29293E] text-[#A0A0B8] cursor-default'
                      : 'bg-[#FF3269] hover:bg-[#FF4575] text-white shadow-lg shadow-[#FF3269]/30'
                  }`}
                >
                  {activeAspiration.id === latestGenerated.id ? (
                    <>
                      <Check className="w-4 h-4 text-[#CCFF00]" />
                      <span>Active On Main Dashboard</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#CCFF00]" />
                      <span>Set as Active Dashboard Future Self</span>
                    </>
                  )}
                </button>

                <a
                  href={latestGenerated.imageUrl}
                  download={`cult-future-self-${targetWeight}kg.png`}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#222234] hover:bg-[#2F2F48] text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-[#00E5FF]" />
                  <span>Save Image</span>
                </a>
              </div>
            </div>
          ) : (
            /* Idle Placeholder when no generated image yet */
            <div className="rounded-3xl bg-[#141420] border border-[#252536] p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-[#1D1D2C] text-[#FF3269] flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-athletic text-2xl font-bold text-white">
                  YOUR TRANSFORMATION WILL APPEAR HERE
                </h3>
                <p className="text-xs text-[#8E8EA8] max-w-sm mx-auto">
                  Upload your photo on the left, pick your desired target weight, and watch your future athletic physique come to life using your actual face.
                </p>
              </div>

              {/* Sample Style Previews */}
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A8A9E] mb-3">
                  Available Future Self Archetypes
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {STYLE_OPTIONS.map((style) => (
                    <div
                      key={style.key}
                      onClick={() => handleStyleChange(style.key)}
                      className="rounded-2xl overflow-hidden bg-[#181826] border border-[#2B2B3E] hover:border-[#FF3269] cursor-pointer group transition-all"
                    >
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={style.sampleImg}
                          alt={style.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-2 text-left">
                        <div className="text-[10px] font-extrabold text-[#FF3269] truncate">
                          {style.badge}
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          {style.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
