<template>
  <div class="h-full gap-8 px-20 py-9 bg-gray-darkest">
    <h1 class="mb-8 text-white">Join a League</h1>
    <div class="px-6 py-6 bg-gray-dark rounded-xl">
      <h2 class="mb-4 text-white">Search</h2>
      <div class="flex flex-col">
        <label class="font-thin">League Name</label>
        <div class="flex items-center mb-6">
          <input
            class="h-8 px-2 border border-white rounded-lg bg-gray-dark"
            aria-label="League Name"
          />

          <button class="w-8 h-8 px-1 ml-2 rounded-full bg-pink text-gray-dark">
            <SearchIcon />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchIcon from "@/assets/search.svg";

const JoinLeague = defineComponent({
  name: "JoinLeague",
  components: {
    SearchIcon,
  },
});

export default JoinLeague;
</script>
