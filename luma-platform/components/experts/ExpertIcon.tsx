import {
  Wallet,
  Scale,
  Briefcase,
  GraduationCap,
  Home,
  ShieldCheck,
  HeartPulse,
  Lightbulb,
} from "lucide-react";

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number | string; className?: string }>
> = {
  wallet: Wallet,
  scale: Scale,
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  home: Home,
  "shield-check": ShieldCheck,
  "heart-pulse": HeartPulse,
  lightbulb: Lightbulb,
};

interface ExpertIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export function ExpertIcon({ icon, size = 20, className }: ExpertIconProps) {
  const Icon = ICON_MAP[icon] ?? Lightbulb;
  return <Icon size={size} className={className} />;
}
