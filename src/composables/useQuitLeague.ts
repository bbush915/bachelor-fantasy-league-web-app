import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { useStore } from "vuex";

import { useConfirmationModal } from "./useConfirmationModal";

type TQuitLeagueResult = { joinLeague: { id: string } };
type TQuitLeagueVariables = { input: { leagueId: string } };

export function useQuitLeague(leagueId: string) {
  const store = useStore();

  const {
    isConfirmationModalVisible,
    showConfirmationModal,
    hideConfirmationModal,
  } = useConfirmationModal();

  const { mutate: _quitLeague } = useMutation<TQuitLeagueResult, TQuitLeagueVariables>(
    gql`
      mutation QuitLeague($input: QuitLeagueInput!) {
        quitLeague(input: $input) {
          id
        }
      }
    `
  );

  async function quitLeague(callback: () => void) {
    const { data } = await _quitLeague({
      input: {
        leagueId,
      },
    });

    if (data) {
      callback();

      store.dispatch("pushNotification", {
        type: "success",
        message: "Quit league successfuly!",
      });
    } else {
      store.dispatch("pushNotification", {
        type: "error",
        message: "Failed to quit league. Please try again later",
      });
    }
  }

  return {
    isQuitLeagueConfirmationModalVisible: isConfirmationModalVisible,
    showQuitLeagueConfirmationModal: showConfirmationModal,
    hideQuitLeagueConfirmationModal: hideConfirmationModal,
    quitLeague,
  };
}
