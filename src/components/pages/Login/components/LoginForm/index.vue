<template>
  <form class="flex flex-col" @submit="onSubmit">
    <label for="email">Email</label>
    <Input id="email" type="email" v-model:value="email" :error="errors.email" />

    <div class="flex items-end justify-between mt-2">
      <label for="password">Password</label>

      <router-link class="text-pink txt-label" :to="{ name: 'forgot-password' }">
        Forgot password?
      </router-link>
    </div>
    <Input id="password" type="password" v-model:value="password" :error="errors.password" />

    <button
      class="self-center mt-8 btn-primary"
      type="submit"
      :disabled="!canSubmit"
      @click="onSubmit"
    >
      Log in
    </button>
  </form>
</template>

<script lang="ts">
  import { useMutation } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { useField, useForm } from "vee-validate";
  import { computed, defineComponent } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useStore } from "vuex";
  import { object, string } from "yup";

  import Input from "@/components/common/Input/index.vue";

  type TLoginResult = { login: { token: string } };
  type TLoginVariables = { input: { email: string; password: string } };

  const LoginForm = defineComponent({
    name: "LoginForm",

    components: {
      Input,
    },

    setup() {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();

      const { mutate: login } = useMutation<TLoginResult, TLoginVariables>(
        gql`
          mutation Login($input: LoginInput!) {
            login(input: $input) {
              token
            }
          }
        `
      );

      const { errors, handleSubmit, meta } = useForm({
        validationSchema: object({
          email: string()
            .email("Invalid email address")
            .required("You must provide an email address."),

          password: string().required("You must provide a password."),
        }),
      });

      const { value: email } = useField<string | undefined>("email");
      const { value: password } = useField<string | undefined>("password");

      const canSubmit = computed(() => meta.value.valid);

      const onSubmit = handleSubmit(async (values) => {
        const { data, errors } = await login({
          input: { email: values.email!, password: values.password! },
        });

        if (data) {
          store.commit("login", data.login.token);

          const routeName = (route.query.redirect as string) ?? "my-leagues";
          router.push({ name: routeName });

          store.dispatch("pushNotification", {
            type: "success",
            message: "Logged in successfully!",
          });
        } else if (errors?.some((x) => x.extensions?.code === "INVALID_CREDENTIALS")) {
          store.dispatch("pushNotification", {
            type: "error",
            message: "Invalid credentials. The email or password is incorrect.",
          });
        } else if (errors?.some((x) => x.extensions?.code === "UNVERIFIED_USER")) {
          router.push({
            name: "email-verification-sent",
            params: { email: values.email! },
          });

          store.dispatch("pushNotification", {
            type: "error",
            message: "Your email address has not been verified.",
          });
        } else {
          store.dispatch("pushNotification", {
            type: "error",
            message: "Failed to log in. Please try again later",
          });
        }
      });

      return {
        email,
        password,
        errors,
        canSubmit,
        onSubmit,
      };
    },
  });

  export default LoginForm;
</script>
