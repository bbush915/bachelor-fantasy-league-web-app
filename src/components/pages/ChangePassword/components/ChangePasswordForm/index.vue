<template>
  <form class="flex flex-col" @submit="onSubmit">
    <div class="flex flex-col">
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
  import { computed, defineComponent } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import { object, ref, string } from "yup";

  import Checkbox from "@/components/common/Checkbox/index.vue";
  import Input from "@/components/common/Input/index.vue";

  type TChangePasswordResult = { changePassword: { success: boolean } };

  type TChangePasswordVariables = {
    input: {
      currentPassword: string;
      newPassword: string;
    };
  };

  const ChangePasswordForm = defineComponent({
    components: {
      Checkbox,
      Input,
    },

    setup() {
      const store = useStore();
      const router = useRouter();

      const { mutate: changePassword } = useMutation<
        TChangePasswordResult,
        TChangePasswordVariables
      >(
        gql`
          mutation ChangePassword($input: ChangePasswordInput!) {
            changePassword(input: $input) {
              success
            }
          }
        `
      );

      const { errors, handleSubmit, meta, setFieldError } = useForm({
        validationSchema: object({
          currentPassword: string().required("You must provide the current password."),

          newPassword: string()
            .min(8, "Password must be at least 8 characters long.")
            .required("You must provide a new password."),

          newPasswordConfirmation: string()
            .oneOf([ref("newPassword")], "Passwords do not match.")
            .required("You must confirm the new password."),
        }),
      });

      const { value: currentPassword } = useField<string | undefined>("currentPassword");
      const { value: newPassword } = useField<string | undefined>("newPassword");
      const { value: newPasswordConfirmation } = useField<string | undefined>(
        "newPasswordConfirmation"
      );

      const canSubmit = computed(() => meta.value.valid);

      const onSubmit = handleSubmit(async (values) => {
        const { data, errors } = await changePassword({
          input: {
            currentPassword: values.currentPassword!,
            newPassword: values.newPassword!,
          },
        });

        if (data) {
          router.push({ name: "profile" });

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

  export default ChangePasswordForm;
</script>
