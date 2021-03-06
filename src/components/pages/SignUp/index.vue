<template>
  <div class="flex justify-center">
    <GradientOverlay />

    <div class="z-10 flex flex-col w-1/4 mt-10">
      <h1 class="mb-6 text-xl text-center">Create Account</h1>

      <label class="mb-2 text-xs font-thin">Email</label>
      <input
        class="h-10 px-3 mb-4 text-lg font-thin border border-white rounded-xl"
        type="email"
        v-model="email"
      />

      <label class="mb-2 text-xs font-thin">Username</label>
      <input
        class="h-10 px-3 mb-4 text-lg font-thin border border-white rounded-xl"
        type="email"
        v-model="username"
      />

      <label class="mb-2 text-xs font-thin">Password</label>
      <input
        class="h-10 px-3 mb-4 text-2xl border border-white rounded-xl"
        type="password"
        v-model="password"
      />

      <label class="mb-2 text-xs font-thin">Re-enter password</label>
      <input
        class="h-10 px-3 text-2xl border border-white rounded-xl mb-14"
        type="password"
        v-model="passwordConfirmation"
      />

      <button class="self-center btn-primary" @click="handleSubmit">Sign up</button>
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

const SignUp = defineComponent({
  name: "SignUp",

  components: {
    GradientOverlay,
  },

  setup() {
    const router = useRouter();
    const store = useStore();

    const { mutate: register } = useMutation(
      gql`
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            id
          }
        }
      `
    );

    const email = ref("");
    const username = ref("");
    const password = ref("");
    const passwordConfirmation = ref("");

    async function handleSubmit() {
      const { data } = await register(
        { input: { email: email.value, username: username.value, password: password.value } },
        { errorPolicy: "ignore" }
      );

      if (data) {
        router.push({ path: "/login" });

        store.dispatch("pushNotification", {
          type: "success",
          message: "Account created successfully!",
        });
      } else {
        store.dispatch("pushNotification", {
          type: "error",
          message: "Failed to create account.",
        });
      }
    }

    return {
      email,
      username,
      password,
      passwordConfirmation,
      handleSubmit,
    };
  },
});

export default SignUp;
</script>

<style scoped>
input {
  background: transparent;
}
</style>
