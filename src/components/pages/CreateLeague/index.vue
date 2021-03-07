<template>
  <div class="flex flex-col items-center pt-6 pb-8">
    <div class="flex flex-col self-start mb-6 ml-40">
      <h1 class="text-3xl">Create a League</h1>
    </div>

    <div class="flex flex-col w-3/5 p-8 bg-gray-dark rounded-3xl">
      <h1 class="text-lg">League Details</h1>

      <label class="text-xs font-thin">League Name</label>
      <input class="input" type="text" />

      <label class="text-xs font-thin">League Description</label>
      <textarea class="input" />

      <label class="text-xs font-thin">Upload Image</label>
      <div class="w-48 h-48 bg-gray rounded-3xl"></div>

      <div class="flex items-center">
        <input id="is-public" type="checkbox" />

        <label class="ml-2 text-sm font-thin" for="is-public"> Anyone can join</label>
      </div>

      <div class="flex items-center">
        <input id="is-shareable" type="checkbox" />

        <label class="ml-2 text-sm font-thin" for="is-shareable">
          Members can invite new members
        </label>
      </div>

      <button class="btn-primary">Save</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const CreateLeague = defineComponent({
  name: "CreateLeague",
});

export default CreateLeague;
</script>

<style scoped>
input[type="checkbox"] {
  background: transparent;
  border: 1px solid white;
}
</style>
