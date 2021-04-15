<template>
  <div>
    <GradientOverlay />

    <section class="relative flex flex-col items-center">
      <h2 class="my-8">Email address verified!</h2>

      <EmailIcon />

      <p class="mt-4 text-center w-96">
        Email address <span class="text-pink">{{ email }}</span> has been verified
      </p>

      <router-link class="mt-8 btn-primary" :to="{ name: 'my-leagues' }">
        Go to My Leagues
      </router-link>
    </section>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import EmailIcon from "@/assets/email.svg";
  import GradientOverlay from "@/components/common/GradientOverlay/index.vue";

  const EmailVerificationSuccess = defineComponent({
    name: "EmailVerificationSuccess",

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

  export default EmailVerificationSuccess;
</script>
