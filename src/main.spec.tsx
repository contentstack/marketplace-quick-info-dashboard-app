import ContentstackAppSDK from "@contentstack/app-sdk";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeSdk, makeStack } from "./test-utils/sdk";

vi.mock("@contentstack/app-sdk", () => ({ default: { init: vi.fn() } }));
vi.mock("@contentstack/venus-components", () => ({ Icon: () => null }));
vi.mock("@contentstack/management", () => ({
  client: () => ({ stack: async () => makeStack({ contentTypes: { count: 3, items: [] }, assets: { count: 5 } }) }),
}));

// The manifest serves the widget at /stack-dashboard (BrowserRouter), so the real entry must render the dashboard there.
describe("entry", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.mocked(ContentstackAppSDK.init).mockResolvedValue(makeSdk() as never);
    document.body.innerHTML = '<div id="root"></div>';
  });

  it("renders the stack dashboard at /stack-dashboard", async () => {
    window.history.pushState({}, "", "/stack-dashboard");
    await import("./main");
    await vi.waitFor(() => expect(document.querySelector('[data-testid="stat-count-assets"]')?.textContent).toBe("5"));
    expect(document.querySelector('[data-testid="stat-count-content-types"]')?.textContent).toBe("3");
  });

  it("renders the 404 page at an unknown path", async () => {
    window.history.pushState({}, "", "/nope");
    await import("./main");
    await vi.waitFor(() => expect(document.body.textContent).toContain("404: Not Found"));
  });

  it("renders the default page at /", async () => {
    window.history.pushState({}, "", "/");
    await import("./main");
    await vi.waitFor(() =>
      expect(document.body.textContent).toContain("Welcome to the Marketplace Quick Info Dashboard"),
    );
  });
});
