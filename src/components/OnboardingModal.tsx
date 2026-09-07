import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  calculateAge,
  calculateBmr,
  calculateBmi,
  calculateTargetWeight,
  calculateDailyCalorieTarget,
  FUTURE_SELF_ASPIRATIONS
} from '../data/referenceData';
import { Sparkles, ArrowRight, ArrowLeft, Upload, CheckCircle2, Flame, User, AlertCircle, Camera } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { userProfile, updateProfile, setShowOnboarding, logWeight } = useApp();

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>(userProfile.name || '');
  const [dob, setDob] = useState<string>(userProfile.dob || '1998-05-14');
  const [gender] = useState<'female'>('female'); // Phase 1 female scope
  const [heightCm, setHeightCm] = useState<number>(userProfile.heightCm || 165);
  const [weightKg, setWeightKg] = useState<number>(userProfile.currentWeightKg || 65);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(
    userProfile.targetWeightKg || calculateTargetWeight(userProfile.heightCm || 165)
  );
  const [profileImage, setProfileImage] = useState<string>(userProfile.profileImage || '');
  const [activeAspirationId, setActiveAspirationId] = useState<string>(userProfile.activeAspirationId || 'activewear-cult');
  const [error, setError] = useState<string>('');

  // Live calculations
  const age = calculateAge(dob);
  const bmr = calculateBmr(weightKg, heightCm, age, gender);
  const { bmi, category } = calculateBmi(weightKg, heightCm);
  const recommendedTarget = calculateTargetWeight(heightCm);
  const calorieTarget = calculateDailyCalorieTarget(bmr);
  const weightToLose = Math.max(0, weightKg - targetWeightKg);
  const weeksTimeline = Math.ceil(weightToLose / 0.5); // Safe 0.5 kg/week

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    setError('');
    if (step === 2) {
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
      if (heightCm < 100 || heightCm > 230) {
        setError('Please enter a valid height in cm (100 - 230)');
        return;
      }
      if (weightKg < 35 || weightKg > 200) {
        setError('Please enter a valid weight in kg (35 - 200)');
        return;
      }
    }

    if (step === 3) {
      // Photo is optional or can use sample
      if (!profileImage) {
        setError('Please upload your photo or tap "Use Sample Athlete" to proceed');
        return;
      }
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      // Save profile
      updateProfile({
        name,
        dob,
        age,
        gender,
        heightCm,
        currentWeightKg: weightKg,
        targetWeightKg,
        bmr,
        bmi,
        bmiCategory: category,
        dailyCalorieTarget: calorieTarget,
        profileImage,
        uploadedPhoto: profileImage,
        activeAspirationId,
        onboardingCompleted: true
      });
      // Record initial baseline weight
      logWeight(weightKg, new Date().toISOString().split('T')[0], 'Starting baseline weight from onboarding');
      setShowOnboarding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-xl bg-[#12121A] border border-[#262638] rounded-3xl overflow-hidden shadow-2xl my-auto animate-in zoom-in-95 duration-200">
        {/* Progress Header */}
        <div className="px-6 pt-5 pb-3 border-b border-[#1E1E2C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FF3269]/20 text-[#FF3269] flex items-center justify-center font-athletic text-lg font-bold">
              {step}
            </div>
            <span className="text-xs font-bold text-[#8A8A9E] uppercase tracking-wider">
              Step {step} of 4 — {step === 1 ? 'Welcome' : step === 2 ? 'Profile & BMR' : step === 3 ? 'Body Photo' : 'Future Self'}
            </span>
          </div>
          
          <button
            onClick={() => setShowOnboarding(false)}
            className="text-xs text-[#7E7E94] hover:text-white px-2 py-1 rounded-lg hover:bg-[#1E1E2C] transition-colors"
          >
            Close
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: WELCOME & PROPOSITION */}
          {step === 1 && (
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF3269] to-[#FF5500] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#FF3269]/30">
                <Flame className="w-8 h-8 fill-white" />
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#FF3269]/20 text-[#FF3269] border border-[#FF3269]/30 tracking-widest">
                  PHASE 1 PROTOTYPE
                </span>
                <h2 className="font-athletic text-4xl sm:text-5xl font-bold tracking-wide text-white mt-3 leading-none">
                  MEET YOUR FUTURE SELF
                </h2>
                <p className="text-sm text-[#A0A0B5] max-w-md mx-auto mt-2 leading-relaxed">
                  This isn't another passive calorie counter. It's a visual transformation engine designed for women to make your future visible, measurable, and coach-driven.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
                <div className="p-3.5 rounded-2xl bg-[#181824] border border-[#272738]">
                  <div className="text-[#FF3269] text-xs font-extrabold uppercase tracking-wider mb-1">01. Visual Aspiration</div>
                  <div className="text-xs text-[#C5C5D6]">See your desired body in dream dresses, bikini & sports activities.</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#181824] border border-[#272738]">
                  <div className="text-[#CCFF00] text-xs font-extrabold uppercase tracking-wider mb-1">02. Deficit Precision</div>
                  <div className="text-xs text-[#C5C5D6]">Automatic BMR + Activity burn calculation using PRD metric tables.</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#181824] border border-[#272738]">
                  <div className="text-[#00E5FF] text-xs font-extrabold uppercase tracking-wider mb-1">03. Future Self Voice</div>
                  <div className="text-xs text-[#C5C5D6]">Cult-style daily coaching feedback. Zero shame, 100% motivation.</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROFILE & BMR CALCULATION */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-athletic text-3xl font-bold text-white tracking-wide leading-none">
                  YOUR BASELINE METRICS
                </h2>
                <p className="text-xs text-[#8E8EA2] mt-1">
                  We use the Mifflin-St Jeor formula to compute your exact Basal Metabolic Rate and target weight.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#A8A8BF] uppercase tracking-wider mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191924] border border-[#2C2C40] text-white text-sm focus:border-[#FF3269] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8A8BF] uppercase tracking-wider mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191924] border border-[#2C2C40] text-white text-sm focus:border-[#FF3269] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8A8BF] uppercase tracking-wider mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => {
                      const h = Number(e.target.value);
                      setHeightCm(h);
                      setTargetWeightKg(calculateTargetWeight(h));
                    }}
                    min={100}
                    max={220}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191924] border border-[#2C2C40] text-white text-sm focus:border-[#FF3269] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8A8BF] uppercase tracking-wider mb-1">Current Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    min={35}
                    max={200}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191924] border border-[#2C2C40] text-white text-sm focus:border-[#FF3269] outline-hidden"
                  />
                </div>
              </div>

              {/* Real-time Computed BMR Card */}
              <div className="p-4 rounded-2xl bg-[#171724] border border-[#27273A] space-y-3">
                <div className="flex items-center justify-between border-b border-[#252538] pb-2.5">
                  <div>
                    <span className="text-[11px] text-[#8E8EA2] uppercase font-bold tracking-wider">Calculated BMR</span>
                    <div className="font-athletic text-3xl font-bold text-[#FF3269] leading-none">
                      {bmr} <span className="text-xs font-sans text-white font-normal">kcal/day</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-[#8E8EA2] uppercase font-bold tracking-wider">Current BMI</span>
                    <div className="font-athletic text-3xl font-bold text-white leading-none">
                      {bmi}{' '}
                      <span className={`text-xs font-sans font-bold px-1.5 py-0.5 rounded ${
                        category === 'Normal Weight' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-[#8E8EA2]">Target Weight (Ideal BMI 22):</span>{' '}
                    <span className="font-bold text-white">{targetWeightKg} kg</span>
                  </div>
                  <div className="text-[#CCFF00] font-semibold">
                    ~{weeksTimeline} weeks at safe 0.5 kg/wk
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FULL BODY PICTURE UPLOAD */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-athletic text-3xl font-bold text-white tracking-wide leading-none">
                  UPLOAD FULL-BODY PHOTOGRAPH
                </h2>
                <p className="text-xs text-[#8E8EA2] mt-1">
                  Required by PRD: Capture your present baseline to generate your Future Self aspiration.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[#171724] border border-[#272738]">
                <div className="relative w-32 h-44 rounded-xl overflow-hidden bg-[#20202F] border-2 border-dashed border-[#3A3A52] shrink-0 flex items-center justify-center">
                  {profileImage ? (
                    <img src={profileImage} alt="Current Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-[#6A6A82]" />
                  )}
                </div>

                <div className="space-y-2.5 text-center sm:text-left flex-1">
                  <div className="text-sm font-semibold text-white">Select from your device or use sample</div>
                  <p className="text-xs text-[#8A8A9E]">
                    Stored securely and privately in client session. Female user requirement per Phase 1 specification.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FF3269] hover:bg-[#FF4655] text-white text-xs font-bold transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Device Photo</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>

                    <button
                      type="button"
                      onClick={() => setProfileImage('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80')}
                      className="px-3 py-2 rounded-xl bg-[#232334] hover:bg-[#2F2F44] text-xs font-semibold text-white transition-colors"
                    >
                      Use Sample Athlete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: FUTURE SELF ASPIRATION */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-athletic text-3xl font-bold text-white tracking-wide leading-none">
                  CHOOSE YOUR ASPIRATION
                </h2>
                <p className="text-xs text-[#8E8EA2] mt-1">
                  Pick the visual expression of your Future Self. You can switch or browse all 8 in the gallery anytime.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {FUTURE_SELF_ASPIRATIONS.map((asp) => {
                  const isSelected = asp.id === activeAspirationId;
                  return (
                    <div
                      key={asp.id}
                      onClick={() => setActiveAspirationId(asp.id)}
                      className={`cursor-pointer rounded-xl overflow-hidden border transition-all p-1.5 flex flex-col ${
                        isSelected
                          ? 'bg-[#FF3269]/15 border-[#FF3269] ring-2 ring-[#FF3269]/40'
                          : 'bg-[#181824] border-[#29293C] hover:border-[#3E3E58]'
                      }`}
                    >
                      <div className="relative h-24 rounded-lg overflow-hidden bg-black/40">
                        <img src={asp.imageUrl} alt={asp.title} className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 text-[9px] font-extrabold uppercase px-1 py-0.5 rounded bg-black/70 text-[#FF3269] tracking-wider">
                          {asp.badge}
                        </span>
                      </div>
                      <div className="pt-2 pb-1 text-center">
                        <div className="text-xs font-bold text-white truncate">{asp.title}</div>
                        <div className="text-[10px] text-[#8E8EA2] truncate">{asp.tagline}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-[#1E1E2C] bg-[#0E0E15] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#8E8EA2] hover:text-white px-3 py-2 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF3269] to-[#FF5500] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF3269]/30 transition-transform active:scale-95"
          >
            <span>{step === 4 ? 'Complete Onboarding' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
