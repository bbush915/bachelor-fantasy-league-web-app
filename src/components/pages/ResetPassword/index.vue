<template>
  <div>
    <GradientOverlay />

    <section class="relative mx-auto reset-password__content">
      <h2 class="my-8 text-center">Reset Password</h2>

      <ResetPasswordForm />
    </section>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import GradientOverlay from "@/components/common/GradientOverlay/index.vue";
  import ResetPasswordForm from "./components/ResetPasswordForm/index.vue";

  const ResetPassword = defineComponent({
    name: "ResetPassword",

    components: {
      GradientOverlay,
      ResetPasswordForm,
    },
  });

  export default ResetPassword;
</script>

<style scoped>
  .reset-password__content {
    width: 400px;
  }
</style>
