import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StackMetrics } from "./StackMetrics";
import { API_KEY, makeSdk, makeStack, renderWithSdk } from "../test-utils/sdk";

vi.mock("@contentstack/venus-components", () => ({
  Icon: ({ icon }: { icon: string }) => <i data-testid={`icon-${icon}`} />,
}));

let stack: ReturnType<typeof makeStack>;
const clientCtor = vi.fn();
vi.mock("@contentstack/management", () => ({
  client: (opts: unknown) => {
    clientCtor(opts);
    return { stack: vi.fn(async () => stack) };
  },
}));

const count = (type: string) => screen.findByTestId(`stat-count-${type}`);

describe("StackMetrics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_APP_BASE_URL", "https://app.example.test");
  });

  it("shows loading skeletons before the counts arrive", () => {
    stack = makeStack({});
    renderWithSdk(<StackMetrics />, makeSdk());
    expect(screen.getAllByTestId("stat-card-skeleton")).toHaveLength(3);
  });

  it("shows content type, asset and summed entry counts", async () => {
    stack = makeStack({
      contentTypes: { count: 2, items: [{ uid: "a" }, { uid: "b" }] },
      assets: { count: 7 },
      entries: { a: { count: 3 }, b: { count: 4 } },
    });
    renderWithSdk(<StackMetrics />, makeSdk());
    expect(await count("content-types")).toHaveTextContent("2");
    expect(screen.getByTestId("stat-count-entries")).toHaveTextContent("7");
    expect(screen.getByTestId("stat-count-assets")).toHaveTextContent("7");
    expect(screen.getByTestId("footer-success")).toBeInTheDocument();
    expect(screen.getByTestId("last-refreshed").textContent).toMatch(/\d\d:\d\d:\d\d/);
  });

  it("builds the CMA client from the SDK adapter and endpoint", async () => {
    stack = makeStack({ contentTypes: { count: 0, items: [] }, assets: { count: 0 } });
    renderWithSdk(<StackMetrics />, makeSdk());
    await count("assets");
    expect(clientCtor).toHaveBeenCalledWith(expect.objectContaining({ baseURL: "https://cma.example.test/v3" }));
  });

  it("shows zeros for an empty stack", async () => {
    stack = makeStack({ contentTypes: { count: 0, items: [] }, assets: { count: 0 } });
    renderWithSdk(<StackMetrics />, makeSdk());
    for (const t of ["content-types", "entries", "assets"]) expect(await count(t)).toHaveTextContent("0");
  });

  it("treats a missing count as zero", async () => {
    stack = makeStack({ contentTypes: { count: 1, items: [{ uid: "a" }] }, assets: { count: 0 }, entries: { a: {} } });
    renderWithSdk(<StackMetrics />, makeSdk());
    expect(await count("entries")).toHaveTextContent("0");
  });

  it("pages through more than 100 content types", async () => {
    stack = makeStack({
      contentTypes: { count: 150, items: [{ uid: "a" }] },
      assets: { count: 0 },
      entries: { a: { count: 1 } },
    });
    renderWithSdk(<StackMetrics />, makeSdk());
    // two pages of the same fake item, one entry each
    expect(await count("entries")).toHaveTextContent("2");
  });

  it("skips a content type the user cannot read and keeps the rest", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    stack = makeStack({
      contentTypes: { count: 2, items: [{ uid: "a" }, { uid: "b" }] },
      assets: { count: 0 },
      entries: { a: { reject: true }, b: { count: 5 } },
    });
    renderWithSdk(<StackMetrics />, makeSdk());
    expect(await count("entries")).toHaveTextContent("5");
    expect(warn).toHaveBeenCalled();
  });

  it("shows the error state on an API failure and recovers on retry", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    stack = makeStack({ contentTypes: { reject: true } });
    renderWithSdk(<StackMetrics />, makeSdk());
    expect(await screen.findByTestId("error-title")).toHaveTextContent("Unable To Load Stack Data");
    expect(screen.getByTestId("error-message")).toBeInTheDocument();

    stack = makeStack({ contentTypes: { count: 1, items: [] }, assets: { count: 9 } });
    fireEvent.click(screen.getByTestId("link-retry"));
    // retry clears the error and shows loading before the new counts land
    expect(screen.queryByTestId("error-title")).toBeNull();
    expect(screen.getAllByTestId("stat-card-skeleton")).toHaveLength(3);
    expect(await count("assets")).toHaveTextContent("9");
  });

  it("refreshes when the refresh button is clicked", async () => {
    stack = makeStack({ contentTypes: { count: 1, items: [] }, assets: { count: 1 } });
    renderWithSdk(<StackMetrics />, makeSdk());
    await count("assets");
    stack = makeStack({ contentTypes: { count: 1, items: [] }, assets: { count: 6 } });
    fireEvent.click(screen.getByTestId("refresh-button"));
    await waitFor(() => expect(screen.getByTestId("stat-count-assets")).toHaveTextContent("6"));
  });

  it("opens the matching stack page in a new tab when a card is clicked", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    stack = makeStack({ contentTypes: { count: 0, items: [] }, assets: { count: 0 } });
    renderWithSdk(<StackMetrics />, makeSdk());
    await count("assets");
    fireEvent.click(screen.getByTestId("stat-card-content-types"));
    fireEvent.click(screen.getByTestId("stat-card-entries"));
    fireEvent.click(screen.getByTestId("stat-card-assets"));
    const base = `https://app.example.test/#!/stack/${API_KEY}`;
    expect(open.mock.calls).toEqual([
      [`${base}/content-types?branch=main`, "_blank"],
      [`${base}/entries?branch=main`, "_blank"],
      [`${base}/assets?branch=main`, "_blank"],
    ]);
  });

  it("does not open a tab when the stack key is unknown", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    stack = makeStack({ contentTypes: { count: 0, items: [] }, assets: { count: 0 } });
    renderWithSdk(<StackMetrics />, makeSdk({ ids: undefined }));
    // an unknown key makes the stack call fail, which is the error state; cards are not rendered
    expect(await screen.findByTestId("error-title")).toBeInTheDocument();
    expect(open).not.toHaveBeenCalled();
  });

  it("stays on the loading skeleton and makes no API call when no SDK is available", () => {
    stack = makeStack({});
    renderWithSdk(<StackMetrics />, null);
    expect(screen.getAllByTestId("stat-card-skeleton")).toHaveLength(3);
    expect(stack.contentType).not.toHaveBeenCalled();
  });
});
