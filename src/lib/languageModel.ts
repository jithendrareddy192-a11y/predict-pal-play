// Simple N-gram language model for word prediction

const trainingData = `
The sun is shining bright today. The weather is beautiful and warm.
Life is wonderful when you wake up early. The morning is peaceful.
Reading books is a great way to learn. Knowledge is power and wisdom.
Music makes the world a better place. Art is expression of the soul.
Coffee tastes amazing in the morning. Breakfast is the most important meal.
Friends are precious and valuable. Family is everything in life.
Dreams come true with hard work. Success is earned through dedication.
Happiness is found in simple moments. Joy is contagious and spreads easily.
Nature is healing and therapeutic. The forest is calm and serene.
Technology is advancing rapidly every day. Innovation is changing our world.
Love is patient and kind always. Kindness is a powerful force.
Learning is a lifelong journey ahead. Education is the key to success.
Time is precious and fleeting quickly. Moments are meant to be cherished.
Stars are twinkling in the night. The moon is glowing softly tonight.
Adventure is waiting around the corner. Exploration is exciting and thrilling.
`;

export type Difficulty = 'easy' | 'medium' | 'hard';

export class LanguageModel {
  private ngrams: Map<string, Map<string, number>> = new Map();
  private difficulty: Difficulty = 'medium';

  constructor(difficulty: Difficulty = 'medium') {
    this.difficulty = difficulty;
    this.train(trainingData);
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

  addUserInput(phrase: string): void {
    this.train(phrase);
  }
}
