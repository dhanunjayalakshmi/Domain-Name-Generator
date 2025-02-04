import { Brain, Sparkles } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Brain className="w-8 h-8 text-white" />
        <Sparkles className="w-4 h-4 text-purple-200 absolute -bottom-1 -right-1 animate-pulse" />
      </div>
      <div className="font-bold text-xl tracking-tight flex items-baseline">
        <span>Site</span>
        <span className="text-purple-200">Name</span>
        <span className="text-purple-200 ml-0.5 text-base bg-white/10 px-1.5 py-0.5 rounded">
          AI
        </span>
      </div>
    </div>
  );
};

export default Logo;
