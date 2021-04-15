<template>
  <form class="flex flex-col" @submit="onSubmit">
    <label for="password">New password</label>
    <Input id="password" type="password" v-model:value="password" :error="errors.password" />

    <label class="mt-2" for="password-confirmation">Re-enter new password</label>
    <Input
      id="password-confirmation"
      type="password"
      v-model:value="passwordConfirmation"
      :error="errors.passwordConfirmation"
    />

    <button
      class="self-center mt-8 btn-primary"
      type="submit"
      :disabled="!canSubmit"
      @click="onSubmit"
    >
      Save
    </button>
  </form>
</template>

<script lang="ts">
  import { useMutation } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { useField, useForm } from "vee-validate";
  import { computed, defineComponent } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useStore } from "vuex";
  import { object, ref, string } from "yup";

  import Input from "@/components/common/Input/index.vue";

  type TResetPasswordResult = { resetPassword: { success: boolean } };
  type TResetPasswordVariables = { input: { token: string; password: string } };

  const ResetPasswordForm = defineComponent({
    name: "ResetPasswordForm",

    components: {
      Input,
    },

    setup() {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();

      const { token } = route.query;

      const { mutate: resetPassword } = useMutation<TResetPasswordResult, TResetPasswordVariables>(
        gql`
          mutation ResetPassword($input: ResetPasswordInput!) {
            resetPassword(input: $input) {
              success
            }
          }
        `
      );

      const { errors, handleSubmit, meta } = useForm({
        validationSchema: object({
          password: string()
            .min(8, "Password must be at least 8 characters long.")
            .required("You must provide a new password."),

          passwordConfirmation: string()
            .oneOf([ref("password")], "Passwords do not match.")
            .required("You must confirm the new password."),
        }),
      });

      const { value: password } = useField<string | undefined>("password");
      const { value: passwordConfirmation } = useField<string | undefined>("passwordConfirmation");

      const canSubmit = computed(() => meta.value.valid);

      const onSubmit = handleSubmit(async (values) => {
        const { data } = await resetPassword({
          input: {
            token: token as string,
            password: values.password!,
          },
        });

        if (data) {
          router.push({ name: "login" });

          store.dispatch("pushNotification", {
            type: "success",
            message: "Reset password successfully!",
          });
        } else {
          store.dispatch("pushNotification", {
            type: "error",
            message: "Failed to reset password. Please try again later",
          });
        }
      });

      return {
        password,
        passwordConfirmation,
        errors,
        canSubmit,
        onSubmit,
      };
    },
  });

  export default ResetPasswordForm;
</script>
