<template>
  <div class="flex flex-col mx-40">
    <h1 class="my-8">Create a League</h1>

    <section class="flex flex-col w-1/2 px-8 pt-6 pb-8 mx-auto bg-gray-dark rounded-xl">
      <h2 class="mb-4">League Details</h2>

      <CreateLeagueForm />
    </section>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import CreateLeagueForm from "./components/CreateLeagueForm/index.vue";

  const CreateLeague = defineComponent({
    components: {
      CreateLeagueForm,
    },
  });

  export default CreateLeague;
</script>
