<template>
  <div class="flex justify-center">
    <GradientOverlay />

    <div class="z-10 flex flex-col w-1/4 mt-10">
      <h1 class="mb-6 text-xl text-center">Create Account</h1>

      <label class="mb-2 text-xs font-thin">Email</label>
      <input class="mb-4 input" type="email" v-model="email" />

      <label class="mb-2 text-xs font-thin">Display name</label>
      <input class="mb-4 input" type="text" v-model="displayName" />

      <label class="mb-2 text-xs font-thin">Password</label>
      <input class="mb-4 text-2xl input" type="password" v-model="password" />

      <label class="mb-2 text-xs font-thin">Re-enter password</label>
      <input class="text-2xl input mb-14" type="password" v-model="passwordConfirmation" />

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

const Registration = defineComponent({
  name: "Registration",

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
    const displayName = ref("");
    const password = ref("");
    const passwordConfirmation = ref("");

    async function handleSubmit() {
      const { data } = await register(
        { input: { email: email.value, displayName: displayName.value, password: password.value } },
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
      displayName,
      password,
      passwordConfirmation,
      handleSubmit,
    };
  },
});

export default Registration;
</script>

<style scoped>
input {
  background: transparent;
}
</style>
