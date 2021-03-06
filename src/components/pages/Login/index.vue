<template>
  <div class="flex justify-center">
    <GradientOverlay />

    <div class="z-10 flex flex-col w-1/4 mt-10">
      <h1 class="mb-6 text-xl text-center">Log in</h1>

      <label class="mb-2 text-xs font-thin">Email</label>
      <input class="mb-4 input" type="email" v-model="email" />

      <div class="flex justify-between mb-2 text-xs font-thin">
        <label>Password</label>
        <router-link class="text-pink" to="/">Forgot password?</router-link>
      </div>
      <input class="input mb-14" type="password" v-model="password" />

      <button class="self-center btn-primary" @click="handleSubmit">Log in</button>
    </div>
  </div>
</template>

<script lang="ts">
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import GradientOverlay from "@/components/simple/GradientOverlay/index.vue";

const Login = defineComponent({
  name: "Login",

  components: {
    GradientOverlay,
  },

  setup() {
    const router = useRouter();
    const store = useStore();

    const { mutate: login } = useMutation(
      gql`
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            token
          }
        }
      `
    );

    const email = ref("");
    const password = ref("");

    async function handleSubmit() {
      const { data } = await login(
        { input: { email: email.value, password: password.value } },
        { errorPolicy: "ignore" }
      );

      if (data) {
        store.commit("login", data.login.token);

        store.dispatch("pushNotification", {
          type: "success",
          message: "Login successful!",
        });

        router.push({ path: "/my-leagues" });
      } else {
        store.dispatch("pushNotification", {
          type: "error",
          message: "Invalid credentials. The email or password is incorrect.",
        });
      }
    }

    return {
      email,
      password,
      handleSubmit,
    };
  },
});

export default Login;
</script>

<style scoped>
input[type="password"] {
  font-family: Verdana, sans-serif;
  letter-spacing: 0.125rem;
}
</style>
