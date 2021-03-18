<template>
  <div
    v-if="user"
    class="relative flex flex-col px-8 pt-4 pb-16 mt-8 ml-40 rounded-3xl bg-gray-dark"
  >
    <h2 class="mb-4">Edit Details</h2>

    <div class="flex items-center">
      <div class="flex flex-col">
        <label class="mb-2 text-xs font-thin">Display name</label>
        <input class="mb-4 input" type="text" v-model="displayName" />

        <label class="mb-2 text-xs font-thin">Email</label>
        <input class="mb-4 input" type="email" v-model="email" />

        <label class="mb-2">Upload Profile Image</label>
        <div class="relative w-48 h-48 mb-4 overflow-hidden rounded-xl bg-gray">
          <input
            class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            type="file"
            @change="handleImageChange"
          />
          <img :src="avatarUrl" />
        </div>
        <label class="mb-2">Email Preferences</label>
        <div class="flex items-center mb-2">
          <input id="is-public" type="checkbox" v-model="user.sendLineupReminders" />
          <label class="ml-2 txt-body" for="is-public"> Reminders to set lineup</label>
        </div>
        <div class="flex items-center mb-2">
          <input id="is-public" type="checkbox" v-model="user.sendScoreRecaps" />
          <label class="ml-2 txt-body" for="is-public"> Score recaps</label>
        </div>
        <div class="flex items-center mb-2">
          <input id="is-public" type="checkbox" v-model="user.unsubscribe" />
          <label class="ml-2 txt-body" for="is-public"> Unsubscribe from all emails</label>
        </div>
      </div>
    </div>
    <div class="flex self-end">
      <router-link class="mr-4 btn-secondary" :to="{ name: 'profile' }"> Cancel </router-link>
      <button class="btn-primary" @click="handleSaveClick">Save</button>
    </div>
  </div>
</template>

<script lang="ts">
import { useUpdateImage } from "@/composables";
import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent, ref, watch } from "vue";
import { useRouter } from "vue-router";

import { useStore } from "vuex";

const EditProfile = defineComponent({
  name: "EditProfile",

  setup() {
    const router = useRouter();
    const store = useStore();

    const { result } = useQuery(
      gql`
        query Me {
          me {
            id
            email
            displayName
            avatarUrl
            # sendLineupReminders
            # sendScoreRecaps
            # unsubscribe
          }
        }
      `
    );

    const { mutate: updateProfile } = useMutation(
      gql`
        mutation UpdateProfile($input: UpdateProfileInput!) {
          updateProfile(input: $input) {
            id
            email
            displayName
            avatarUrl
          }
        }
      `
    );

    const displayName = ref<string>();
    const email = ref<string>();
    const { imageUrl: avatarUrl, handleImageChange } = useUpdateImage();
    const user = useResult(result, null, (data) => data.me);

    watch(
      () => user.value,
      () => {
        displayName.value = user.value.displayName;
        email.value = user.value.email;
        avatarUrl.value = user.value.avatarUrl;
      }
    );

    async function handleSaveClick(): Promise<void> {
      try {
        await updateProfile({
          input: {
            avatarUrl: avatarUrl.value,
            displayName: displayName.value,
            email: email.value,
          },
        });

        store.dispatch("pushNotification", {
          type: "success",
          message: "Profile saved successfuly!",
        });

        router.push({ name: "profile" });
      } catch (error) {
        store.dispatch("pushNotification", {
          type: "error",
          message: "Failed to save profile. Try again later",
        });
      }
    }

    return {
      user,
      email,
      avatarUrl,
      displayName,
      handleSaveClick,
      handleImageChange,
    };
  },
});

export default EditProfile;
</script>
