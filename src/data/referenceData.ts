import { FoodItemReference, FutureSelfAspiration } from '../types';

export const PRD_FOOD_ITEMS: FoodItemReference[] = [
  {
    id: 'white-rice',
    name: 'White Rice',
    prep: 'Cooked, plain',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28,
    fatPer100g: 0.3,
    fiberPer100g: 0.4,
    category: 'staple',
    defaultPortionG: 150
  },
  {
    id: 'brown-rice',
    name: 'Brown Rice',
    prep: 'Cooked, plain',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 111,
    proteinPer100g: 2.6,
    carbsPer100g: 23,
    fatPer100g: 0.9,
    fiberPer100g: 1.8,
    category: 'staple',
    defaultPortionG: 150
  },
  {
    id: 'roti-chapati',
    name: 'Roti / Chapati',
    prep: 'Whole wheat (cooked)',
    servingUnit: '100g (approx. 2.5 rotis)',
    servingWeightG: 100,
    caloriesPer100g: 260,
    proteinPer100g: 9,
    carbsPer100g: 45,
    fatPer100g: 3.5,
    fiberPer100g: 9,
    category: 'staple',
    defaultPortionG: 80
  },
  {
    id: 'dal-tadka',
    name: 'Dal Tadka',
    prep: 'Yellow lentils (cooked)',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 100,
    proteinPer100g: 5,
    carbsPer100g: 14,
    fatPer100g: 3.5,
    fiberPer100g: 3.5,
    category: 'dal' as any,
    defaultPortionG: 150
  },
  {
    id: 'rajma-curry',
    name: 'Rajma Curry',
    prep: 'Kidney beans (cooked)',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 130,
    proteinPer100g: 8.5,
    carbsPer100g: 20,
    fatPer100g: 3,
    fiberPer100g: 6,
    category: 'dal' as any,
    defaultPortionG: 150
  },
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    prep: 'Cooked, plain (grilled/boiled)',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6,
    fiberPer100g: 0,
    category: 'protein',
    defaultPortionG: 150
  },
  {
    id: 'chicken-curry',
    name: 'Chicken Curry',
    prep: 'Standard gravy preparation',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 180,
    proteinPer100g: 18,
    carbsPer100g: 4,
    fatPer100g: 10,
    fiberPer100g: 0.8,
    category: 'protein',
    defaultPortionG: 180
  },
  {
    id: 'paneer-raw',
    name: 'Paneer',
    prep: 'Raw, full-fat',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 265,
    proteinPer100g: 18,
    carbsPer100g: 3,
    fatPer100g: 20,
    fiberPer100g: 0,
    category: 'dairy',
    defaultPortionG: 100
  },
  {
    id: 'eggs-boiled',
    name: 'Eggs (Boiled Whole)',
    prep: 'Boiled (whole, ~2 large)',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 155,
    proteinPer100g: 12.6,
    carbsPer100g: 1.1,
    fatPer100g: 10.6,
    fiberPer100g: 0,
    category: 'protein',
    defaultPortionG: 100
  },
  {
    id: 'mixed-veg-sabzi',
    name: 'Mixed Veg Sabzi',
    prep: 'Dry/semi-gravy, cooked',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 70,
    proteinPer100g: 2.5,
    carbsPer100g: 10,
    fatPer100g: 3,
    fiberPer100g: 2.5,
    category: 'vegetable',
    defaultPortionG: 150
  },
  {
    id: 'aloo-gobi',
    name: 'Aloo Gobi',
    prep: 'Cooked dry sabzi',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 90,
    proteinPer100g: 2,
    carbsPer100g: 12,
    fatPer100g: 4,
    fiberPer100g: 2.8,
    category: 'vegetable',
    defaultPortionG: 120
  },
  {
    id: 'guava',
    name: 'Guava',
    prep: 'Fresh, raw',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 68,
    proteinPer100g: 2.6,
    carbsPer100g: 14,
    fatPer100g: 1,
    fiberPer100g: 5.4,
    category: 'fruit',
    defaultPortionG: 120
  },
  {
    id: 'curd-dahi',
    name: 'Curd / Dahi',
    prep: 'Plain, full-cream milk',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 60,
    proteinPer100g: 3.5,
    carbsPer100g: 4.7,
    fatPer100g: 3.3,
    fiberPer100g: 0,
    category: 'dairy',
    defaultPortionG: 150
  },
  {
    id: 'idli',
    name: 'Idli',
    prep: 'Steamed (Rice & Urad Dal)',
    servingUnit: '100g (~2 standard idlis)',
    servingWeightG: 100,
    caloriesPer100g: 130,
    proteinPer100g: 4,
    carbsPer100g: 27,
    fatPer100g: 0.5,
    fiberPer100g: 1.5,
    category: 'breakfast',
    defaultPortionG: 100
  },
  {
    id: 'plain-dosa',
    name: 'Plain Dosa',
    prep: 'Pan-cooked, minimal oil',
    servingUnit: '100g (~1 standard dosa)',
    servingWeightG: 100,
    caloriesPer100g: 220,
    proteinPer100g: 5.5,
    carbsPer100g: 35,
    fatPer100g: 6,
    fiberPer100g: 2,
    category: 'breakfast',
    defaultPortionG: 120
  },
  {
    id: 'masala-dosa',
    name: 'Masala Dosa',
    prep: 'With spiced potato filling',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 185,
    proteinPer100g: 4,
    carbsPer100g: 28,
    fatPer100g: 6.5,
    fiberPer100g: 2.5,
    category: 'breakfast',
    defaultPortionG: 150
  },
  {
    id: 'upma',
    name: 'Upma',
    prep: 'Cooked Rava / Semolina',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 160,
    proteinPer100g: 3.5,
    carbsPer100g: 25,
    fatPer100g: 5,
    fiberPer100g: 2,
    category: 'breakfast',
    defaultPortionG: 150
  },
  {
    id: 'poha',
    name: 'Poha',
    prep: 'Flattened rice with peanuts & veggies',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 180,
    proteinPer100g: 3.5,
    carbsPer100g: 32,
    fatPer100g: 4.5,
    fiberPer100g: 2.2,
    category: 'breakfast',
    defaultPortionG: 150
  },
  {
    id: 'aloo-paratha',
    name: 'Aloo Paratha',
    prep: 'Whole wheat with potato filling, 1 tsp ghee',
    servingUnit: '100g (~1 paratha)',
    servingWeightG: 100,
    caloriesPer100g: 240,
    proteinPer100g: 5.5,
    carbsPer100g: 38,
    fatPer100g: 7.5,
    fiberPer100g: 4.5,
    category: 'breakfast',
    defaultPortionG: 120
  },
  {
    id: 'sambar',
    name: 'Sambar',
    prep: 'Lentil-vegetable stew',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 60,
    proteinPer100g: 2.8,
    carbsPer100g: 9,
    fatPer100g: 1.5,
    fiberPer100g: 2.5,
    category: 'dal' as any,
    defaultPortionG: 180
  },
  {
    id: 'coconut-chutney',
    name: 'Coconut Chutney',
    prep: 'Fresh coconut & chana dal paste',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 220,
    proteinPer100g: 2.5,
    carbsPer100g: 6,
    fatPer100g: 21,
    fiberPer100g: 3.5,
    category: 'staple',
    defaultPortionG: 40
  },
  {
    id: 'banana',
    name: 'Banana',
    prep: 'Raw, peeled',
    servingUnit: '100g (~1 medium)',
    servingWeightG: 100,
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 22.8,
    fatPer100g: 0.3,
    fiberPer100g: 2.6,
    category: 'fruit',
    defaultPortionG: 100
  },
  {
    id: 'mango',
    name: 'Mango',
    prep: 'Raw, sliced',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 60,
    proteinPer100g: 0.8,
    carbsPer100g: 15,
    fatPer100g: 0.4,
    fiberPer100g: 1.6,
    category: 'fruit',
    defaultPortionG: 150
  },
  {
    id: 'papaya',
    name: 'Papaya',
    prep: 'Fresh, raw chunks',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 43,
    proteinPer100g: 0.5,
    carbsPer100g: 10.8,
    fatPer100g: 0.3,
    fiberPer100g: 1.7,
    category: 'fruit',
    defaultPortionG: 150
  },
  {
    id: 'apple',
    name: 'Apple',
    prep: 'Fresh, with skin',
    servingUnit: '100g (~1 small)',
    servingWeightG: 100,
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    carbsPer100g: 13.8,
    fatPer100g: 0.2,
    fiberPer100g: 2.4,
    category: 'fruit',
    defaultPortionG: 130
  },
  {
    id: 'pomegranate',
    name: 'Pomegranate',
    prep: 'Fresh seeds (arils)',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 83,
    proteinPer100g: 1.7,
    carbsPer100g: 18.7,
    fatPer100g: 1.2,
    fiberPer100g: 4,
    category: 'fruit',
    defaultPortionG: 100
  },
  {
    id: 'whey-concentrate',
    name: 'Whey Concentrate Powder',
    prep: '1 Scoop (~33g) or 100g',
    servingUnit: '1 Scoop (~33g)',
    servingWeightG: 33,
    caloriesPer100g: 400,
    proteinPer100g: 75,
    carbsPer100g: 8,
    fatPer100g: 7,
    fiberPer100g: 0,
    category: 'supplement',
    defaultPortionG: 33
  },
  {
    id: 'whey-isolate',
    name: 'Whey Isolate Powder',
    prep: '1 Scoop (~30g) or 100g',
    servingUnit: '1 Scoop (~30g)',
    servingWeightG: 30,
    caloriesPer100g: 370,
    proteinPer100g: 88,
    carbsPer100g: 2,
    fatPer100g: 1,
    fiberPer100g: 0,
    category: 'supplement',
    defaultPortionG: 30
  },
  {
    id: 'plant-protein',
    name: 'Plant Protein (Pea + Rice blend)',
    prep: '1 Scoop (~33g) or 100g',
    servingUnit: '1 Scoop (~33g)',
    servingWeightG: 33,
    caloriesPer100g: 380,
    proteinPer100g: 75,
    carbsPer100g: 10,
    fatPer100g: 4.5,
    fiberPer100g: 4.5,
    category: 'supplement',
    defaultPortionG: 33
  },
  {
    id: 'casein-protein',
    name: 'Casein Protein Powder',
    prep: '1 Scoop (~32g) or 100g',
    servingUnit: '1 Scoop (~32g)',
    servingWeightG: 32,
    caloriesPer100g: 360,
    proteinPer100g: 78,
    carbsPer100g: 4,
    fatPer100g: 1.5,
    fiberPer100g: 0,
    category: 'supplement',
    defaultPortionG: 32
  },
  {
    id: 'mass-gainer',
    name: 'Mass Gainer Powder',
    prep: 'Per 100g serving',
    servingUnit: '100g',
    servingWeightG: 100,
    caloriesPer100g: 380,
    proteinPer100g: 20,
    carbsPer100g: 70,
    fatPer100g: 2.5,
    fiberPer100g: 2,
    category: 'supplement',
    defaultPortionG: 100
  }
];

