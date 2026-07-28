import { cn } from "@/lib/utils"

interface ChipProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

export function Chip({ children, className = "", active, onClick }: ChipProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 font-label-sm text-xs uppercase tracking-wider transition-colors",
        active
          ? "bg-primary/20 text-primary border border-primary/30"
          : "bg-secondary-container/30 text-secondary border border-secondary-container/50",
        onClick && "cursor-pointer hover:bg-primary/10",
        className
      )}
    >
      {children}
    </span>
  );
}
