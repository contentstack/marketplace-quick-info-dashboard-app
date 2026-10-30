export interface StatCardData {
  type: "content-types" | "entries" | "assets";
  count: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}
