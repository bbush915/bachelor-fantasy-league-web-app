<template>
  <div>
    <GradientOverlay />

    <section class="relative mx-auto registration__content">
      <h2 class="my-8 text-center">Sign up</h2>

      <RegistrationForm />
    </section>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import GradientOverlay from "@/components/common/GradientOverlay/index.vue";
  import RegistrationForm from "./components/RegistrationForm/index.vue";

  const Registration = defineComponent({
    components: {
      GradientOverlay,
      RegistrationForm,
    },
  });

  export default Registration;
</script>

<style scoped>
  .registration__content {
    width: 400px;
  }
</style>
