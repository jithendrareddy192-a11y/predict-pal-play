import { Button } from "@/components/ui/button";

interface HintsPanelProps {
  aiPrediction: string;
  score: number;
  hintsUsed: {
    firstLetter: boolean;
    lastLetter: boolean;
    wordLength: boolean;
  };
  onUseHint: (hintType: 'firstLetter' | 'lastLetter' | 'wordLength') => void;
  disabled?: boolean;
}

const HintsPanel = ({ aiPrediction, score, hintsUsed, onUseHint, disabled = false }: HintsPanelProps) => {
  const canAffordHint = score >= 5;
  const wordLength = aiPrediction.length;
  const firstLetter = aiPrediction[0]?.toUpperCase() || '';
  const lastLetter = aiPrediction[aiPrediction.length - 1]?.toUpperCase() || '';

  const hints = [
    {
      type: 'firstLetter' as const,
      emoji: '📝',
      label: 'First Letter',
      value: firstLetter,
      used: hintsUsed.firstLetter,
    },
    {
      type: 'lastLetter' as const,
      emoji: '📌',
      label: 'Last Letter',
      value: lastLetter,
      used: hintsUsed.lastLetter,
    },
    {
      type: 'wordLength' as const,
      emoji: '📏',
      label: 'Word Length',
      value: `${wordLength} letters`,
      used: hintsUsed.wordLength,
    },
  ];

  return (
    <div className="space-y-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="text-2xl">💡</span>
          Need a hint?
        </label>
        <span className="text-sm text-muted-foreground">
          5 points each
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {hints.map((hint) => (
          <div
            key={hint.type}
            className={`
              p-4 rounded-xl border-2 transition-all duration-300
              ${hint.used
                ? 'border-accent bg-gradient-to-br from-accent/20 to-primary/10'
                : 'border-border bg-card'
              }
            `}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-2xl">{hint.emoji}</span>
              <span className="text-sm font-semibold text-foreground">
                {hint.label}
              </span>
              
              {hint.used ? (
                <div className="mt-2 px-4 py-2 bg-primary/20 rounded-lg border border-primary/40">
                  <span className="text-lg font-bold text-primary">
                    {hint.value}
                  </span>
                </div>
              ) : (
                <Button
                  onClick={() => onUseHint(hint.type)}
                  disabled={disabled || !canAffordHint}
                  size="sm"
                  className="mt-2 bg-gradient-to-r from-accent to-primary hover:opacity-90 text-accent-foreground transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
                >
                  {canAffordHint ? 'Use (-5)' : 'Need 5 pts'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!canAffordHint && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border">
          <span className="text-lg">ℹ️</span>
          <p>You need at least 5 points to use a hint. Keep playing to earn more!</p>
        </div>
      )}
    </div>
  );
};

export default HintsPanel;
