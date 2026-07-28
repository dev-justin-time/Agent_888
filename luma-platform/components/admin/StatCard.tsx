import { GlassCard } from "@/components/ui/GlassCard";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <GlassCard className="p-5 flex items-center gap-4">
      {icon && <div className="text-primary">{icon}</div>}
      <div>
        <p className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">{label}</p>
        <p className="text-headline-md font-headline-md text-on-surface mt-1">{value}</p>
      </div>
    </GlassCard>
  );
}
