<template>
  <div>
    <GradientOverlay />

    <section class="relative mx-auto forgot-password__content">
      <h2 class="my-8 text-center">Reset Password</h2>

      <p class="mb-4 text-center">
        Enter your email address and we’ll send you a link to reset your password.
      </p>

      <ForgotPasswordForm />
    </section>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import GradientOverlay from "@/components/common/GradientOverlay/index.vue";
  import ForgotPasswordForm from "./components/ForgotPasswordForm/index.vue";

  const ForgotPassword = defineComponent({
    name: "ForgotPassword",

    components: {
      ForgotPasswordForm,
      GradientOverlay,
    },
  });

  export default ForgotPassword;
</script>

<style scoped>
  .forgot-password__content {
    width: 400px;
  }
</style>
