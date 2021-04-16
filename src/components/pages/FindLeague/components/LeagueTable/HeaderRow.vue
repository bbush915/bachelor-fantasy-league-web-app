<template>
  <tr class="h-12">
    <th class="text-left w-96">League</th>
    <th class="text-left w-96">Commissioner</th>
    <th />
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
