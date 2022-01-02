import { ApolloClient, createHttpLink, from, InMemoryCache } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

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
    uri: (import.meta as any).env.VITE_API_URL as string,
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        if (["JsonWebTokenError", "TokenExpiredError"].includes(extensions?.exception?.name)) {
          window.localStorage.removeItem("token");
          window.location.assign("/");
        }

        console.log(`[GraphQL Error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      });
    }

    if (networkError) {
      console.log(`[Network Error]: ${networkError}`);
    }
  });

  const cache = new InMemoryCache({
    typePolicies: {
      LeagueMemberScore: {
        keyFields: ["leagueMemberId", "seasonWeekId"],
      },
    },
  });

  const apolloClient = new ApolloClient({
    link: from([authLink, errorLink, httpLink]),
    cache,
    defaultOptions: {
      watchQuery: {
        errorPolicy: "all",
        fetchPolicy: "no-cache",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  });

  return apolloClient;
};
