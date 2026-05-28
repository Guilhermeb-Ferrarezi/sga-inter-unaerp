import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL ?? "http://localhost:8080/graphql";

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
