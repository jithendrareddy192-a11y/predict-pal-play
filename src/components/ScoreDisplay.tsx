interface ScoreDisplayProps {
  score: number;
  rounds: number;
}

const ScoreDisplay = ({ score, rounds }: ScoreDisplayProps) => {
  const percentage = rounds > 0 ? Math.round((score / rounds) * 100) : 0;

  return (
    <div className="flex items-center gap-6 p-4 bg-card rounded-2xl border-2 border-border">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎯</span>
        <div>
          <p className="text-xs text-muted-foreground">Score</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {score}
          </p>
        </div>
      </div>
      
      <div className="h-12 w-px bg-border"></div>
      
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎮</span>
        <div>
          <p className="text-xs text-muted-foreground">Rounds</p>
          <p className="text-2xl font-bold text-foreground">{rounds}</p>
        </div>
      </div>
      
      {rounds > 0 && (
        <>
          <div className="h-12 w-px bg-border"></div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <div>
              <p className="text-xs text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold text-foreground">{percentage}%</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScoreDisplay;
