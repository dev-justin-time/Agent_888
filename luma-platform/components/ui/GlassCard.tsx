import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  /**
   * Corner treatment. `bubble` adds no radius at all, so `.chat-bubble-luma`
   * can supply its asymmetric one.
   */
  shape?: "rounded" | "square" | "pill" | "bubble"
  /** Render as a section to keep landmark semantics for page-level callouts. */
  as?: "div" | "section"
}

const SHAPES = {
  rounded: "rounded-2xl",
  square: "rounded-none",
  pill: "rounded-full",
  bubble: "",
}

export function GlassCard({
  children,
  className = "",
  hover = true,
  shape = "rounded",
  as: Tag = "div",
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "glass-card inner-glow",
        SHAPES[shape],
        hover && "hover:border-primary/30 hover:shadow-[0_0_20px_rgba(78,222,163,0.1)]",
        className
      )}
    >
      {children}
    </Tag>
  )
}
