function SkeletonBox({
  className = "",
  delay = 0,
  ...props
}: {
  className?: string;
  delay?: number;
  [key: string]: any;
}) {
  return (
    <div
      className={`bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer rounded ${className}`}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    />
  );
}

function PulseBox({ className = "", delay = 0, ...props }: { className?: string; delay?: number; [key: string]: any }) {
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

export function WaveStatCardSkeleton() {
  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-sm animate-fade-in">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative w-12 h-12 rounded-lg bg-muted overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-wave" />
        </div>

        <div className="space-y-3 w-full">
          <div className="relative h-8 w-16 mx-auto rounded bg-muted overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-wave"
              style={{ animationDelay: "100ms" }}
            />
          </div>

          <div className="relative h-4 w-20 mx-auto rounded bg-muted overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-wave"
              style={{ animationDelay: "200ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BreathingStatCardSkeleton() {
  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-sm animate-fade-in">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-lg bg-muted animate-breathing" />

        <div className="space-y-3 w-full">
          <div className="h-8 w-16 mx-auto rounded bg-muted animate-breathing" style={{ animationDelay: "75ms" }} />
          <div className="h-4 w-20 mx-auto rounded bg-muted animate-breathing" style={{ animationDelay: "150ms" }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonDemo() {
  return (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-semibold mb-4">Loading Animation Showcase</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Default Shimmer</h4>
          <StatCardSkeleton />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Wave Animation</h4>
          <WaveStatCardSkeleton />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Breathing Effect</h4>
          <BreathingStatCardSkeleton />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Responsive Version</h4>
        <StatCardSkeleton />
      </div>
    </div>
  );
}