// Activity Reference Table as per PRD
export interface ActivityMetRow {
  type: string;
  name: string;
  description: string;
  iconName: string;
  rates: { [weightKg: number]: number };
}

export const PRD_ACTIVITY_TABLE: ActivityMetRow[] = [
  {
    type: 'walking',
    name: 'Walking (Brisk, ~5 km/h)',
    description: 'Outdoor brisk walk or treadmill incline',
    iconName: 'Footprints',
    rates: {
      50: 175,
      55: 193,
      60: 210,
      65: 228,
      70: 245,
      75: 263,
      80: 280,
      85: 298,
      90: 315
    }
  },
  {
    type: 'swimming',
    name: 'Swimming (Moderate Lap)',
    description: 'Freestyle, breaststroke laps',
    iconName: 'Waves',
    rates: {
      50: 290,
      55: 319,
      60: 348,
      65: 377,
      70: 406,
      75: 435,
      80: 464,
      85: 493,
      90: 522
    }
  },
  {
    type: 'badminton',
    name: 'Badminton (Competitive / Casual)',
    description: 'Rally drills, court matches',
    iconName: 'Zap',
    rates: {
      50: 225,
      55: 248,
      60: 270,
      65: 293,
      70: 315,
      75: 338,
      80: 360,
      85: 383,
      90: 405
    }
  },
  {
    type: 'running',
    name: 'Running (Moderate, ~8 km/h)',
    description: 'Steady road run or cult cardio',
    iconName: 'Flame',
    rates: {
      50: 415,
      55: 457,
      60: 498,
      65: 540,
      70: 581,
      75: 623,
      80: 664,
      85: 706,
      90: 747
    }
  },
  {
    type: 'pickleball',
    name: 'Pickleball (Casual to Moderate)',
    description: 'Court play, agility drills',
    iconName: 'Activity',
    rates: {
      50: 200,
      55: 220,
      60: 240,
      65: 260,
      70: 280,
      75: 300,
      80: 320,
      85: 340,
      90: 360
    }
  }
];

