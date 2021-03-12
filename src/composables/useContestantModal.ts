import { ref } from "vue";

import { IContestant } from "./useContestants";

export function useContestantModal() {
  const selectedContestant = ref<IContestant | null>(null);
  const isContestantModalVisible = ref(false);

  function showContestantModal(contestant: IContestant | null) {
    selectedContestant.value = contestant;
    isContestantModalVisible.value = true;
  }

  function hideContestantModal() {
    isContestantModalVisible.value = false;
    selectedContestant.value = null;
  }

  return {
    selectedContestant,
    isContestantModalVisible,
    showContestantModal,
    hideContestantModal,
  };
}
