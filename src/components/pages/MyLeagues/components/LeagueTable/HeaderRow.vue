<template>
  <tr class="h-12">
    <th class="w-14" />
    <th />
    <th class="w-32 text-center">Place</th>
    <th class="w-32 text-center">Lineup Set?</th>
    <th class="w-32 text-center">Edit Lineup</th>
    <th class="w-64" />
  </tr>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  const HeaderRow = defineComponent({});

  export default HeaderRow;
</script>

<style lang="postcss" scoped>
  th {
    @apply font-medium text-sm;
  }
</style>
