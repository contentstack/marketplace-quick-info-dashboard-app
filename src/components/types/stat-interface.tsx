export interface StackStats {
  contentTypes: number;
  entries: number;
  assets: number;
}

export interface StackDetailsState {
  stats: StackStats | null;
  loading: boolean;
  error: string | null;
}

export interface StatCardData {
  type: "content-types" | "entries" | "assets";
  count: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}
