<template>
  <div>
    <GradientOverlay />

    <div class="relative flex flex-col items-center">
      <h2 class="my-8">Reset Password</h2>

      <form class="flex flex-col reset-password-form" @submit="onSubmit">
        <label class="mt-2" for="password">New password</label>

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
    </div>
  </div>
</template>

<script lang="ts">
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { useField, useForm } from "vee-validate";
import { computed, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import * as Yup from "yup";

import GradientOverlay from "@/components/common/GradientOverlay/index.vue";
import Input from "@/components/common/Input/index.vue";

const ResetPassword = defineComponent({
  name: "ResetPassword",

  components: {
    GradientOverlay,
    Input,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const { token } = route.query;

    const { errors, handleSubmit, meta } = useForm({
      validationSchema: Yup.object({
        password: Yup.string()
          .min(8, "Password must be at least 8 characters long.")
          .required("You must provide a new password."),

        passwordConfirmation: Yup.string()
          .oneOf([Yup.ref("password")], "Passwords do not match.")
          .required("You must confirm the new password."),
      }),
    });

    const { value: password } = useField("password");
    const { value: passwordConfirmation } = useField("passwordConfirmation");

    const canSubmit = computed(() => meta.value.valid);

    const { mutate: resetPassword } = useMutation(
      gql`
        mutation ResetPassword($input: ResetPasswordInput!) {
          resetPassword(input: $input) {
            success
          }
        }
      `
    );

    const onSubmit = handleSubmit(async (values) => {
      const { data } = await resetPassword({
        input: {
          token,
          password: values.password,
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
          message: "Failed to reset password.",
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

export default ResetPassword;
</script>

<style scoped>
.reset-password-form {
  width: 400px;
}
</style>