export function calculateEstimatedCalories(activityType: string, durationMinutes: number, bodyWeightKg: number): number {
  const activity = PRD_ACTIVITY_TABLE.find(a => a.type === activityType) || PRD_ACTIVITY_TABLE[0];
  const weights = [50, 55, 60, 65, 70, 75, 80, 85, 90];
  
  // Clamp weight between 45 and 110 for smooth extrapolation
  const clampedWeight = Math.max(45, Math.min(110, bodyWeightKg));
  
  let ratePerHour: number;
  if (clampedWeight <= 50) {
    ratePerHour = activity.rates[50] * (clampedWeight / 50);
  } else if (clampedWeight >= 90) {
    ratePerHour = activity.rates[90] * (clampedWeight / 90);
  } else {
    // Linear interpolation
    let lowerWeight = 50;
    let upperWeight = 55;
    for (let i = 0; i < weights.length - 1; i++) {
      if (clampedWeight >= weights[i] && clampedWeight <= weights[i + 1]) {
        lowerWeight = weights[i];
        upperWeight = weights[i + 1];
        break;
      }
    }
    const t = (clampedWeight - lowerWeight) / (upperWeight - lowerWeight);
    ratePerHour = activity.rates[lowerWeight] + t * (activity.rates[upperWeight] - activity.rates[lowerWeight]);
  }

  const total = Math.round((ratePerHour / 60) * durationMinutes);
  return Math.max(10, total);
}

