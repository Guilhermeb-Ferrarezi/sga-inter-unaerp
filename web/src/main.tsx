import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./lib/apollo";
import { AuthProvider } from "./lib/auth";
import { ThemeProvider } from "./lib/theme";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import { routeTree } from "./routeTree.gen";
import "./styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false },
  },
});

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <ApolloProvider client={apolloClient}>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
            </QueryClientProvider>
          </AuthProvider>
        </ApolloProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
