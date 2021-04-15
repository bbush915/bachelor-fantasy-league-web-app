<template>
  <tr class="h-16">
    <th />

    <th class="text-left">Contestant</th>

    <th class="text-center">Received Rose</th>

    <th>
      <div class="flex items-center justify-center">
        <span>Rose Bonus</span>

        <div
          v-tooltip="'Contestant received a rose outside of a rose ceremony'"
          class="w-4 h-4 ml-2"
        >
          <InfoIcon />
        </div>
      </div>
    </th>

    <th class="text-center">Group Date</th>

    <th class="text-center">1 on 1 Date</th>

    <th class="text-center">2 on 1 Date</th>

    <th>
      <div class="flex items-center justify-center">
        <span>Sent Home</span>

        <div
          v-tooltip="'Contestant left or went home outside of a rose ceremony'"
          class="w-4 h-4 ml-2"
        >
          <InfoIcon />
        </div>
      </div>
    </th>

    <th class="pr-4 text-right">Total</th>
  </tr>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import InfoIcon from "@/assets/info.svg";

  const HeaderRow = defineComponent({
    name: "HeaderRow",

    components: {
      InfoIcon,
    },
  });

  export default HeaderRow;
</script>

<style lang="postcss" scoped>
  th {
    @apply font-medium;
  }
</style>
