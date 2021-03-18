import { ref } from "vue";
import { useStore } from "vuex";

export function useUpdateImage(initialImageUrl?: string) {
  const store = useStore();
  const imageUrl = ref(initialImageUrl);

  function handleImageChange(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.files?.item(0)) {
      const file = target.files[0];

      if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
        store.dispatch("pushNotification", {
          type: "error",
          message: "Must upload an image (PNG, JPG) that is less than 5 MB",
        });

        return;
      }

      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        imageUrl.value = e.target?.result as string | undefined;
      };

      fileReader.readAsDataURL(target.files[0]);
    }
  }

  return { imageUrl, handleImageChange };
}
