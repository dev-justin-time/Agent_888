"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, MapPin, Users, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

const icons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  navigate: MessageCircle,
  resources: MapPin,
  community: Users,
  stewardship: Briefcase,
};

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex justify-around items-center h-16 px-gutter w-[calc(100%-48px)] max-w-md bg-surface-container/60 backdrop-blur-2xl border border-white/10 shadow-xl shadow-[rgba(3,18,14,0.4)] rounded-full">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = icons[item.id];

        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center transition-colors duration-200 active:scale-90",
              isActive ? "text-primary" : "text-on-surface-variant/60 hover:text-primary/80"
            )}
          >
            <Icon size={22} className={cn(isActive && "fill-current")} />
            <span className="font-label-sm text-label-sm mt-1">{item.label}</span>
            {isActive && <span className="w-1 h-1 bg-primary rounded-full mt-1" />}
          </Link>
        );
      })}
    </nav>
  );
}
