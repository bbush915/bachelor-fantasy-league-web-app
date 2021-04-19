<template>
  <form class="flex flex-col" @submit="onSubmit">
    <label class="mb-2">Profile Image</label>

    <div class="relative w-48 h-48 mb-8 overflow-hidden rounded-full bg-gray">
      <input
        class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        type="file"
        @change="handleAvatarUrlChange"
      />

      <img :src="avatarUrl" />
    </div>

    <div class="flex flex-col">
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
      <router-link class="mr-4 btn-secondary" :to="{ name: 'profile' }">Cancel</router-link>

      <button class="btn-primary" type="submit" :disabled="!canSubmit" @click="onSubmit">
        Save
      </button>
    </div>
  </form>
</template>

<script lang="ts">
  import { useMutation } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { useField, useForm } from "vee-validate";
  import { computed, defineComponent, PropType, ref, toRefs, watch } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import { boolean, object, string } from "yup";

  import Checkbox from "@/components/common/Checkbox/index.vue";
  import Input from "@/components/common/Input/index.vue";
  import { useMutableImage } from "@/composables";

  type TProfile = {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    sendLineupReminders: boolean;
    sendScoringRecaps: boolean;
  };

  type TUpdateProfileResult = { updateProfile: { id: string } };

  type TUpdateProfileVariables = {
    input: {
      displayName: string;
      email: string;
      avatarUrl?: string | null;
      sendLineupReminders: boolean;
      sendScoringRecaps: boolean;
    };
  };

  const ProfileForm = defineComponent({
    components: {
      Checkbox,
      Input,
    },

    props: {
      profile: {
        type: Object as PropType<TProfile>,
        required: true,
      },
    },

    setup(props) {
      const { profile } = toRefs(props);

      const store = useStore();
      const router = useRouter();

      const { mutate: updateProfile } = useMutation<TUpdateProfileResult, TUpdateProfileVariables>(
        gql`
          mutation UpdateProfile($input: UpdateProfileInput!) {
            updateProfile(input: $input) {
              id
            }
          }
        `
      );

      const { source: avatarUrl, handleSourceChange: handleAvatarUrlChange } = useMutableImage(
        profile.value.avatarUrl
      );

      const { errors, handleSubmit, meta, setFieldError, setFieldValue } = useForm({
        validationSchema: object({
          avatarUrl: string().nullable(),

          displayName: string().required("You must provide a display name."),

          email: string()
            .email("Invalid email address")
            .required("You must provide an email address."),

          sendLineupReminders: boolean(),

          sendScoringRecaps: boolean(),
        }),

        initialValues: {
          avatarUrl: profile.value.avatarUrl,
          displayName: profile.value.displayName,
          email: profile.value.email,
          sendLineupReminders: profile.value.sendLineupReminders,
          sendScoringRecaps: profile.value.sendScoringRecaps,
        },
      });

      const { value: _avatarUrl } = useField<string | undefined>("avatarUrl");
      const { value: displayName } = useField<string | undefined>("displayName");
      const { value: email } = useField<string | undefined>("email");
      const { value: sendLineupReminders } = useField<boolean>("sendLineupReminders");
      const { value: sendScoringRecaps } = useField<boolean>("sendScoringRecaps");

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

      const onSubmit = handleSubmit(async (values) => {
        const { data, errors } = await updateProfile({
          input: {
            displayName: values.displayName!,
            email: values.email!,
            avatarUrl: values.avatarUrl,
            sendLineupReminders: sendLineupReminders.value,
            sendScoringRecaps: sendScoringRecaps.value,
          },
        });

        if (data) {
          router.push({ name: "profile" });

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

  export default ProfileForm;
</script>
