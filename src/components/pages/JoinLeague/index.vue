<template>
  <div class="h-full px-20 py-9 bg-gray-darkest gap-8">
    <h1 class="text-white mb-8">Join a League</h1>
    <div class="bg-gray-dark rounded-xl px-6 py-6">
      <h2 class="text-white mb-4">Search</h2>
      <div class="flex flex-col">
        <label class="font-thin">League Name</label>
        <div class="flex items-center mb-6">
          <input
            class="bg-gray-dark border border-white rounded-lg px-2 h-8"
            aria-label="League Name"
          />

          <button class="w-8 h-8 ml-2 rounded-full bg-pink text-gray-dark px-1">
            <SearchIcon />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SearchIcon from '@/assets/search.svg';

const JoinLeague = defineComponent({
  name: 'JoinLeague',
  components: {
    SearchIcon,
  },
});

export default JoinLeague;
</script>
