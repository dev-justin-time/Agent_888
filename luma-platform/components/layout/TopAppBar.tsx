import Link from "next/link"
import { Settings } from "lucide-react"

export function TopAppBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 h-16">
      <div className="flex items-center justify-between px-container-margin h-full max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 bg-surface-container flex items-center justify-center">
            <span className="text-primary font-bold font-headline-md">L</span>
          </div>
          <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-primary">
            LumaNation
          </h1>
        </Link>
        <button
          aria-label="Settings"
          className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 duration-200 p-2 rounded-full hover:bg-surface-container-high"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}
