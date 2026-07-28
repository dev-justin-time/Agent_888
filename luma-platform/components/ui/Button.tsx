import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-headline-md text-sm font-medium transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-gradient-to-r from-primary to-inverse-primary text-on-primary shadow-lg shadow-primary/20 hover:shadow-[0_0_20px_rgba(78,222,163,0.3)]",
        variant === "secondary" &&
          "bg-secondary-container/50 text-on-secondary-container hover:bg-secondary-container/70",
        variant === "outline" &&
          "border border-primary/30 text-primary hover:bg-primary/5",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
