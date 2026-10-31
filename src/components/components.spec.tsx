import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppFailed } from "./AppFailed";
import { ErrorBoundary } from "./ErrorBoundary";
import { StatCard } from "./stat-card";
import { FooterSkeleton, StatCardSkeleton } from "./loading-skeleton";
import { AssetsIcon, ContentModelIcon, EntriesIcon } from "./ui/StackIcons";
import PageNotFound from "../containers/404/404";
import DefaultPage from "../containers";

describe("AppFailed", () => {
  it("tells the user the app was opened outside Contentstack and opens the docs", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<AppFailed />);
    expect(screen.getByRole("alert")).toHaveTextContent("loaded outside Contentstack");
    fireEvent.click(screen.getByRole("button"));
    expect(open).toHaveBeenCalledWith(expect.stringContaining("contentstack.com"), "_blank");
  });
});

describe("ErrorBoundary", () => {
  const Boom = () => {
    throw new Error("boom");
  };

  it("renders children when nothing throws", () => {
    render(
      <ErrorBoundary>
        <p>ok</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText("ok")).toBeInTheDocument();
  });

  it("renders the fallback when a child throws", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });
});

describe("StatCard", () => {
  it("shows the count and label and calls onClick", () => {
    const onClick = vi.fn();
    render(<StatCard data={{ type: "assets", count: 4, label: "Assets", icon: AssetsIcon, onClick }} />);
    expect(screen.getByTestId("stat-count-assets")).toHaveTextContent("4");
    expect(screen.getByTestId("stat-label-assets")).toHaveTextContent("Assets");
    fireEvent.click(screen.getByTestId("stat-card-assets"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("static pieces", () => {
  it("renders skeletons and icons", () => {
    const { container } = render(
      <>
        <StatCardSkeleton />
        <FooterSkeleton />
        <ContentModelIcon />
        <EntriesIcon />
        <AssetsIcon />
      </>,
    );
    expect(screen.getByTestId("stat-card-skeleton")).toBeInTheDocument();
    expect(container.querySelectorAll("svg")).toHaveLength(3);
  });

  it("renders the 404 page and the default page link", () => {
    const { unmount } = render(<PageNotFound />);
    expect(screen.getByText("404: Not Found")).toBeInTheDocument();
    unmount();
    render(<DefaultPage />);
    expect(screen.getByRole("link", { name: "Stack Dashboard" })).toHaveAttribute("href", "/stack-dashboard");
  });
});
