export const elements = {
  // Frame and container selectors
  appExtensionComponent: ".app-extension-component",
  appExtensionFrame: '[data-testid="app-extension-frame"]',
  stackDetailsWidget: '[data-testid="stack-details-widget"]',

  // Stat card selectors
  statCards: {
    contentTypes: '[data-testid="stat-card-content-types"]',
    entries: '[data-testid="stat-card-entries"]',
    assets: '[data-testid="stat-card-assets"]',
  },

  // Stat count selectors
  statCounts: {
    contentTypes: '[data-testid="stat-count-content-types"]',
    entries: '[data-testid="stat-count-entries"]',
    assets: '[data-testid="stat-count-assets"]',
  },

  // Stat label selectors
  statLabels: {
    contentTypes: '[data-testid="stat-label-content-types"]',
    entries: '[data-testid="stat-label-entries"]',
    assets: '[data-testid="stat-label-assets"]',
  },

  // Footer selectors
  footer: {
    container: '[data-testid="footer-container"]',
    success: '[data-testid="footer-success"]',
    skeletonContainer: '[data-testid="footer-skeleton-container"]',
    lastRefreshed: '[data-testid="last-refreshed"]',
    refreshButton: '[data-testid="refresh-button"]',
  },

  // Skeleton selectors
  skeleton: {
    statCard: '[data-testid="stat-card-skeleton"]',
    footerContainer: '[data-testid="footer-skeleton-container"]',
  },

  // Text content selectors
  text: {
    dataRefreshed: "Data refreshed from Contentstack Management API",
  },

  // Legacy selector (keeping for backward compatibility)
  selectStackSelector: (stackName: string) => `text=${stackName}`,

  // Helper functions for dynamic selectors
  getStatCard: (type: "content-types" | "entries" | "assets") => `[data-testid="stat-card-${type}"]`,
  getStatCount: (type: "content-types" | "entries" | "assets") => `[data-testid="stat-count-${type}"]`,
  getStatLabel: (type: "content-types" | "entries" | "assets") => `[data-testid="stat-label-${type}"]`,
} as const;
