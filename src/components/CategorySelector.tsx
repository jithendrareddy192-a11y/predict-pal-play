import { Category } from "@/lib/languageModel";

interface CategorySelectorProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  disabled?: boolean;
}

const categories: { value: Category; label: string; emoji: string; description: string }[] = [
  { 
    value: 'nature', 
    label: 'Nature', 
    emoji: '🌿',
    description: 'Trees, weather, animals, seasons'
  },
  { 
    value: 'technology', 
    label: 'Technology', 
    emoji: '💻',
    description: 'Computers, AI, internet, innovation'
  },
  { 
    value: 'emotions', 
    label: 'Emotions', 
    emoji: '❤️',
    description: 'Feelings, mood, relationships'
  },
  { 
    value: 'food', 
    label: 'Food', 
    emoji: '🍕',
    description: 'Meals, ingredients, cooking'
  },
];

const CategorySelector = ({ selectedCategory, onCategoryChange, disabled = false }: CategorySelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-xl">📚</span>
        Choose a topic:
      </label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => !disabled && onCategoryChange(category.value)}
            disabled={disabled}
            className={`
              p-4 rounded-xl border-2 transition-all duration-300
              ${selectedCategory === category.value
                ? 'border-primary bg-gradient-to-br from-primary/20 to-secondary/20 shadow-lg scale-105'
                : 'border-border bg-card hover:border-primary/50 hover:shadow-md hover:scale-102'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-3xl">{category.emoji}</span>
              <span className="font-semibold text-foreground">{category.label}</span>
              <span className="text-xs text-muted-foreground">{category.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
