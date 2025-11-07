interface FeedbackMessageProps {
  isCorrect: boolean;
  aiWord: string;
}

const FeedbackMessage = ({ isCorrect, aiWord }: FeedbackMessageProps) => {
  const correctMessages = [
    { emoji: "😄", text: "Hehe! Great minds think alike" },
    { emoji: "💫", text: "You guessed it right! You're almost reading my mind" },
    { emoji: "🎉", text: "Wow! We're totally in sync" },
    { emoji: "✨", text: "Amazing! You know me so well" },
    { emoji: "🌟", text: "Yes! That's exactly what I was thinking" },
  ];

  const incorrectMessages = [
    { emoji: "🤔", text: `Hmm... I was thinking "${aiWord}"` },
    { emoji: "😊", text: `Close! I had "${aiWord}" in mind` },
    { emoji: "💭", text: `Interesting choice! I thought "${aiWord}"` },
    { emoji: "🎯", text: `Not quite! My prediction was "${aiWord}"` },
  ];

  const messages = isCorrect ? correctMessages : incorrectMessages;
  const message = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl animate-slide-up ${
      isCorrect 
        ? 'bg-gradient-to-r from-accent/20 to-primary/20 border-2 border-accent/40' 
        : 'bg-gradient-to-r from-muted to-card border-2 border-border'
    }`}>
      <span className="text-3xl">{message.emoji}</span>
      <p className="text-foreground font-medium">{message.text}</p>
    </div>
  );
};

export default FeedbackMessage;
