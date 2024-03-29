import { useApolloClient } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { NavigationGuard } from "vue-router";

import { getToken } from "@/utils/authentication";

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

export const validateLeagueAccessibility: NavigationGuard = async (to) => {
  const { client } = useApolloClient();

  const { data } = await client.query({
    query: gql`
      query ValidateLeagueAccessibility(
        $leagueId: ID!
        $authenticationToken: String
        $accessToken: String
      ) {
        validateLeagueAccessibility(
          leagueId: $leagueId
          authenticationToken: $authenticationToken
          accessToken: $accessToken
        ) {
          success
        }
      }
    `,
    variables: {
      leagueId: to.params.leagueId,
      authenticationToken: getToken(),
      accessToken: to.query.token,
    },
  });

  if (!data?.validateLeagueAccessibility.success) {
    return { name: "my-leagues" };
  }

  return true;
};

export const validateRole =
  (role: string): NavigationGuard =>
  async () => {
    const { client } = useApolloClient();

    const { data } = await client.query({
      query: gql`
        query ValidateUserRole($role: String!) {
          validateUserRole(role: $role) {
            success
          }
        }
      `,
      variables: {
        role,
      },
    });

    if (!data?.validateUserRole.success) {
      return { name: "home" };
    }

    return true;
  };
