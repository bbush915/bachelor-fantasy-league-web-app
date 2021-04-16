<template>
  <div v-if="profile" class="flex flex-col mx-40">
    <h1 class="my-8">My Profile</h1>

    <router-view />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import EditIcon from "@/assets/edit.svg";
  import Avatar from "@/components/common/Avatar/index.vue";
  import { useProfile } from "@/composables";

  const Profile = defineComponent({
    components: {
      Avatar,
      EditIcon,
    },

    setup() {
      const { profile } = useProfile();

      return {
        profile,
      };
    },
  });

  export default Profile;
</script>
