import { render, renderHook, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { MarketplaceAppProvider } from "./providers/MarketplaceAppProvider";
import { useManagementClient } from "./hooks/useManagementClient";
import { useAppSdk } from "./hooks/useAppSdk";
import { MarketplaceAppContext } from "./contexts/marketplaceContext";
import { makeSdk } from "../test-utils/sdk";

vi.mock("@contentstack/app-sdk", () => ({ default: { init: vi.fn() } }));
const clientFn = vi.fn((o: unknown) => ({ opts: o }));
vi.mock("@contentstack/management", () => ({ client: (o: unknown) => clientFn(o) }));

const Show = () => <p>{useAppSdk() ? "has-sdk" : "no-sdk"}</p>;

describe("MarketplaceAppProvider", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows loading, then renders children once the SDK is ready and sizes the widget", async () => {
    const sdk = makeSdk();
    vi.mocked(ContentstackAppSDK.init).mockResolvedValue(sdk as never);
    render(
      <MarketplaceAppProvider>
        <Show />
      </MarketplaceAppProvider>,
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByText("has-sdk")).toBeInTheDocument();
    await waitFor(() => expect(sdk.location.DashboardWidget.frame.updateHeight).toHaveBeenCalledWith(722));
    expect(sdk.getConfig).toHaveBeenCalled();
  });

  it("shows AppFailed when the SDK fails to initialise", async () => {
    vi.mocked(ContentstackAppSDK.init).mockRejectedValue(new Error("outside iframe"));
    render(
      <MarketplaceAppProvider>
        <Show />
      </MarketplaceAppProvider>,
    );
    expect(await screen.findByRole("alert")).toHaveTextContent("loaded outside Contentstack");
  });

  it("does not set state after unmount", async () => {
    let resolve: (v: unknown) => void = () => undefined;
    vi.mocked(ContentstackAppSDK.init).mockReturnValue(new Promise((r) => (resolve = r)) as never);
    const { unmount } = render(
      <MarketplaceAppProvider>
        <Show />
      </MarketplaceAppProvider>,
    );
    unmount();
    resolve(makeSdk());
    await Promise.resolve();
    expect(screen.queryByText("has-sdk")).toBeNull();
  });

  it("does not set state after unmount when init fails", async () => {
    let reject: (e: unknown) => void = () => undefined;
    vi.mocked(ContentstackAppSDK.init).mockReturnValue(new Promise((_, r) => (reject = r)) as never);
    const { unmount } = render(
      <MarketplaceAppProvider>
        <Show />
      </MarketplaceAppProvider>,
    );
    unmount();
    reject(new Error("late"));
    await Promise.resolve();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("exits early when unmounted before getConfig resolves", async () => {
    const sdk = makeSdk();
    let done: (v: unknown) => void = () => undefined;
    sdk.getConfig = vi.fn(() => new Promise((r) => (done = r))) as never;
    vi.mocked(ContentstackAppSDK.init).mockResolvedValue(sdk as never);
    const { unmount } = render(
      <MarketplaceAppProvider>
        <Show />
      </MarketplaceAppProvider>,
    );
    await waitFor(() => expect(sdk.getConfig).toHaveBeenCalled());
    unmount();
    done({});
  });

  it("handles every SDK location frame", async () => {
    const frame = () => ({ disableAutoResizing: vi.fn(), updateHeight: vi.fn(), updateDimension: vi.fn() });
    const sdk = makeSdk({
      location: { CustomField: { frame: frame() }, FieldModifierLocation: { frame: frame() } },
    });
    vi.mocked(ContentstackAppSDK.init).mockResolvedValue(sdk as never);
    render(
      <MarketplaceAppProvider>
        <Show />
      </MarketplaceAppProvider>,
    );
    await waitFor(() =>
      expect(sdk.location.FieldModifierLocation.frame.updateDimension).toHaveBeenCalledWith({
        height: 380,
        width: 520,
      }),
    );
    expect(sdk.location.CustomField.frame.updateHeight).toHaveBeenCalledWith(450);
  });
});

describe("useManagementClient", () => {
  const wrap = (appSdk: unknown) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <MarketplaceAppContext.Provider value={{ appSdk: appSdk as never, appConfig: null }}>
        {children}
      </MarketplaceAppContext.Provider>
    );
    return Wrapper;
  };

  it("is null without an SDK", () => {
    const { result } = renderHook(() => useManagementClient(), { wrapper: wrap(null) });
    expect(result.current).toBeNull();
  });

  it("creates a client on the CMA v3 endpoint", async () => {
    const { result } = renderHook(() => useManagementClient(), { wrapper: wrap(makeSdk()) });
    await waitFor(() => expect(result.current).not.toBeNull());
    expect(clientFn).toHaveBeenCalledWith(expect.objectContaining({ baseURL: "https://cma.example.test/v3" }));
  });

  it("is null and logs when the adapter cannot be created", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const sdk = makeSdk({
      createAdapter: () => {
        throw new Error("no adapter");
      },
    });
    const { result } = renderHook(() => useManagementClient(), { wrapper: wrap(sdk) });
    await waitFor(() => expect(err).toHaveBeenCalled());
    expect(result.current).toBeNull();
  });
});
