<template>
  <div class="flex flex-col items-center pt-6 pb-8">
    <div class="flex flex-col self-start mb-6 ml-40">
      <h1 class="text-3xl">Join a League</h1>
    </div>

    <div class="flex flex-col w-3/5 p-8 bg-gray-dark rounded-3xl">
      <h1 class="text-lg">Search</h1>

      <label for="league-name" class="text-xs font-thin">League Name</label>

      <div class="flex items-center w-1/2">
        <input id="league-name" class="flex-grow mr-2 input" type="text" />

        <button class="flex items-center justify-center rounded-full w-9 h-9 bg-pink">
          <SearchIcon />
        </button>
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
