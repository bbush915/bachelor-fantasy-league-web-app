<template>
  <div class="h-full px-20 py-9 bg-gray-darkest gap-8">
    <h1 class="text-white mb-8">Join a League</h1>
    <div class="bg-gray-dark rounded-xl px-6 py-6">
      <h2 class="text-white mb-4">Search</h2>
      <input
        class="bg-gray-dark border border-white rounded-lg"
        aria-label="League Name"
      />
      <button class="w-8 h-8 ml-2 rounded-full bg-pink text-gray-dark">
        Search
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const JoinLeague = defineComponent({
  name: 'JoinLeague',
});

export default JoinLeague;
</script>
