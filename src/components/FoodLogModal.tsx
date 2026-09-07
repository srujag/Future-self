import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRD_FOOD_ITEMS } from '../data/referenceData';
import { FoodItemReference, FoodEntry } from '../types';
import { X, Search, Plus, Trash2, Check, Flame } from 'lucide-react';

interface FoodLogModalProps {
  onClose: () => void;
  editEntryId?: string;
}

export const FoodLogModal: React.FC<FoodLogModalProps> = ({ onClose, editEntryId }) => {
  const { selectedDate, addFoodEntry, editFoodEntry, deleteFoodEntry, foodEntries } = useApp();

  const existingEntry = editEntryId ? foodEntries.find(f => f.id === editEntryId) : null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<FoodItemReference>(() => {
    if (existingEntry) {
      const match = PRD_FOOD_ITEMS.find(f => f.id === existingEntry.foodItemId);
      if (match) return match;
    }
    return PRD_FOOD_ITEMS[0];
  });
  const [quantityG, setQuantityG] = useState<number>(existingEntry ? existingEntry.quantityG : selectedItem.defaultPortionG || 100);
  const [mealType, setMealType] = useState<FoodEntry['mealType']>(existingEntry ? existingEntry.mealType : 'lunch');

  // Compute live macros
  const factor = quantityG / 100;
  const calculatedCalories = Math.round(selectedItem.caloriesPer100g * factor);
  const calculatedProtein = Math.round(selectedItem.proteinPer100g * factor * 10) / 10;
  const calculatedCarbs = Math.round(selectedItem.carbsPer100g * factor * 10) / 10;
  const calculatedFat = Math.round(selectedItem.fatPer100g * factor * 10) / 10;
  const calculatedFiber = Math.round(selectedItem.fiberPer100g * factor * 10) / 10;

  const filteredItems = PRD_FOOD_ITEMS.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.prep.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingEntry) {
      editFoodEntry(existingEntry.id, {
        foodItemId: selectedItem.id,
        foodName: selectedItem.name,
        quantityG,
        servingLabel: `${quantityG}g`,
        calories: calculatedCalories,
        protein: calculatedProtein,
        carbs: calculatedCarbs,
        fat: calculatedFat,
        fiber: calculatedFiber,
        mealType
      });
    } else {
      addFoodEntry({
        date: selectedDate,
        foodItemId: selectedItem.id,
        foodName: selectedItem.name,
        quantityG,
        servingLabel: `${quantityG}g`,
        calories: calculatedCalories,
        protein: calculatedProtein,
        carbs: calculatedCarbs,
        fat: calculatedFat,
        fiber: calculatedFiber,
        mealType
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-[#13131D] border border-[#252538] rounded-3xl overflow-hidden shadow-2xl my-auto animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#212133] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#FF3269]/20 text-[#FF3269] tracking-wider">
              PRD REFINED NUTRITION TABLE
            </span>
            <h2 className="font-athletic text-2xl font-bold text-white tracking-wide mt-1">
              {existingEntry ? 'EDIT FOOD ENTRY' : 'LOG FOOD & MACROS'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[#1C1C2B] text-[#8E8EA2] hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Meal Type Selection */}
          <div className="grid grid-cols-4 gap-2">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMealType(m)}
                className={`py-2 px-2 text-xs font-bold uppercase rounded-xl border transition-all ${
                  mealType === m
                    ? 'bg-[#FF3269] text-white border-[#FF3269] shadow-md shadow-[#FF3269]/20'
                    : 'bg-[#181826] text-[#8E8EA2] border-[#252538] hover:border-[#3B3B52]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Search Food */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#7A7A92] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search staples, dals, chicken, paneer, dosa, whey..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#191926] border border-[#27273C] text-white text-xs placeholder-[#6B6B82] focus:border-[#FF3269] outline-hidden"
            />
          </div>

          {/* Quick Category Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'staple', 'protein', 'dairy', 'breakfast', 'supplement', 'fruit', 'vegetable'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap text-[11px] capitalize border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/40 font-bold'
                    : 'bg-[#171724] text-[#86869E] border-[#222234] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Food Items List */}
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {filteredItems.map(item => {
              const isSelected = selectedItem.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    if (item.defaultPortionG) setQuantityG(item.defaultPortionG);
                  }}
                  className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#FF3269]/15 border-[#FF3269]'
                      : 'bg-[#181826] border-[#252538] hover:border-[#38384E]'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      {item.name}
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#FF3269]" />}
                    </div>
                    <div className="text-[11px] text-[#88889E]">{item.prep}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-athletic font-bold text-[#CCFF00] tracking-wider">
                      {item.caloriesPer100g} kcal <span className="text-[10px] text-[#88889E] font-sans">/ 100g</span>
                    </div>
                    <div className="text-[10px] text-[#9A9AB0]">
                      P: {item.proteinPer100g}g | C: {item.carbsPer100g}g | F: {item.fatPer100g}g
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Portion & Quantity Slider */}
          <div className="p-3.5 rounded-2xl bg-[#171725] border border-[#27273C] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-[#9E9EB2] uppercase tracking-wider">Serving / Quantity</label>
                <div className="text-xs text-[#6E6E85]">Default: {selectedItem.servingUnit}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={quantityG}
                  onChange={e => setQuantityG(Math.max(1, Number(e.target.value)))}
                  className="w-20 px-2 py-1 text-center font-athletic text-2xl font-bold bg-[#111119] border border-[#2E2E44] rounded-lg text-white focus:border-[#FF3269] outline-hidden"
                />
                <span className="text-xs font-bold text-[#8E8EA2]">grams</span>
              </div>
            </div>

            {/* Quick Portion Presets */}
            <div className="flex gap-2">
              {[50, 100, 150, 200].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setQuantityG(amt)}
                  className={`flex-1 py-1 text-xs rounded-lg border font-semibold ${
                    quantityG === amt ? 'bg-[#FF3269]/20 text-[#FF3269] border-[#FF3269]/40' : 'bg-[#1E1E2C] text-[#8E8EA2] border-[#2A2A3E]'
                  }`}
                >
                  {amt}g
                </button>
              ))}
            </div>

            {/* Calculated Macros Box */}
            <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-[#232336] text-center">
              <div>
                <span className="text-[10px] text-[#8E8EA2] uppercase">Calories</span>
                <div className="font-athletic text-lg font-bold text-[#FF3269]">{calculatedCalories}</div>
              </div>
              <div>
                <span className="text-[10px] text-[#8E8EA2] uppercase">Protein</span>
                <div className="font-athletic text-lg font-bold text-[#CCFF00]">{calculatedProtein}g</div>
              </div>
              <div>
                <span className="text-[10px] text-[#8E8EA2] uppercase">Carbs</span>
                <div className="font-athletic text-lg font-bold text-white">{calculatedCarbs}g</div>
              </div>
              <div>
                <span className="text-[10px] text-[#8E8EA2] uppercase">Fat</span>
                <div className="font-athletic text-lg font-bold text-[#00E5FF]">{calculatedFat}g</div>
              </div>
              <div>
                <span className="text-[10px] text-[#8E8EA2] uppercase">Fiber</span>
                <div className="font-athletic text-lg font-bold text-[#9D71FF]">{calculatedFiber}g</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            {existingEntry ? (
              <button
                type="button"
                onClick={() => {
                  deleteFoodEntry(existingEntry.id);
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
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF3269] to-[#FF5500] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF3269]/30"
              >
                <Plus className="w-4 h-4" />
                <span>{existingEntry ? 'Update Entry' : 'Log Food'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
