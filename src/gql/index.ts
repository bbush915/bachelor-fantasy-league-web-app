import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core";

const getHeaders = () => {
  const headers = {} as any;

  const token = window.localStorage.getItem("token");

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  return headers;
};

export const getApolloClient = () => {
  const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
    headers: getHeaders,
  });

  const cache = new InMemoryCache();

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
  });

  return apolloClient;
};
