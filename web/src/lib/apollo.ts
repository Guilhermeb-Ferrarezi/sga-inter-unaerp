import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Resolução da URL em ordem:
// 1. VITE_GRAPHQL_URL (env var explícita no build)
// 2. Em prod (hostname diferente de localhost): API no host inter-unaerp-api
// 3. Dev local: localhost:8080/graphql
function resolveGraphqlUrl(): string {
  const envUrl = import.meta.env.VITE_GRAPHQL_URL as string | undefined;
  if (envUrl) return envUrl;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      return "https://guilherme-inter-unaerp-api.mduiqo.easypanel.host/graphql";
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
