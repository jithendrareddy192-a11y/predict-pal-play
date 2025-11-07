import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LanguageModel, Difficulty, Category } from "@/lib/languageModel";
import ThinkingDots from "@/components/ThinkingDots";
import FeedbackMessage from "@/components/FeedbackMessage";
import ScoreDisplay from "@/components/ScoreDisplay";
import CategorySelector from "@/components/CategorySelector";
import HintsPanel from "@/components/HintsPanel";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [category, setCategory] = useState<Category>('nature');
  const [languageModel] = useState(() => new LanguageModel(difficulty, category));
  const [phrase, setPhrase] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [aiPrediction, setAiPrediction] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState({
    firstLetter: false,
    lastLetter: false,
    wordLength: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    languageModel.setDifficulty(difficulty);
  }, [difficulty, languageModel]);

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    languageModel.setCategory(newCategory);
    
    // Reset game state when switching categories during gameplay
    if (gameStarted) {
      setPhrase("");
      setUserGuess("");
      setAiPrediction("");
      setShowResult(false);
      setIsCorrect(false);
      setHintsUsed({ firstLetter: false, lastLetter: false, wordLength: false });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleUseHint = (hintType: 'firstLetter' | 'lastLetter' | 'wordLength') => {
    if (score < 5) {
      toast({
        title: "Not enough points! 😅",
        description: "You need at least 5 points to use a hint.",
        variant: "destructive",
      });
      return;
    }

    if (hintsUsed[hintType]) {
      toast({
        title: "Already used! 🤔",
        description: "You've already revealed this hint.",
      });
      return;
    }

    setScore(prev => prev - 5);
    setHintsUsed(prev => ({ ...prev, [hintType]: true }));

    const hintLabels = {
      firstLetter: '📝 First Letter',
      lastLetter: '📌 Last Letter',
      wordLength: '📏 Word Length',
    };

    toast({
      title: `${hintLabels[hintType]} revealed! ✨`,
      description: "5 points deducted. Use it wisely!",
    });
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handlePredict = () => {
    if (!phrase.trim()) return;

    setIsThinking(true);
    setShowResult(false);

    // Simulate thinking delay
    setTimeout(() => {
      const prediction = languageModel.predict(phrase);
      setAiPrediction(prediction);
      setIsThinking(false);
    }, 1500);
  };

  const handleGuess = () => {
    if (!userGuess.trim() || !aiPrediction) return;

    const correct = userGuess.toLowerCase().trim() === aiPrediction.toLowerCase().trim();
    setIsCorrect(correct);
    setShowResult(true);
    setRounds(prev => prev + 1);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    // Add to training data for learning mode
    languageModel.addUserInput(`${phrase} ${aiPrediction}`);
  };

  const handleNewRound = () => {
    setPhrase("");
    setUserGuess("");
    setAiPrediction("");
    setShowResult(false);
    setIsCorrect(false);
    setHintsUsed({ firstLetter: false, lastLetter: false, wordLength: false });
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleReset = () => {
    setPhrase("");
    setUserGuess("");
    setAiPrediction("");
    setShowResult(false);
    setIsCorrect(false);
    setScore(0);
    setRounds(0);
    setGameStarted(false);
    setHintsUsed({ firstLetter: false, lastLetter: false, wordLength: false });
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 md:p-12 bg-card/95 backdrop-blur-sm border-2 border-border shadow-[0_0_50px_rgba(168,85,247,0.15)] animate-fade-in">
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-6">
              <span className="text-7xl animate-bounce-subtle">🧠</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Word Prediction Game
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Can you guess what I'm thinking? Choose a topic, type a phrase, and I'll predict the next word. 
              See if we're on the same wavelength! 💫
            </p>

            <div className="space-y-6 pt-6">
              <CategorySelector 
                selectedCategory={category}
                onCategoryChange={handleCategoryChange}
              />
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground justify-center mb-3">
                  <span className="text-xl">⚙️</span>
                  Choose difficulty:
                </label>
                <div className="flex justify-center">
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger className="w-48 bg-background border-2 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy 🌱</SelectItem>
                      <SelectItem value="medium">Medium 🌟</SelectItem>
                      <SelectItem value="hard">Hard 🔥</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleStartGame}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground px-8 py-6 text-lg rounded-2xl shadow-lg transition-all hover:scale-105"
              >
                Start Playing! 🎮
              </Button>
            </div>

            <div className="pt-8 space-y-3 text-sm text-muted-foreground">
              <p>💡 <strong>Easy:</strong> Random predictions</p>
              <p>🎯 <strong>Medium:</strong> Smart AI predictions</p>
              <p>🔥 <strong>Hard:</strong> Most likely predictions</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🧠</span>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Word Prediction
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Topic: <span className="font-semibold text-foreground capitalize">{category}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
              <SelectTrigger className="w-36 bg-card border-2 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy 🌱</SelectItem>
                <SelectItem value="medium">Medium 🌟</SelectItem>
                <SelectItem value="hard">Hard 🔥</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="border-2"
            >
              Reset 🔄
            </Button>
          </div>
        </div>

        {/* Score Display */}
        <ScoreDisplay score={score} rounds={rounds} />

        {/* Category Selector */}
        <Card className="p-6 bg-card/95 backdrop-blur-sm border-2 border-border">
          <CategorySelector 
            selectedCategory={category}
            onCategoryChange={handleCategoryChange}
            disabled={isThinking || !!aiPrediction}
          />
        </Card>

        {/* Main Game Card */}
        <Card className="p-6 md:p-8 bg-card/95 backdrop-blur-sm border-2 border-border shadow-[0_0_50px_rgba(168,85,247,0.1)]">
          <div className="space-y-6">
            {/* Step 1: Enter Phrase */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <span className="text-2xl">✍️</span>
                Step 1: Type your phrase
              </label>
              <Input
                ref={inputRef}
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                placeholder="e.g., The sun is..."
                disabled={isThinking || showResult}
                className="text-lg p-6 border-2 border-border focus:border-primary bg-background rounded-xl"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isThinking && !aiPrediction) {
                    handlePredict();
                  }
                }}
              />
              <Button
                onClick={handlePredict}
                disabled={!phrase.trim() || isThinking || !!aiPrediction}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground py-6 rounded-xl text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                Let AI Think! 🤖
              </Button>
            </div>

            {/* Thinking Animation */}
            {isThinking && (
              <div className="flex justify-center py-8">
                <ThinkingDots />
              </div>
            )}

            {/* Hints Panel */}
            {aiPrediction && !showResult && (
              <HintsPanel
                aiPrediction={aiPrediction}
                score={score}
                hintsUsed={hintsUsed}
                onUseHint={handleUseHint}
                disabled={showResult}
              />
            )}

            {/* Step 2: Make Your Guess */}
            {aiPrediction && !showResult && (
              <div className="space-y-3 animate-slide-up">
                <label className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <span className="text-2xl">🎯</span>
                  Step 2: What word do you think I predicted?
                </label>
                <Input
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  placeholder="Type your guess..."
                  className="text-lg p-6 border-2 border-border focus:border-accent bg-background rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && userGuess.trim()) {
                      handleGuess();
                    }
                  }}
                />
                <Button
                  onClick={handleGuess}
                  disabled={!userGuess.trim()}
                  className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 text-accent-foreground py-6 rounded-xl text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
                >
                  Reveal AI's Prediction! ✨
                </Button>
              </div>
            )}

            {/* Result */}
            {showResult && (
              <div className="space-y-4">
                <FeedbackMessage isCorrect={isCorrect} aiWord={aiPrediction} />
                
                <div className="bg-muted/50 p-4 rounded-xl border-2 border-border">
                  <p className="text-center text-foreground">
                    Your phrase: <span className="font-semibold">"{phrase}"</span>
                  </p>
                  <p className="text-center text-foreground">
                    AI predicted: <span className="font-bold text-primary text-xl">"{aiPrediction}"</span>
                  </p>
                  <p className="text-center text-foreground">
                    You guessed: <span className="font-bold text-secondary text-xl">"{userGuess}"</span>
                  </p>
                </div>

                <Button
                  onClick={handleNewRound}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground py-6 rounded-xl text-lg transition-all hover:scale-105"
                >
                  Play Another Round! 🎮
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Tips */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-border">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Strategy Tip:</strong> Use hints wisely! Each hint costs 5 points but can help you guess correctly.</p>
              <p><strong>AI Learning:</strong> The AI learns from your inputs! Each round helps improve predictions.</p>
              <p><strong>Categories:</strong> Switch topics anytime to explore different word patterns!</p>
              {category === 'nature' && <p>Try: "The sun is..." or "Trees are..."</p>}
              {category === 'technology' && <p>Try: "Technology is..." or "Computers are..."</p>}
              {category === 'emotions' && <p>Try: "Happiness is..." or "Love is..."</p>}
              {category === 'food' && <p>Try: "Pizza is..." or "Coffee tastes..."</p>}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
