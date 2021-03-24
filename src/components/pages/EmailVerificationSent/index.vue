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

      <button class="self-center mt-8 btn-primary" @click="handleResendClick">
        Resend confirmation
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent } from "vue";
import { useStore } from "vuex";

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

  setup(props) {
    const store = useStore();

    const { mutate: sendVerificationEmail } = useMutation(
      gql`
        mutation SendVerificationEmail($email: String!) {
          sendVerificationEmail(email: $email) {
            success
          }
        }
      `
    );

    async function handleResendClick() {
      const { data } = await sendVerificationEmail({ email: props.email });

      if (data?.sendVerificationEmail?.success) {
        store.dispatch("pushNotification", {
          type: "success",
          message: "Resent confirmation email successfully!",
        });
      } else {
        store.dispatch("pushNotification", {
          type: "error",
          message: "Failed to resend confirmation email.",
        });
      }
    }

    return {
      handleResendClick,
    };
  },
});

export default EmailVerificationSent;
</script>
