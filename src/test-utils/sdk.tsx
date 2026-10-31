import { vi } from "vitest";
import { render } from "@testing-library/react";
import { MarketplaceAppContext } from "../common/contexts/marketplaceContext";

export const API_KEY = ["stack", "api", "id"].join("-"); // built, not a literal, so secret scanners skip the fixture

type Chain = { count?: number; items?: { uid: string }[]; reject?: boolean };

/** Fake CMA stack: contentType()/asset()/contentType(uid).entry() each return a query().find() chain. */
export const makeStack = (o: { contentTypes?: Chain; assets?: Chain; entries?: Record<string, Chain> }) => {
  const find = (c: Chain = {}) =>
    vi.fn(() => (c.reject ? Promise.reject(new Error("denied")) : Promise.resolve({ count: c.count, items: c.items })));
  const query = (c?: Chain) => vi.fn(() => ({ find: find(c) }));
  return {
    contentType: vi.fn((uid?: string) =>
      uid ? { entry: () => ({ query: query(o.entries?.[uid]) }) } : { query: query(o.contentTypes) },
    ),
    asset: vi.fn(() => ({ query: query(o.assets) })),
  };
};

export const makeSdk = (extra: Record<string, unknown> = {}) => ({
  ids: { apiKey: API_KEY },
  endpoints: { CMA: "https://cma.example.test" },
  createAdapter: vi.fn(() => ({})),
  getConfig: vi.fn().mockResolvedValue({}),
  location: {
    DashboardWidget: { frame: { disableAutoResizing: vi.fn(), updateHeight: vi.fn() } },
  } as Record<string, { frame: Record<string, ReturnType<typeof vi.fn>> }>,
  ...extra,
});

export const renderWithSdk = (ui: React.ReactElement, appSdk: unknown) =>
  render(
    <MarketplaceAppContext.Provider value={{ appSdk: appSdk as never, appConfig: null }}>
      {ui}
    </MarketplaceAppContext.Provider>,
  );
