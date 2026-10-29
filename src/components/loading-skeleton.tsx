import type React from "react";
function SkeletonBox({
  className = "",
  delay = 0,
  ...props
}: { delay?: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer rounded ${className}`}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    />
  );
}

function PulseBox({ className = "", delay = 0, ...props }: { delay?: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-muted animate-pulse rounded ${className}`}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div
      className="flex flex-col justify-center items-center self-stretch animate-fade-in py-4 gap-1 flex-1 rounded-lg border border-ui-border-gray w-stat-card h-stat-card"
      data-testid="stat-card-skeleton">
      <SkeletonBox className="w-8 h-8 rounded-lg" />
      <SkeletonBox className="h-6 w-12" delay={100} />
      <PulseBox className="h-3 w-16" delay={200} />
    </div>
  );
}

export function FooterSkeleton() {
  return (
    <div
      className="flex justify-between items-center self-stretch p-4 bg-ui-light-bg border-t border-ui-border-gray"
      data-testid="footer-skeleton-container">
      <SkeletonBox className="h-3 w-48" delay={100} />
      <div className="flex items-center gap-2">
        <SkeletonBox className="h-3 w-24" delay={200} />
        <SkeletonBox className="h-3 w-3 rounded" delay={300} />
      </div>
    </div>
  );
}
