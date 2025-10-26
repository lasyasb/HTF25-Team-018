import { type LucideProps } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface GlowingIconButtonProps extends ButtonProps {
  icon: React.ComponentType<LucideProps>;
  tooltip: string;
}

export default function GlowingIconButton({
  icon: Icon,
  tooltip,
  className,
  variant,
  ...props
}: GlowingIconButtonProps) {
  const iconColorClass = variant === 'destructive'
      ? 'text-destructive drop-shadow-[0_0_3px_hsl(var(--destructive))]'
      : 'text-accent drop-shadow-[0_0_3px_hsl(var(--accent))]';
  
  const hoverColorClass = variant === 'destructive'
      ? 'hover:text-destructive-foreground hover:bg-destructive/90'
      : 'hover:text-accent-foreground hover:bg-accent/90';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('w-full transition-all duration-300', hoverColorClass, className)}
            {...props}
          >
            <Icon className={cn('h-5 w-5 transition-all', iconColorClass)} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
