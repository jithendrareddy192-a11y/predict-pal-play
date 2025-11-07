// Simple N-gram language model for word prediction

export type Category = 'nature' | 'technology' | 'emotions' | 'food';

const categoryTrainingData: Record<Category, string> = {
  nature: `
    The sun is shining bright today. The weather is beautiful and warm.
    Nature is healing and therapeutic. The forest is calm and serene.
    Trees are swaying gently in the breeze. The birds are singing melodious songs.
    Mountains are majestic and towering high. The ocean is vast and deep.
    Flowers are blooming colorful and fragrant. The grass is green and lush.
    Rain is falling softly on the ground. The sky is clear and blue.
    Rivers are flowing peacefully downstream. The wind is blowing cool and fresh.
    Stars are twinkling bright at night. The moon is glowing silver and full.
    Seasons are changing naturally every year. Winter is cold and snowy.
    Spring is warm and vibrant always. Summer is hot and sunny.
    Autumn is cool and crisp outdoors. The earth is alive with energy.
    Wildlife is diverse and magnificent everywhere. Animals are roaming free in nature.
    Clouds are drifting slowly across the horizon. The sunset is painting the sky orange.
  `,
  
  technology: `
    Technology is advancing rapidly every day. Innovation is changing our world.
    Computers are becoming faster and smarter. Software is evolving constantly with updates.
    The internet is connecting people globally. Data is the new currency of business.
    Artificial intelligence is learning from patterns. Machines are automating repetitive tasks.
    Smartphones are essential for modern life. Apps are making everything more convenient.
    Cloud computing is revolutionizing data storage. Security is crucial for protecting information.
    Programming is the language of computers. Code is written to solve problems.
    Algorithms are optimizing complex processes daily. Networks are enabling instant communication.
    Digital transformation is reshaping entire industries. Automation is increasing efficiency dramatically.
    Virtual reality is creating immersive experiences now. Robotics is advancing manufacturing capabilities.
    Blockchain is securing transactions transparently online. Quantum computing is pushing computational boundaries.
    5G networks are enabling faster connectivity. Cybersecurity is protecting digital assets constantly.
  `,
  
  emotions: `
    Happiness is found in simple moments. Joy is contagious and spreads easily.
    Love is patient and kind always. Kindness is a powerful force.
    Sadness is a natural human emotion. Grief is part of healing process.
    Anger is expressed when boundaries are crossed. Frustration is common when facing obstacles.
    Fear is protective in dangerous situations. Anxiety is overwhelming at stressful times.
    Excitement is thrilling and energizing completely. Hope is sustaining during difficult times.
    Gratitude is transformative for mental health. Peace is calming and restorative.
    Curiosity is driving exploration and discovery. Wonder is magical and inspiring.
    Confidence is built through small victories. Pride is earned through hard work.
    Empathy is connecting us to others deeply. Compassion is showing care for people.
    Contentment is appreciating what you have. Serenity is finding inner calm daily.
    Trust is foundational for strong relationships. Forgiveness is healing emotional wounds.
  `,
  
  food: `
    Coffee tastes amazing in the morning. Breakfast is the most important meal.
    Pizza is delicious with melted cheese. Pasta is comfort food at its finest.
    Chocolate is sweet and indulgent always. Dessert is the best part of dinner.
    Vegetables are nutritious and healthy choices. Fruits are fresh and naturally sweet.
    Bread is warm and freshly baked daily. Butter is melting on hot toast.
    Soup is warming on cold winter days. Salad is crisp and refreshing always.
    Meat is grilled to juicy perfection. Fish is rich in healthy omega fatty acids.
    Rice is a staple in many cultures. Noodles are slurped with great satisfaction.
    Ice cream is cooling on hot summer days. Cake is moist and perfectly frosted.
    Tea is soothing and calming always. Smoothies are packed with fresh nutrients.
    Cheese is aged and full of flavor. Wine is paired perfectly with meals.
    Spices are adding depth to every dish. Herbs are fresh and aromatic always.
  `
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export class LanguageModel {
  private ngrams: Map<string, Map<string, number>> = new Map();
  private difficulty: Difficulty = 'medium';
  private category: Category = 'nature';

  constructor(difficulty: Difficulty = 'medium', category: Category = 'nature') {
    this.difficulty = difficulty;
    this.category = category;
    this.train(categoryTrainingData[category]);
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  train(text: string): void {
    const words = this.tokenize(text);
    
    for (let i = 0; i < words.length - 1; i++) {
      const currentWord = words[i];
      const nextWord = words[i + 1];
      
      if (!this.ngrams.has(currentWord)) {
        this.ngrams.set(currentWord, new Map());
      }
      
      const nextWords = this.ngrams.get(currentWord)!;
      nextWords.set(nextWord, (nextWords.get(nextWord) || 0) + 1);
    }
  }

  predict(phrase: string): string {
    const words = this.tokenize(phrase);
    if (words.length === 0) return "the";
    
    const lastWord = words[words.length - 1];
    
    if (this.difficulty === 'easy') {
      return this.randomPrediction();
    }
    
    const nextWords = this.ngrams.get(lastWord);
    
    if (!nextWords || nextWords.size === 0) {
      return this.fallbackPrediction();
    }
    
    if (this.difficulty === 'medium') {
      // Pick from top 3 most common next words
      const sorted = Array.from(nextWords.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      
      const randomIndex = Math.floor(Math.random() * sorted.length);
      return sorted[randomIndex][0];
    }
    
    // Hard: Pick most common next word
    let maxCount = 0;
    let prediction = "";
    
    nextWords.forEach((count, word) => {
      if (count > maxCount) {
        maxCount = count;
        prediction = word;
      }
    });
    
    return prediction || this.fallbackPrediction();
  }

  private randomPrediction(): string {
    const commonWords = ['good', 'great', 'beautiful', 'amazing', 'wonderful', 'nice', 'fun', 'happy'];
    return commonWords[Math.floor(Math.random() * commonWords.length)];
  }

  private fallbackPrediction(): string {
    const allNextWords: string[] = [];
    this.ngrams.forEach((nextWords) => {
      nextWords.forEach((_, word) => {
        allNextWords.push(word);
      });
    });
    
    if (allNextWords.length === 0) return "beautiful";
    return allNextWords[Math.floor(Math.random() * allNextWords.length)];
  }

  setDifficulty(difficulty: Difficulty): void {
    this.difficulty = difficulty;
  }

  setCategory(category: Category): void {
    this.category = category;
    // Reset and retrain with new category data
    this.ngrams.clear();
    this.train(categoryTrainingData[category]);
  }

  getCategory(): Category {
    return this.category;
  }

  addUserInput(phrase: string): void {
    this.train(phrase);
  }
}
