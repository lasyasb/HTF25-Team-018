import { Rocket } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Rocket className="h-6 w-6 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]" />
      <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
        ResumeAI
      </span>
    </div>
  );
}
