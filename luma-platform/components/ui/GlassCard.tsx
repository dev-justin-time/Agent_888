import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = "", hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card inner-glow rounded-2xl",
        hover && "hover:border-primary/30 hover:shadow-[0_0_20px_rgba(78,222,163,0.1)]",
        className
      )}
    >
      {children}
    </div>
  );
}
