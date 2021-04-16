import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { useStore } from "vuex";

type TJoinLeagueResult = { joinLeague: { id: string } };
type TJoinLeagueVariables = { input: { leagueId: string } };

export function useJoinLeague(leagueId: string) {
  const store = useStore();

  const { mutate: _joinLeague } = useMutation<TJoinLeagueResult, TJoinLeagueVariables>(
    gql`
      mutation JoinLeague($input: JoinLeagueInput!) {
        joinLeague(input: $input) {
          id
        }
      }
    `
  );

  async function joinLeague(callback: () => void) {
    const { data } = await _joinLeague({
      input: {
        leagueId,
      },
    });

    if (data) {
      callback();

      store.dispatch("pushNotification", {
        type: "success",
        message: "Joined league successfuly!",
      });
    } else {
      store.dispatch("pushNotification", {
        type: "error",
        message: "Failed to join league. Please try again later",
      });
    }
  }

  return {
    joinLeague,
  };
}
