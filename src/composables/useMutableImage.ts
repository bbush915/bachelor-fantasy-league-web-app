import { ref } from "vue";
import { useStore } from "vuex";

export function useMutableImage(initialSource?: string) {
  const store = useStore();

  const source = ref(initialSource);

  function handleSourceChange(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.files?.item(0)) {
      const file = target.files[0];

      if (!file.type.startsWith("image/") || file.size > 1 * 1024 * 1024) {
        store.dispatch("pushNotification", {
          type: "error",
          message: "Must upload an image (PNG, JPG) that is less than 1 MB",
        });

        return;
      }

      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        source.value = e.target?.result as string | undefined;
      };

      fileReader.readAsDataURL(target.files[0]);
    }
  }

  return { source, handleSourceChange };
}
