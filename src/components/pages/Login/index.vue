<template>
  <div>
    <GradientOverlay />

    <section class="relative mx-auto login__content">
      <h2 class="my-8 text-center">Log in</h2>

      <LoginForm />
    </section>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import GradientOverlay from "@/components/common/GradientOverlay/index.vue";
  import LoginForm from "./components/LoginForm/index.vue";

  const Login = defineComponent({
    components: {
      GradientOverlay,
      LoginForm,
    },
  });

  export default Login;
</script>

<style scoped>
  .login__content {
    width: 400px;
  }
</style>
