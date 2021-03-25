<template>
  <div>
    <GradientOverlay />

    <div class="relative flex flex-col items-center">
      <h2 class="my-8">Sign up</h2>

      <form class="flex flex-col registration-form" @submit="onSubmit">
        <label for="email">Email</label>

        <Input id="email" type="email" v-model:value="email" :error="errors.email" />

        <label class="mt-2" for="display-name">Display name</label>

        <Input
          id="display-name"
          type="text"
          v-model:value="displayName"
          :error="errors.displayName"
        />

        <label class="mt-2" for="password">Password</label>

        <Input id="password" type="password" v-model:value="password" :error="errors.password" />

        <label class="mt-2" for="password-confirmation">Re-enter password</label>

        <Input
          id="password-confirmation"
          type="password"
          v-model:value="passwordConfirmation"
          :error="errors.passwordConfirmation"
        />

        <button
          class="self-center mt-8 btn-primary"
          type="submit"
          :disabled="!canSubmit"
          @click="onSubmit"
        >
          Sign up
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { useField, useForm } from "vee-validate";
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import * as Yup from "yup";

import GradientOverlay from "@/components/common/GradientOverlay/index.vue";
import Input from "@/components/common/Input/index.vue";

const Registration = defineComponent({
  name: "Registration",

  components: {
    GradientOverlay,
    Input,
  },

  setup() {
    const router = useRouter();
    const store = useStore();

    const { errors, handleSubmit, meta, setFieldError } = useForm({
      validationSchema: Yup.object({
        email: Yup.string()
          .email("Invalid email address")
          .required("You must provide an email address."),

        displayName: Yup.string().required("You must provide a display name."),

        password: Yup.string()
          .min(8, "Password must be at least 8 characters long.")
          .required("You must provide a password."),

        passwordConfirmation: Yup.string()
          .oneOf([Yup.ref("password")], "Passwords do not match.")
          .required("You must confirm the password."),
      }),
    });

    const { value: email } = useField("email");
    const { value: displayName } = useField("displayName");
    const { value: password } = useField("password");
    const { value: passwordConfirmation } = useField("passwordConfirmation");

    const canSubmit = computed(() => meta.value.valid);

    const { mutate: register } = useMutation(
      gql`
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            id
          }
        }
      `
    );

    const onSubmit = handleSubmit(async (values) => {
      const { data, errors } = await register(
        {
          input: {
            email: values.email,
            displayName: values.displayName,
            password: values.password,
          },
        },
        { errorPolicy: "all" }
      );

      if (data) {
        router.push({ name: "email-verification-sent", params: { email: values.email! } });

        store.dispatch("pushNotification", {
          type: "success",
          message: "Account created successfully!",
        });
      } else {
        if (errors?.some((x) => x.extensions?.code === "EMAIL_ALREADY_EXISTS")) {
          setFieldError("email", "An account with that email address already exists.");
        }

        store.dispatch("pushNotification", {
          type: "error",
          message: "Failed to create account.",
        });
      }
    });

    return {
      email,
      displayName,
      password,
      passwordConfirmation,
      errors,
      canSubmit,
      onSubmit,
    };
  },
});

export default Registration;
</script>

<style scoped>
.registration-form {
  width: 400px;
}
</style>
