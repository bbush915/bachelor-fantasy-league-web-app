<template></template>

<script lang="ts">
  import { useMutation } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { defineComponent, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useStore } from "vuex";

  type TVerifyEmailResult = { verify: { token: string; email: string } };
  type TVerifyEmailVariables = { input: { token: string } };

  const VerifyEmail = defineComponent({
    setup() {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();

      const { token } = route.query;

      const { mutate: verifyEmail } = useMutation<TVerifyEmailResult, TVerifyEmailVariables>(
        gql`
          mutation VerifyEmail($input: VerifyInput!) {
            verify(input: $input) {
              token
              email
            }
          }
        `
      );

      onMounted(async () => {
        const { data } = await verifyEmail({
          input: { token: token as string },
        });

        if (data) {
          store.commit("login", data.verify.token);

          router.push({
            name: "email-verification-success",
            params: { email: data.verify.email },
          });

          store.dispatch("pushNotification", {
            type: "success",
            message: "Verified email successfully!",
          });
        } else {
          store.dispatch("pushNotification", {
            type: "error",
            message: "Failed to verify email. Please try again later",
          });
        }
      });
    },
  });

  export default VerifyEmail;
</script>
