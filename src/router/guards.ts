import { useApolloClient } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { NavigationGuard, RouteLocationNormalized } from "vue-router";

export const validateLeagueMembership: NavigationGuard = async (to) => {
  const { client } = useApolloClient();

  const { data } = await client.query({
    query: gql`
      query ValidateLeagueMembership($leagueId: ID!) {
        validateLeagueMembership(leagueId: $leagueId) {
          success
        }
      }
    `,
    variables: {
      leagueId: to.params.leagueId,
    },
  });

  if (!data?.validateLeagueMembership.success) {
    return { name: "my-leagues" };
  }

  return true;
};

export const validateLeagueAccessibility: NavigationGuard = async (to: RouteLocationNormalized) => {
  const { client } = useApolloClient();

  const { data } = await client.query({
    query: gql`
      query ValidateLeagueAccessibility($leagueId: ID!, $token: String) {
        validateLeagueAccessibility(leagueId: $leagueId, token: $token) {
          success
        }
      }
    `,
    variables: {
      leagueId: to.params.leagueId,
      token: to.query.token,
    },
  });

  if (!data?.validateLeagueAccessibility.success) {
    return { name: "my-leagues" };
  }

  return true;
};
