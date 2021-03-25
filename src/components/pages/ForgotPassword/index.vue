<template>
  <div>
    <GradientOverlay />

    <div class="relative flex flex-col items-center">
      <h2 class="my-8">Reset Password</h2>

      <p class="text-center w-80">
        Enter your email address and we’ll send you a link to reset your password.
      </p>

      <div class="flex flex-col forgot-password-form">
        <label class="mt-4" for="email">Email</label>

        <Input id="email" type="email" v-model:value="email" />
      </div>

      <button class="mt-8 btn-primary" :disabled="!canSubmit" @click="onSubmit">
        Send reset link
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import GradientOverlay from "@/components/common/GradientOverlay/index.vue";
import Input from "@/components/common/Input/index.vue";

const ForgotPassword = defineComponent({
  name: "ForgotPassword",

  components: {
    GradientOverlay,
    Input,
  },

  setup() {
    const router = useRouter();
    const store = useStore();

    const email = ref<string>();

    const canSubmit = computed(() => !!email.value);

    const { mutate: sendPasswordResetEmail } = useMutation(
      gql`
        mutation SendPasswordResetEmail($email: String!) {
          sendPasswordResetEmail(email: $email) {
            success
          }
        }
      `
    );

    async function onSubmit() {
      const { data } = await sendPasswordResetEmail({
        email: email.value,
      });

      if (data) {
        router.push({ name: "password-reset-sent", params: { email: email.value! } });
      } else {
        store.dispatch("pushNotification", {
          type: "error",
          message: "Failed to send password reset. Please try again later",
        });
      }
    }

    return {
      email,
      canSubmit,
      onSubmit,
    };
  },
});

export default ForgotPassword;
</script>

<style scoped>
.forgot-password-form {
  width: 400px;
}
</style>
