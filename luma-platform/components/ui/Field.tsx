import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The sanctuary form-field look, previously copy-pasted into every page.
 * Variants layer their own classes on top via `className`.
 */
export const fieldClasses =
  "w-full bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClasses, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClasses, className)} {...props} />;
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldClasses, className)} {...props} />;
}

/**
 * Pill search field with a leading icon, shared by the filter bars.
 * Padding and text size stay at the call site: they differ per bar, and `cn`
 * does not resolve conflicting utilities (it is a plain join).
 */
export function SearchInput({
  iconSize = 16,
  iconClassName = "left-3",
  wrapperClassName,
  className,
  ...props
}: {
  /** Size of the leading icon. */
  iconSize?: number;
  /** Horizontal placement of the icon, e.g. `left-4` for taller fields. */
  iconClassName?: string;
  wrapperClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <Search
        size={iconSize}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 text-on-surface-variant/50",
          iconClassName
        )}
      />
      <input
        type="text"
        {...props}
        className={cn(
          "w-full pr-4 bg-surface-container/50 border border-white/10 rounded-full text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none",
          className
        )}
      />
    </div>
  );
}
