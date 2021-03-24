<template>
  <div class="relative flex flex-col w-2/3 px-8 pt-6 pb-8 mx-auto bg-gray-dark rounded-3xl">
    <h2 class="mb-4">Details</h2>

    <div class="absolute top-8 right-8">
      <router-link class="flex items-center" :to="{ name: 'edit-profile' }">
        <span class="mr-3 text-xs">Edit Profile</span>

        <div class="w-4 h-4 mb-0.5">
          <EditIcon />
        </div>
      </router-link>
    </div>

    <div class="flex items-center mb-8">
      <Avatar class="w-48 h-48 mr-20" :src="profileContext.avatarUrl" />

      <div class="flex flex-col">
        <label class="mb-1">Display name</label>
        <span class="mb-4 txt-body">{{ profileContext.displayName }}</span>

        <label class="mb-1">Email</label>
        <span class="mb-4 txt-body">{{ profileContext.email }}</span>
      </div>
    </div>

    <h2 class="mb-4">Email Preferences</h2>

    <div class="flex flex-col mb-4 space-y-2">
      <Checkbox
        class="pointer-events-none"
        id="lineup-reminders"
        label="Receive weekly reminders to set your lineup"
        v-model:checked="setLineupReminder"
        :disabled="true"
      />

      <Checkbox
        id="scoring-recaps"
        label="Receive weekly scoring recaps"
        v-model:checked="scoringRecaps"
        :disabled="true"
      />
    </div>

    <div class="flex self-end space-x-4">
      <button class="w-52 btn-secondary">Change password</button>
      <button class="w-52 btn-primary" @click="handleLogoutClick">Logout</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import EditIcon from "@/assets/edit.svg";
import Avatar from "@/components/common/Avatar/index.vue";
import Checkbox from "@/components/common/Checkbox/index.vue";
import Input from "@/components/common/Input/index.vue";
import { ProfileContext } from "@/types";

const ViewProfile = defineComponent({
  name: "ViewProfile",

  components: {
    Avatar,
    Checkbox,
    EditIcon,
    Input,
  },

  props: {
    profileContext: {
      type: Object as PropType<ProfileContext>,
      required: true,
    },
  },

  setup() {
    const router = useRouter();
    const store = useStore();

    const setLineupReminder = ref(false);
    const scoringRecaps = ref(false);

    function handleLogoutClick() {
      store.commit("logout");

      router.push("/");
    }

    return {
      setLineupReminder,
      scoringRecaps,
      handleLogoutClick,
    };
  },
});

export default ViewProfile;
</script>
