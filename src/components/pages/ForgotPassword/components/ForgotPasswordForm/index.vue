<template>
  <form class="flex flex-col" @submit="onSubmit">
    <label for="email">Email</label>
    <Input id="email" type="email" v-model:value="email" :error="errors.email" />

    <button
      class="self-center mt-8 btn-primary"
      type="submit"
      :disabled="!canSubmit"
      @click="onSubmit"
    >
      Send reset link
    </button>
  </form>
</template>

<script lang="ts">
  import { useMutation } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { useField, useForm } from "vee-validate";
  import { computed, defineComponent } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import { object, string } from "yup";

  import Input from "@/components/common/Input/index.vue";

  type TSendPasswordResetEmailResult = { sendPasswordResetEmail: { success: boolean } };
  type TSendPasswordResetEmailVariables = { email: string };

  const ForgotPasswordForm = defineComponent({
    components: {
      Input,
    },

    setup() {
      const store = useStore();
      const router = useRouter();

      const { mutate: sendPasswordResetEmail } = useMutation<
        TSendPasswordResetEmailResult,
        TSendPasswordResetEmailVariables
      >(
        gql`
          mutation SendPasswordResetEmail($email: String!) {
            sendPasswordResetEmail(email: $email) {
              success
            }
          }
        `
      );

      const { errors, handleSubmit, meta } = useForm({
        validationSchema: object({
          email: string()
            .email("Invalid email address")
            .required("You must provide an email address."),
        }),
      });

      const { value: email } = useField<string | undefined>("email");

      const canSubmit = computed(() => meta.value.valid);

      const onSubmit = handleSubmit(async (values) => {
        const { data } = await sendPasswordResetEmail({
          email: values.email!,
        });

        if (data) {
          router.push({
            name: "password-reset-sent",
            params: { email: values.email! },
          });

          store.dispatch("pushNotification", {
            type: "success",
            message: "Password reset link sent successfully!",
          });
        } else {
          store.dispatch("pushNotification", {
            type: "error",
            message: "Failed to send password reset. Please try again later",
          });
        }
      });

      return {
        email,
        errors,
        canSubmit,
        onSubmit,
      };
    },
  });

  export default ForgotPasswordForm;
</script>
