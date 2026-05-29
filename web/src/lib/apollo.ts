import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Em prod: path relativo (nginx faz proxy_pass pra API). Same-origin
// resolve cookie HttpOnly e CORS automaticamente.
// Em dev: localhost:8080. Override via VITE_GRAPHQL_URL.
function resolveGraphqlUrl(): string {
  const envUrl = import.meta.env.VITE_GRAPHQL_URL as string | undefined;
  if (envUrl) return envUrl;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
      return `${basePath}/api/graphql`;
    }
  }
  return "http://localhost:8080/graphql";
}

const GRAPHQL_URL = resolveGraphqlUrl();

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_URL,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network" },
  },
});
