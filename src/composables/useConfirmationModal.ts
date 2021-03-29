import { ref } from "vue";

export function useConfirmationModal() {
  const isModalVisible = ref(false);

  function showConfirmationModal() {
    isModalVisible.value = true;
  }

  function hideConfirmationModal() {
    isModalVisible.value = false;
  }

  return {
    isModalVisible,
    showConfirmationModal,
    hideConfirmationModal,
  };
}
