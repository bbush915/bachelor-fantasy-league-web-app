<template>
  <div>
    <GradientOverlay />

    <div class="relative flex flex-col items-center">
      <h2 class="my-8">Verify email address</h2>

      <EmailIcon />

      <p class="mt-4 text-center w-96">
        Verify your email address by clicking the link in the confirmation email we sent to
        <br />
        <span class="text-pink">{{ email }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import EmailIcon from "@/assets/email.svg";
import GradientOverlay from "@/components/common/GradientOverlay/index.vue";

const EmailVerificationSent = defineComponent({
  name: "EmailVerificationSent",

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

export default EmailVerificationSent;
</script>
