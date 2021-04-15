<template>
  <div class="relative flex flex-col w-2/3 px-8 pt-6 pb-8 mx-auto bg-gray-dark rounded-3xl">
    <h2 class="mb-4">Change Password</h2>

    <form class="flex flex-col" @submit="onSubmit">
      <div class="flex flex-col w-1/2">
        <label class="mt-2" for="password">Current password</label>

        <Input
          id="current-password"
          type="password"
          v-model:value="currentPassword"
          :error="errors.currentPassword"
        />

        <label class="mt-2" for="password">New password</label>

        <Input
          id="new-password"
          type="password"
          v-model:value="newPassword"
          :error="errors.newPassword"
        />

        <label class="mt-2" for="password">Re-enter new password</label>

        <Input
          id="new-password-confirmation"
          type="password"
          v-model:value="newPasswordConfirmation"
          :error="errors.newPasswordConfirmation"
        />
      </div>

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
  import { computed, defineComponent } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import * as Yup from "yup";

  import Input from "@/components/common/Input/index.vue";

  const ChangePassword = defineComponent({
    name: "ChangePassword",

    components: {
      Input,
    },

    setup() {
      const router = useRouter();
      const store = useStore();

      const { errors, handleSubmit, meta, setFieldError } = useForm({
        validationSchema: Yup.object({
          currentPassword: Yup.string().required("You must provide the current password."),

          newPassword: Yup.string()
            .min(8, "Password must be at least 8 characters long.")
            .required("You must provide a new password."),

          newPasswordConfirmation: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Passwords do not match.")
            .required("You must confirm the new password."),
        }),
      });

      const { value: currentPassword } = useField("currentPassword");
      const { value: newPassword } = useField("newPassword");
      const { value: newPasswordConfirmation } = useField("newPasswordConfirmation");

      const canSubmit = computed(() => meta.value.valid);

      const { mutate: changePassword } = useMutation(
        gql`
          mutation ChangePassword($input: ChangePasswordInput!) {
            changePassword(input: $input) {
              success
            }
          }
        `
      );

      const onSubmit = handleSubmit(async (values) => {
        const { data, errors } = await changePassword(
          {
            input: {
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
            },
          },
          { errorPolicy: "all" }
        );

        if (data) {
          router.push({ name: "view-profile" });

          store.dispatch("pushNotification", {
            type: "success",
            message: "Changed password successfully!",
          });
        } else {
          if (errors?.some((x) => x.extensions?.code === "INVALID_CREDENTIALS")) {
            setFieldError("currentPassword", "The password provided is not correct");
          }

          store.dispatch("pushNotification", {
            type: "error",
            message: "Failed to change password.",
          });
        }
      });

      return {
        currentPassword,
        newPassword,
        newPasswordConfirmation,
        errors,
        canSubmit,
        onSubmit,
      };
    },
  });

  export default ChangePassword;
</script>
