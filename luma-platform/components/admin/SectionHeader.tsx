import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-primary font-bold">{title}</h2>
        {description && <p className="text-on-surface-variant text-body-md mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
