<template>
  <div class="flex flex-col mx-40">
    <h1 class="my-8">My Profile</h1>

    <section
      v-if="profile"
      class="relative flex flex-col w-2/5 px-8 pt-6 pb-8 mx-auto mb-8 bg-gray-dark rounded-3xl"
    >
      <h2 class="mb-4">Details</h2>

      <ProfileForm :profile="profile" />
    </section>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import { useProfile } from "@/composables";
  import ProfileForm from "./components/ProfileForm/index.vue";

  const EditProfile = defineComponent({
    components: {
      ProfileForm,
    },

    setup() {
      const { profile } = useProfile();

      return {
        profile,
      };
    },
  });

  export default EditProfile;
</script>
