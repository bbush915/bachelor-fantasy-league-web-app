<template>
  <div class="flex flex-col mx-40">
    <h1 class="my-8">My Profile</h1>

    <section
      v-if="profile"
      class="relative flex flex-col w-2/5 px-8 pt-6 pb-8 mx-auto bg-gray-dark rounded-3xl"
    >
      <h2 class="mb-4">Details</h2>

      <div class="absolute top-8 right-8">
        <router-link class="flex items-center" :to="{ name: 'edit-profile' }">
          <span class="mr-3 text-xs">Edit profile</span>

          <div class="w-4 h-4 mb-0.5">
            <EditIcon />
          </div>
        </router-link>
      </div>

      <div class="flex flex-col mb-8">
        <label class="mb-2">Profile Image</label>
        <Avatar class="w-48 h-48 mr-20" :src="profile.avatarUrl" />
      </div>

      <div class="flex flex-col mb-8">
        <label class="mb-1">Display name</label>
        <span class="mb-4 txt-body">{{ profile.displayName }}</span>

        <label class="mb-1">Email</label>
        <span class="txt-body">{{ profile.email }}</span>
      </div>

      <div class="flex flex-col mb-8">
        <label class="mb-2">General Preferences</label>

        <div class="flex items-center mb-1">
          <div class="w-5 h-5 mr-2">
            <CheckIcon v-if="profile.setRandomLineup" />
            <CloseIcon v-else />
          </div>

          <span class="mt-0.5 txt-label"> Use random lineup if you forget to set one</span>
        </div>
      </div>

      <div class="flex flex-col mb-8">
        <label class="mb-2">Email Preferences</label>

        <div class="flex items-center mb-1">
          <div class="w-5 h-5 mr-2">
            <CheckIcon v-if="profile.sendLineupReminders" />
            <CloseIcon v-else />
          </div>

          <span class="mt-0.5 txt-label"> Receive weekly reminders to set your lineup </span>
        </div>

        <div class="flex items-center">
          <div class="w-5 h-5 mr-2">
            <CheckIcon v-if="profile.sendScoringRecaps" />
            <CloseIcon v-else />
          </div>

          <span class="mt-0.5 txt-label"> Receive weekly scoring recaps </span>
        </div>
      </div>

      <div class="flex flex-col items-center space-y-4">
        <router-link class="w-52 btn-secondary" :to="{ name: 'change-password' }">
          Change password
        </router-link>

        <button class="w-52 btn-primary" @click="handleLogoutClick">Logout</button>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";

  import CheckIcon from "@/assets/check.svg?component";
  import CloseIcon from "@/assets/close.svg?component";
  import EditIcon from "@/assets/edit.svg?component";
  import Avatar from "@/components/common/Avatar/index.vue";
  import Input from "@/components/common/Input/index.vue";
  import { useProfile } from "@/composables";

  const Profile = defineComponent({
    components: {
      Avatar,
      CheckIcon,
      CloseIcon,
      EditIcon,
      Input,
    },

    setup() {
      const store = useStore();
      const router = useRouter();

      const { profile } = useProfile();

      function handleLogoutClick() {
        store.commit("logout");

        router.push({ name: "home" });
      }

      return {
        profile,
        handleLogoutClick,
      };
    },
  });

  export default Profile;
</script>
