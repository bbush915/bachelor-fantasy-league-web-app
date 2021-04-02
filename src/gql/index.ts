import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";

const authLink = setContext((_, { headers }) => {
  const token = window.localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : undefined,
    },
  };
});

export const getApolloClient = () => {
  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_API_URL,
  });

  const cache = new InMemoryCache({
    typePolicies: {
      LeagueMemberScore: {
        keyFields: ["leagueMemberId", "seasonWeekId"],
      },
    },
  });

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
      },
    },
  });

  return apolloClient;
};
