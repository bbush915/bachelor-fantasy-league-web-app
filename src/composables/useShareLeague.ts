import { useStore } from "vuex";

export function useShareLeague(inviteLink?: string) {
  const store = useStore();

  async function copyInviteLink() {
    if (!inviteLink) {
      return;
    }

    await navigator.clipboard.writeText(inviteLink);

    store.dispatch("pushNotification", {
      type: "success",
      message: "Copied invite link to clipboard!",
    });
  }

  return {
    copyInviteLink,
  };
}
