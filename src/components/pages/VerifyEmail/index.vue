<template></template>

<script lang="ts">
  import { useMutation } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { defineComponent, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useStore } from "vuex";

  const VerifyEmail = defineComponent({
    name: "VerifyEmail",

    setup() {
      const router = useRouter();
      const route = useRoute();
      const store = useStore();

      const { mutate: verifyEmail } = useMutation(
        gql`
          mutation VerifyUser($input: VerifyInput!) {
            verify(input: $input) {
              token
              email
            }
          }
        `
      );

      onMounted(async () => {
        const { data } = await verifyEmail({
          input: { token: route.query.token },
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
            message: "Failed to verify email. Try again later",
          });
        }
      });
    },
  });

  export default VerifyEmail;
</script>
