const ThinkingDots = () => {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className="text-lg">🤔</span>
      <span className="text-sm">Thinking</span>
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce-subtle" style={{ animationDelay: '0ms' }}></span>
        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce-subtle" style={{ animationDelay: '150ms' }}></span>
        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce-subtle" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  );
};

export default ThinkingDots;
