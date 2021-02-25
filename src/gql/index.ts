import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core";

export const getApolloClient = () => {
  const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
  });

  const cache = new InMemoryCache();

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
  });

  return apolloClient;
};
