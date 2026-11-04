import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/** Inline error line used under forms and lists. */
export function ErrorAlert({
  message,
  className,
}: {
  message?: string | null;
  className?: string;
}) {
  if (!message) return null;

  return (
    <div className={cn("flex items-center gap-2 text-error text-sm", className)}>
      <AlertCircle size={16} />
      {message}
    </div>
  );
}

/** Pulsing placeholder shown while a page's data loads. */
export function LoadingState({ text = "Loading..." }: { text?: string }) {
  return <div className="text-center text-on-surface-variant animate-pulse py-12">{text}</div>;
}

/** Shown when a signed-in user lacks the required role. */
export function AccessDenied({
  message = "You do not have permission to view this page.",
}: {
  message?: string;
}) {
  return <div className="text-center text-error py-12">{message}</div>;
}
