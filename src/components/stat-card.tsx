import { StatCardData } from "./types/stat-interface";

interface StatCardProps {
  data: StatCardData;
}

export function StatCard({ data }: StatCardProps) {
  const IconComponent = data.icon;

  return (
    <div
      className="flex flex-col justify-center items-center self-stretch cursor-pointer hover:shadow-sm transition-shadow py-4 gap-1 flex-1 rounded-lg border border-ui-border-gray w-stat-card h-stat-card"
      data-testid={`stat-card-${data.type}`}
      onClick={data.onClick}>
      <IconComponent className="w-8 h-8 text-primary" />
      <div
        className="text-stat-count font-semibold text-center font-inter text-brand-dark-text capitalize"
        data-testid={`stat-count-${data.type}`}>
        {data.count}
      </div>
      <div
        className="text-body-p2 font-normal text-center font-inter text-brand-purple-gray"
        data-testid={`stat-label-${data.type}`}>
        {data.label}
      </div>
    </div>
  );
}
