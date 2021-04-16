import { ref } from "vue";

export function useConfirmationModal() {
  const isConfirmationModalVisible = ref(false);

  function showConfirmationModal() {
    isConfirmationModalVisible.value = true;
  }

  function hideConfirmationModal() {
    isConfirmationModalVisible.value = false;
  }

  return {
    isConfirmationModalVisible,
    showConfirmationModal,
    hideConfirmationModal,
  };
}
