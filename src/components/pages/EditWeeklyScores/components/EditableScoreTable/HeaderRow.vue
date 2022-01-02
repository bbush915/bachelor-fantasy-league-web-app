<template>
  <tr class="h-16">
    <th></th>

    <th class="text-left">Contestant</th>

    <th class="text-center">Received Rose</th>

    <th class="text-center">Rose Bonus</th>

    <th class="text-center">Group Date</th>

    <th class="text-center">1 on 1 Date</th>

    <th class="text-center">2 on 1 Date</th>

    <th class="text-center">Sent Home</th>
  </tr>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  const HeaderRow = defineComponent({});

  export default HeaderRow;
</script>

<style lang="postcss" scoped>
  th {
    @apply font-medium;
  }
</style>
