<template>
  <div class="flex flex-col mx-40">
    <h1 class="my-8">My Profile</h1>

    <section class="relative flex flex-col w-1/2 px-8 pt-6 pb-8 mx-auto bg-gray-dark rounded-3xl">
      <h2 class="mb-4">Change Password</h2>

      <ChangePasswordForm />
    </section>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import ChangePasswordForm from "./components/ChangePasswordForm/index.vue";

  const ChangePassword = defineComponent({
    components: {
      ChangePasswordForm,
    },
  });

  export default ChangePassword;
</script>
