import { computed } from "vue";
import { useStore } from "vuex";

export function useAuthentication() {
  const store = useStore();

  const isAuthenticated = computed(() => !!store.state.auth.token);

  return {
    isAuthenticated,
  };
}
