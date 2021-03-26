<template>
  <div class="relative flex flex-col w-2/3 px-8 pt-6 pb-8 mx-auto bg-gray-dark rounded-3xl">
    <h2 class="mb-4">Edit Details</h2>

    <form class="flex flex-col" @submit="onSubmit">
      <label class="mb-2">Profile Image</label>

      <div class="relative w-48 h-48 mb-8 overflow-hidden rounded-xl bg-gray">
        <input
          class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          type="file"
          @change="handleAvatarUrlChange"
        />

        <img :src="avatarUrl" />
      </div>

      <div class="flex flex-col w-1/2">
        <label class="mt-2" for="display-name">Display name</label>

        <Input
          id="display-name"
          type="text"
          v-model:value="displayName"
          :error="errors.displayName"
        />

        <label class="mt-2" for="email">Email</label>

        <Input id="email" type="email" v-model:value="email" :error="errors.email" />
      </div>

      <label class="mt-8 mb-2">Email Preferences</label>

      <Checkbox
        class="mb-1"
        id="lineup-reminders"
        label="Receive weekly reminders to set your lineup"
        v-model:checked="sendLineupReminders"
      />

      <Checkbox
        id="scoring-recaps"
        label="Receive weekly scoring recaps"
        v-model:checked="sendScoringRecaps"
      />

      <Checkbox
        class="mt-4"
        id="unsubscribe"
        label="Unsubscribe from all emails"
        v-model:checked="unsubscribe"
      />

      <div class="flex self-end mt-8">
        <router-link class="mr-4 btn-secondary" :to="{ name: 'view-profile' }">
          Cancel
        </router-link>

        <button class="btn-primary" type="submit" :disabled="!canSubmit" @click="onSubmit">
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { useField, useForm } from "vee-validate";
import { computed, defineComponent, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import * as Yup from "yup";

import Checkbox from "@/components/common/Checkbox/index.vue";
import Input from "@/components/common/Input/index.vue";
import { useMutableImage, useProfile } from "@/composables";

const EditProfile = defineComponent({
  name: "EditProfile",

  components: {
    Checkbox,
    Input,
  },

  setup() {
    const router = useRouter();
    const store = useStore();

    const { profile } = useProfile();

    const { errors, handleSubmit, meta, setFieldError, setFieldValue } = useForm({
      initialValues: {
        avatarUrl: profile.value?.avatarUrl,
        displayName: profile.value?.displayName,
        email: profile.value?.email,
        sendLineupReminders: profile.value?.sendLineupReminders,
        sendScoringRecaps: profile.value?.sendScoringRecaps,
      },

      validationSchema: Yup.object({
        avatarUrl: Yup.string().nullable(),

        displayName: Yup.string().required("You must provide a display name."),

        email: Yup.string()
          .email("Invalid email address")
          .required("You must provide an email address."),

        sendLineupReminders: Yup.boolean(),

        sendScoringRecaps: Yup.boolean(),
      }),
    });

    const { source: avatarUrl, handleSourceChange: handleAvatarUrlChange } = useMutableImage(
      profile.value?.avatarUrl
    );

    const { value: _avatarUrl } = useField("avatarUrl");
    const { value: displayName } = useField("displayName");
    const { value: email } = useField("email");
    const { value: sendLineupReminders } = useField("sendLineupReminders");
    const { value: sendScoringRecaps } = useField("sendScoringRecaps");

    const unsubscribe = ref(false);

    watch(
      () => avatarUrl.value,
      () => {
        setFieldValue("avatarUrl", avatarUrl.value);
      }
    );

    watch(
      () => [sendLineupReminders.value, sendScoringRecaps.value],
      () => {
        if (sendLineupReminders.value || sendScoringRecaps.value) {
          unsubscribe.value = false;
        }
      }
    );

    watch(
      () => unsubscribe.value,
      () => {
        if (unsubscribe.value) {
          setFieldValue("sendLineupReminders", false);
          setFieldValue("sendScoringRecaps", false);
        }
      }
    );

    const canSubmit = computed(() => meta.value.valid);

    const { mutate: updateProfile } = useMutation(
      gql`
        mutation UpdateProfile($input: UpdateProfileInput!) {
          updateProfile(input: $input) {
            id
            email
            displayName
            avatarUrl
            sendLineupReminders
            sendScoringRecaps
          }
        }
      `
    );

    const onSubmit = handleSubmit(async (values) => {
      const { data, errors } = await updateProfile(
        {
          input: {
            displayName: values.displayName,
            email: values.email,
            avatarUrl: avatarUrl.value,
            sendLineupReminders: sendLineupReminders.value,
            sendScoringRecaps: sendScoringRecaps.value,
          },
        },
        { errorPolicy: "all" }
      );

      if (data) {
        router.push({ name: "view-profile" });

        store.dispatch("pushNotification", {
          type: "success",
          message: "Profile updated successfully!",
        });
      } else {
        if (errors?.some((x) => x.extensions?.code === "EMAIL_ALREADY_EXISTS")) {
          setFieldError("email", "An account with that email address already exists.");
        }

        store.dispatch("pushNotification", {
          type: "error",
          message: "Failed to update profile.",
        });
      }
    });

    return {
      avatarUrl,
      handleAvatarUrlChange,
      displayName,
      email,
      sendLineupReminders,
      sendScoringRecaps,
      unsubscribe,
      errors,
      canSubmit,
      onSubmit,
    };
  },
});

export default EditProfile;
</script>
