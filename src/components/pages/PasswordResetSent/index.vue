<template>
  <div>
    <GradientOverlay />

    <section class="relative flex flex-col items-center">
      <h2 class="my-8">Check your email</h2>

      <EmailIcon />

      <p class="mt-4 text-center">
        Password reset link was sent to
        <br />
        <span class="text-pink">{{ email }}</span>
      </p>
    </section>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import EmailIcon from "@/assets/email.svg";
  import GradientOverlay from "@/components/common/GradientOverlay/index.vue";

  const PasswordResetSent = defineComponent({
    components: {
      EmailIcon,
      GradientOverlay,
    },

    props: {
      email: {
        type: String,
        required: true,
      },
    },
  });

  export default PasswordResetSent;
</script>
