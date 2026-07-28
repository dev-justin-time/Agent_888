import { TopAppBar } from "./TopAppBar"
import { BottomNav } from "./BottomNav"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface luma-gradient-bg">
      <TopAppBar />
      <main className="pt-24 pb-32 px-container-margin max-w-7xl mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