// Future Self Aspirations (Visual representations per PRD)
export const FUTURE_SELF_ASPIRATIONS: FutureSelfAspiration[] = [
  {
    id: 'activewear-cult',
    category: 'dress',
    title: 'High-Performance Activewear',
    tagline: 'Sculpted, confident and empowered',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    badge: 'ATHLETIC CORE',
    description: 'Toned midriff, athletic posture in Cult signature performance apparel.'
  },
  {
    id: 'short-summer-dress',
    category: 'dress',
    title: 'Short Summer Linen Dress',
    tagline: 'Sun-drenched, carefree silhouette',
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    badge: 'SUMMER CHIC',
    description: 'Lightweight linen dress floating gracefully with defined collarbones and toned legs.'
  },
  {
    id: 'short-party-dress',
    category: 'dress',
    title: 'Little Black Party Dress',
    tagline: 'Evening elegance with razor-sharp contours',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    badge: 'EVENING GLAM',
    description: 'Sleek, body-contouring evening cocktail dress radiating magnetic confidence.'
  },
  {
    id: 'mirror-selfie',
    category: 'picture',
    title: 'Post-Workout Mirror Glow',
    tagline: 'The proof of your daily discipline',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
    badge: 'GYM SELFIE',
    description: 'Real daily mirror snapshot showing defined abs, glowing skin, and radiant energy.'
  },
  {
    id: 'bikini-beach',
    category: 'picture',
    title: 'Bikini Beach Silhouette',
    tagline: 'Golden hour coastline freedom',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    badge: 'BEACH CONFIDENCE',
    description: 'Stepping into crystal ocean waves without a second thought about your body.'
  },
  {
    id: 'free-diving',
    category: 'activity',
    title: 'Ocean Free Diving',
    tagline: 'Deep blue serenity & supreme lung capacity',
    imageUrl: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80',
    badge: 'EXTREME ENDURANCE',
    description: 'Gliding weightlessly into 20m depth with a calm heart rate and agile physique.'
  },
  {
    id: 'skateboarding',
    category: 'activity',
    title: 'Sunset Skateboarding',
    tagline: 'Agility, balance and effortless street style',
    imageUrl: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=800&q=80',
    badge: 'STREET AGILITY',
    description: 'Carving corners on the boardwalk with supreme core stability and explosive power.'
  },
  {
    id: 'road-cycling',
    category: 'activity',
    title: 'Alpine Road Cycling',
    tagline: 'Conquering steep climbs with relentless stamina',
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=80',
    badge: 'CARDIO BEAST',
    description: 'Powering up scenic mountain switchbacks with high lactate threshold and endurance.'
  }
];

// Calculation Helpers
export function calculateAge(dobString: string): number {
  if (!dobString) return 26;
  const dob = new Date(dobString);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970) || 26;
}

export function calculateBmr(weightKg: number, heightCm: number, age: number, gender: 'female' | 'male' = 'female'): number {
  // Mifflin-St Jeor equation:
  // For women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
  // For men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
  if (gender === 'female') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
}

export function calculateBmi(weightKg: number, heightCm: number): { bmi: number; category: 'Underweight' | 'Normal Weight' | 'Overweight' | 'Obese' } {
  const heightM = heightCm / 100;
  if (heightM <= 0) return { bmi: 22, category: 'Normal Weight' };
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));
  let category: 'Underweight' | 'Normal Weight' | 'Overweight' | 'Obese' = 'Normal Weight';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal Weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  return { bmi, category };
}

export function calculateTargetWeight(heightCm: number): number {
  // Midpoint of healthy BMI (22.0)
  const heightM = heightCm / 100;
  return Math.round(22 * heightM * heightM);
}

export function calculateDailyCalorieTarget(bmr: number, goalDeficit = 300): number {
  // Safe sustainable daily deficit intake target (usually BMR * 1.2 maintenance - 300 to 500 kcal)
  const maintenance = Math.round(bmr * 1.25);
  return Math.max(1200, maintenance - goalDeficit);
}
