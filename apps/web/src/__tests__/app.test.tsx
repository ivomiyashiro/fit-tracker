import { describe, expect, it, vi } from "vitest";

// Mock all complex dependencies
vi.mock("@tanstack/react-query", () => ({
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
  useQuery: () => ({ data: null, isLoading: false }),
}));

vi.mock("@tanstack/react-router", () => ({
  RouterProvider: ({ children }: { children?: React.ReactNode }) => children || null,
}));

vi.mock("@/web/lib/auth", () => ({
  useSession: () => ({
    data: null,
    isPending: false,
  }),
}));

vi.mock("@/web/lib/query-client", () => ({
  default: {},
}));

vi.mock("@/web/lib/router/router.index", () => ({
  router: {},
}));

vi.mock("@/web/lib/theme/theme.provider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/web/components/ui", () => ({
  AppFallback: () => "Loading...",
  Toaster: () => "Toaster",
}));

describe("app", () => {
  it("renders without crashing", async () => {
    const { render } = await import("@testing-library/react");
    const { default: App } = await import("@/web/app");

    expect(() => {
      render(<App />);
    }).not.toThrow();
  });
});
